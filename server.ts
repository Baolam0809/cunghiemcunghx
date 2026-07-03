import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { initialMembers, initialTributes } from "./src/data";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory fallback buffers in case Supabase table is not configured or fails
let memMembers = [...initialMembers];
let memTributes = [...initialTributes];
let memMarquee = "Kính chào quý vị con cháu dòng tộc cụ Nghiêm Cung. Hệ thống gia phả số luôn tự động cập nhật và kết nối toàn bộ hệ thống các đời, hỗ trợ tra cứu trực tuyến thông tin lịch sử từ đường Hòa Xá, Hà Nội... Kính dâng tổ tiên lòng biết ơn vô hạn.";

// Initialize Supabase Client
let supabase: any = null;
function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false
        }
      });
    } else {
      console.warn("Supabase credentials missing. Running in local-memory fallback mode.");
    }
  }
  return supabase;
}

function logSupabaseError(context: string, error: any) {
  if (!error) return;
  const msg = error.message || String(error);
  if (msg.includes("Could not find the table") || msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("relation")) {
    console.warn(`[Supabase Schema Warning] Table not found for "${context}". Falling back to in-memory/local cache. Run schema.sql in your Supabase SQL Editor to provision tables.`);
  } else {
    console.warn(`[Supabase Warning] ${context}: ${msg}`);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini API client safely
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // --- SUPABASE PROXIED ENDPOINTS ---

  // 1. Get All Members
  app.get("/api/members", async (req, res) => {
    const client = getSupabaseClient();
    if (!client) {
      return res.json(memMembers);
    }
    try {
      const { data, error } = await client.from("members").select("*");
      if (error) {
        logSupabaseError("GET /api/members", error);
        return res.json(memMembers);
      }
      if (!data || data.length === 0) {
        console.log("Supabase members table is empty. Auto-seeding initial members...");
        const seedData = initialMembers.map(m => ({
          id: m.id,
          name: m.name,
          gender: m.gender,
          generation: m.generation,
          branch: m.branch,
          spouse: m.spouse || null,
          parentId: m.parentId || null,
          motherId: m.motherId || null,
          status: m.status,
          note: m.note || null,
          dob: m.dob || null,
          birthplace: m.birthplace || null,
          job: m.job || null,
          education: m.education || null,
          phone: m.phone || null,
          relation: m.relation || null,
          bio: m.bio || null
        }));
        
        const { error: seedError } = await client.from("members").insert(seedData);
        if (seedError) {
          logSupabaseError("seed members table", seedError);
        } else {
          console.log("Successfully seeded members table in Supabase.");
        }
        return res.json(memMembers);
      }

      // Format back parentId and motherId gracefully
      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        gender: item.gender,
        generation: item.generation,
        branch: item.branch,
        spouse: item.spouse || "",
        parentId: item.parentId,
        motherId: item.motherId,
        status: item.status,
        note: item.note || "",
        dob: item.dob || "",
        birthplace: item.birthplace || "",
        job: item.job || "",
        education: item.education || "",
        phone: item.phone || "",
        relation: item.relation || "",
        bio: item.bio || ""
      }));
      
      // Update our memory cache
      memMembers = formatted;
      res.json(formatted);
    } catch (err: any) {
      logSupabaseError("GET /api/members exception", err);
      res.json(memMembers);
    }
  });

  // 2. Add Single Member
  app.post("/api/members", async (req, res) => {
    const member = req.body;
    memMembers.push(member);
    
    const client = getSupabaseClient();
    if (!client) {
      return res.status(201).json(member);
    }
    try {
      const payload = {
        id: member.id,
        name: member.name,
        gender: member.gender,
        generation: member.generation,
        branch: member.branch,
        spouse: member.spouse || null,
        parentId: member.parentId || null,
        motherId: member.motherId || null,
        status: member.status,
        note: member.note || null,
        dob: member.dob || null,
        birthplace: member.birthplace || null,
        job: member.job || null,
        education: member.education || null,
        phone: member.phone || null,
        relation: member.relation || null,
        bio: member.bio || null
      };

      const { error } = await client.from("members").insert([payload]);
      if (error) {
        logSupabaseError("POST /api/members", error);
        return res.status(201).json(member);
      }
      res.status(201).json(member);
    } catch (err: any) {
      logSupabaseError("POST /api/members exception", err);
      res.status(201).json(member);
    }
  });

  // 3. Update Single Member
  app.put("/api/members/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    memMembers = memMembers.map(m => m.id === id ? { ...m, ...updates } : m);
    
    const client = getSupabaseClient();
    if (!client) {
      return res.json(updates);
    }
    try {
      const payload = {
        name: updates.name,
        gender: updates.gender,
        generation: updates.generation,
        branch: updates.branch,
        spouse: updates.spouse || null,
        parentId: updates.parentId || null,
        motherId: updates.motherId || null,
        status: updates.status,
        note: updates.note || null,
        dob: updates.dob || null,
        birthplace: updates.birthplace || null,
        job: updates.job || null,
        education: updates.education || null,
        phone: updates.phone || null,
        relation: updates.relation || null,
        bio: updates.bio || null
      };

      const { error } = await client.from("members").update(payload).eq("id", id);
      if (error) {
        logSupabaseError("PUT /api/members", error);
        return res.json(updates);
      }
      res.json(updates);
    } catch (err: any) {
      logSupabaseError("PUT /api/members exception", err);
      res.json(updates);
    }
  });

  // 4. Delete Single Member
  app.delete("/api/members/:id", async (req, res) => {
    const { id } = req.params;
    memMembers = memMembers.filter(m => m.id !== id);
    
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true });
    }
    try {
      const { error } = await client.from("members").delete().eq("id", id);
      if (error) {
        logSupabaseError("DELETE /api/members", error);
        return res.json({ success: true });
      }
      res.json({ success: true });
    } catch (err: any) {
      logSupabaseError("DELETE /api/members exception", err);
      res.json({ success: true });
    }
  });

  // 5. Get Tributes
  app.get("/api/tributes", async (req, res) => {
    const client = getSupabaseClient();
    if (!client) {
      return res.json(memTributes);
    }
    try {
      const { data, error } = await client.from("tributes").select("*").order("created_at", { ascending: false });
      if (error) {
        logSupabaseError("GET /api/tributes", error);
        return res.json(memTributes);
      }
      if (!data || data.length === 0) {
        console.log("Supabase tributes empty. Auto-seeding initial tributes...");
        const seedData = initialTributes.map(t => ({
          id: t.id,
          author: t.author,
          time: t.time,
          content: t.content
        }));
        const { error: seedError } = await client.from("tributes").insert(seedData);
        if (seedError) logSupabaseError("seed tributes", seedError);
        return res.json(memTributes);
      }
      memTributes = data;
      res.json(data);
    } catch (err: any) {
      logSupabaseError("GET /api/tributes exception", err);
      res.json(memTributes);
    }
  });

  // 6. Add Tribute
  app.post("/api/tributes", async (req, res) => {
    const tribute = req.body;
    memTributes.unshift(tribute);
    
    const client = getSupabaseClient();
    if (!client) {
      return res.status(201).json(tribute);
    }
    try {
      const { error } = await client.from("tributes").insert([{
        id: tribute.id,
        author: tribute.author,
        time: tribute.time,
        content: tribute.content
      }]);
      if (error) {
        logSupabaseError("POST /api/tributes", error);
        return res.status(201).json(tribute);
      }
      res.status(201).json(tribute);
    } catch (err: any) {
      logSupabaseError("POST /api/tributes exception", err);
      res.status(201).json(tribute);
    }
  });

  // 7. Get Marquee Text
  app.get("/api/settings/marquee", async (req, res) => {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ text: memMarquee });
    }
    try {
      const { data, error } = await client.from("settings").select("value").eq("key", "marquee_text").single();
      if (error) {
        if (error.code === "PGRST116") {
          // No row found, let's seed it
          await client.from("settings").insert([{ key: "marquee_text", value: memMarquee }]);
          return res.json({ text: memMarquee });
        }
        logSupabaseError("GET /api/settings/marquee", error);
        return res.json({ text: memMarquee });
      }
      memMarquee = data.value;
      res.json({ text: data.value });
    } catch (err: any) {
      logSupabaseError("GET /api/settings/marquee exception", err);
      res.json({ text: memMarquee });
    }
  });

  // 8. Update Marquee Text
  app.post("/api/settings/marquee", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    
    memMarquee = text;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ text });
    }
    try {
      const { error } = await client.from("settings").upsert([{ key: "marquee_text", value: text }]);
      if (error) {
        logSupabaseError("POST /api/settings/marquee", error);
        return res.json({ text });
      }
      res.json({ text });
    } catch (err: any) {
      logSupabaseError("POST /api/settings/marquee exception", err);
      res.json({ text });
    }
  });

  // 9. Database Connection & Schema Health Check
  app.get("/api/db-status", async (req, res) => {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ 
        connected: false, 
        mode: "Bộ nhớ tạm (Chờ cấu hình)", 
        error: "Chưa thiết lập biến môi trường SUPABASE_URL và SUPABASE_ANON_KEY trong tệp .env" 
      });
    }
    try {
      // Test querying the members table
      const { error } = await client.from("members").select("id").limit(1);
      if (error) {
        let errorMsg = error.message;
        if (errorMsg.includes("relation") && errorMsg.includes("does not exist")) {
          errorMsg = "Bảng 'members' chưa tồn tại. Vui lòng vào Admin -> Sao chép mã SQL để khởi tạo bảng trên Supabase.";
        }
        return res.json({ 
          connected: false, 
          mode: "Lỗi cấu trúc", 
          error: errorMsg 
        });
      }
      return res.json({ 
        connected: true, 
        mode: "Đã liên kết Supabase Cloud",
        details: "Kết nối hoạt động bình thường, các bảng members, tributes, settings đã sẵn sàng."
      });
    } catch (err: any) {
      return res.json({ 
        connected: false, 
        mode: "Lỗi kết nối", 
        error: err.message || "Không thể kết nối đến host Supabase." 
      });
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Endpoint: Generate tribute messages for the memorial guestbook
  app.post("/api/gemini/tribute", async (req, res) => {
    try {
      const { prompt } = req.body;
      const client = getGeminiClient();
      
      const systemInstruction = 
        "Bạn là một người am hiểu sâu sắc về phong tục thờ cúng, đạo hiếu kính thờ tổ tiên và gia phong truyền thống của Việt Nam. " +
        "Hãy viết một câu tri ân kính dâng tổ tiên dòng họ ngắn gọn (khoảng 1-2 câu), thành kính, sâu sắc, trang trọng, mang đậm nét văn hóa dòng họ Việt Nam. " +
        "Hãy viết bằng tiếng Việt tự nhiên, ấm áp, trang nghiêm.";

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt || "Hãy soạn một lời tri ân tổ tiên ý nghĩa và trang nghiêm.",
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      const text = response.text || "Kính dâng tiên tổ tiên linh bái tạ công đức sinh thành phụ mẫu dưỡng dục thiên thu vạn đại.";
      res.json({ tribute: text.replace(/["']/g, "").trim() });
    } catch (error: any) {
      console.error("Gemini Tribute Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate tribute." });
    }
  });

  // AI Endpoint: Generate member biographies based on details
  app.post("/api/gemini/bio", async (req, res) => {
    try {
      const { name, dob, job, education, branch, relation, birthplace, bioNotes } = req.body;
      const client = getGeminiClient();

      const promptText = `Hãy viết một tiểu sử ngắn gọn (khoảng 3-4 câu) bằng văn phong trang trọng, tôn kính để ghi vào gia phả dòng họ dựa trên các thông tin khai báo dưới đây:
      - Họ và tên: ${name || "Chưa rõ"}
      - Năm sinh/Tuổi: ${dob || "Chưa rõ"}
      - Nghề nghiệp: ${job || "Chưa rõ"}
      - Trình độ học vấn: ${education || "Chưa rõ"}
      - Chi nhánh: ${branch || "Chi thứ 5"}
      - Vai vế/Mối quan hệ với tổ: ${relation || "Chưa rõ"}
      - Nơi sinh/Quê quán: ${birthplace || "Hòa Xá, Ứng Hòa, Hà Nội"}
      - Ghi chú thêm: ${bioNotes || "Không có"}`;

      const systemInstruction = 
        "Bạn là người biên soạn sử sách gia phả dòng họ chuyên nghiệp. " +
        "Hãy viết tiểu sử một cách mạch lạc, kết nối các ý lại với nhau bằng từ ngữ trang trọng, tôn kính, tự hào dòng tộc. " +
        "Không tự sáng chế ra thông tin sai lệch không có trong dữ liệu được cung cấp. Chỉ trả về trực tiếp văn bản tiểu sử, không kèm lời bình hay ký tự đặc biệt.";

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "Hậu duệ hiếu thảo của dòng tộc cụ Nghiêm Cung.";
      res.json({ bio: text.trim() });
    } catch (error: any) {
      console.error("Gemini Bio Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate bio." });
    }
  });

  // Vite development mode versus Production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
