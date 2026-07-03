import React, { useState, useEffect } from "react";
import { Member } from "../types";
import { deductLunarCalendar } from "../utils/lunar";
import { 
  ShieldAlert, 
  RefreshCcw, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Calendar,
  X,
  FileSpreadsheet,
  Database,
  Copy,
  Check,
  Terminal
} from "lucide-react";

interface AdminPanelProps {
  members: Member[];
  marqueeText: string;
  onUpdateMarquee: (newText: string) => void;
  onAddMember: (newMember: Member, shouldSync: boolean) => void;
  onTriggerSync: () => void;
}

export default function AdminPanel({
  members,
  marqueeText,
  onUpdateMarquee,
  onAddMember,
  onTriggerSync,
}: AdminPanelProps) {
  // Announcement / Marquee state
  const [localMarquee, setLocalMarquee] = useState(marqueeText);

  // SQL Schema Display States
  const [showSqlSetup, setShowSqlSetup] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form states for New Member
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Nam" | "Nữ">("Nam");
  const [status, setStatus] = useState<"Còn sống" | "Đã mất" | "Mất sớm (Phạp)">("Còn sống");
  const [dob, setDob] = useState("");
  const [generation, setGeneration] = useState(18);
  const [parentId, setParentId] = useState("");
  const [motherId, setMotherId] = useState("");
  const [branch, setBranch] = useState("Chi thứ 5");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [education, setEducation] = useState("");
  const [birthplace, setBirthplace] = useState("Hòa Xá, Ứng Hòa, Hà Nội");
  const [bioNotes, setBioNotes] = useState("");
  const [isInlaw, setIsInlaw] = useState(false);

  // Spouses collector state
  const [spouses, setSpouses] = useState<{ name: string; type: string }[]>([]);
  const [tempSpouseName, setTempSpouseName] = useState("");
  const [tempSpouseType, setTempSpouseType] = useState("Vợ");

  // Lunar output states
  const [lunarOutput, setLunarOutput] = useState<{ lunarYear: string; lunarAge: number; solarAge: number } | null>(null);

  // AI loading state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Automatically update Lunar outputs when dob changes
  useEffect(() => {
    const result = deductLunarCalendar(dob);
    setLunarOutput(result);
  }, [dob]);

  // Sync internal marquee with props
  useEffect(() => {
    setLocalMarquee(marqueeText);
  }, [marqueeText]);

  // Dynamic dropdowns for parents: father must be male and generation - 1
  const parentCandidates = members.filter(
    (m) => m.generation === generation - 1 && m.gender === "Nam"
  );

  // Dynamic mother options: spouses of the selected father node
  const [motherCandidates, setMotherCandidates] = useState<string[]>([]);
  useEffect(() => {
    if (!parentId) {
      setMotherCandidates([]);
      setMotherId("");
      return;
    }
    const father = members.find((m) => m.id === parentId);
    if (father && father.spouse) {
      // Split comma separated spouses
      const wives = father.spouse.split(",").map((w) => w.trim());
      setMotherCandidates(wives);
    } else {
      setMotherCandidates([]);
    }
    setMotherId("");
  }, [parentId, members]);

  // Spouse adding triggers
  const handleAddSpouse = () => {
    if (!tempSpouseName.trim()) {
      alert("Vui lòng nhập tên bạn đời.");
      return;
    }
    setSpouses([...spouses, { name: tempSpouseName.trim(), type: tempSpouseType }]);
    setTempSpouseName("");
  };

  const handleRemoveSpouse = (index: number) => {
    setSpouses(spouses.filter((_, i) => i !== index));
  };

  // AI helper: Bio Summarizer Calls Express backend `/api/gemini/bio`
  const handleGenerateBioAI = async () => {
    if (!name) {
      alert("Vui lòng nhập Họ và Tên thành viên trước khi dùng AI viết tiểu sử.");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/gemini/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dob,
          job,
          education,
          branch,
          relation,
          birthplace,
          bioNotes,
        }),
      });

      const data = await response.json();
      if (data.bio) {
        setBioNotes(data.bio);
      } else {
        // Fallback local description creator
        setBioNotes(
          `Cụ ${name} sinh năm ${dob || "chưa rõ"}, quê quán tại ${birthplace}. Cụ trọn đời cống hiến trong lĩnh vực ${job || "phát triển gia đình"}, luôn giữ tròn đạo hiếu dâng trọn nghĩa tình cho dòng tộc họ Nghiêm.`
        );
      }
    } catch (err) {
      // Graceful fallback draft
      setBioNotes(
        `Cụ ${name} sinh năm ${dob || "chưa rõ"}, quê quán tại ${birthplace}. Cụ trọn đời cống hiến trong lĩnh vực ${job || "phát triển gia đình"}, luôn giữ tròn đạo hiếu dâng trọn nghĩa tình cho dòng tộc họ Nghiêm.`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Submit new member
  const handleFormSubmit = (e: React.FormEvent, shouldSync: boolean) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng điền Họ và Tên thành viên.");
      return;
    }

    // Build rich biographies
    const spousesString = spouses.map((s) => `${s.name} (${s.type})`).join(", ");

    let noteText = `Hậu duệ Đời ${generation}.`;
    if (isInlaw) noteText += " Là Dâu/Rể dòng tộc.";
    if (relation) noteText += ` Vai vế: ${relation}.`;
    if (dob) noteText += ` Năm sinh: ${dob}.`;
    if (birthplace) noteText += ` Quê quán: ${birthplace}.`;
    if (job) noteText += ` Nghề nghiệp: ${job}.`;
    if (education) noteText += ` Học vấn: ${education}.`;
    if (phone) noteText += ` SĐT: ${phone}.`;
    if (bioNotes) noteText += ` Tiểu sử cuộc đời: ${bioNotes}`;

    const newId = `M${generation}_USER_${Date.now()}`;
    const newMember: Member = {
      id: newId,
      name: name.trim(),
      gender,
      generation,
      branch: branch || "Chi thứ 5",
      spouse: spousesString || "Chưa rõ",
      parentId: parentId || null,
      motherId: motherId || null,
      status,
      note: noteText,
      dob,
      birthplace,
      job,
      education,
      phone,
      relation,
      bio: bioNotes,
    };

    onAddMember(newMember, shouldSync);

    // Reset Form fields
    setName("");
    setDob("");
    setSpouses([]);
    setBioNotes("");
    setPhone("");
    setJob("");
    setEducation("");
    setRelation("");
    setIsInlaw(false);
  };

  return (
    <div className="space-y-6">
      {/* Marquee and info editor banner */}
      <div className="bg-white border-2 border-heritage-600 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-heritage-900 flex items-center gap-1.5">
              <ShieldAlert className="w-5 h-5 text-heritage-700" /> Trang Admin Nghiêm Hồng Quân
            </h2>
            <p className="text-xs text-stone-500">
              Quản trị dòng tộc, chỉnh lý các thông báo chữ chạy và phả hệ Hòa Xá
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Trực tuyến
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase text-stone-700 tracking-wider border-l-2 border-heritage-600 pl-2">
            Thay đổi thông báo chạy dưới Menu ngang
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={localMarquee}
              onChange={(e) => setLocalMarquee(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-heritage-500 focus:outline-none text-stone-800"
              placeholder="Nhập nội dung chữ chạy..."
            />
            <button
              onClick={() => {
                onUpdateMarquee(localMarquee);
                alert("Cập nhật dòng chữ thông báo chạy thành công!");
              }}
              className="bg-heritage-800 hover:bg-heritage-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition shrink-0"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>

      {/* Cấu hình Cơ sở dữ liệu Supabase - SQL Setup Instructions */}
      <div id="supabase-sql-setup" className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5.5 h-5.5 text-blue-600 animate-pulse" />
            <div>
              <h2 className="text-sm md:text-base font-serif font-bold text-slate-900 flex items-center gap-1.5">
                Cấu hình Cơ sở dữ liệu Supabase (SQL Queries)
              </h2>
              <p className="text-[11px] text-stone-500">
                Sao chép &amp; chạy mã SQL này trong <strong>SQL Editor</strong> của Supabase để khởi tạo cấu trúc bảng.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSqlSetup(!showSqlSetup)}
            className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-stone-100 transition cursor-pointer"
          >
            {showSqlSetup ? "Thu gọn" : "Mở rộng"}
          </button>
        </div>

        {showSqlSetup && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <p className="font-semibold mb-1">💡 Hướng dẫn nhanh:</p>
              <ul className="list-decimal list-inside space-y-1 text-[11px] text-amber-700">
                <li>Truy cập vào trang quản trị dự án <strong>Supabase Dashboard</strong> của bạn.</li>
                <li>Chọn mục <strong>SQL Editor</strong> ở thanh menu bên trái (biểu tượng chiếc lá hoặc mã SQL).</li>
                <li>Bấm vào <strong>New query</strong> (Tạo truy vấn mới).</li>
                <li>Dán toàn bộ mã SQL bên dưới vào ô soạn thảo và nhấn <strong>Run</strong> (Chạy).</li>
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => {
                    const sqlCode = `-- 1. Tạo bảng members (Thành viên Gia Phả)
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT,
    generation INTEGER NOT NULL,
    branch TEXT,
    spouse TEXT,
    "parentId" TEXT,
    "motherId" TEXT,
    status TEXT,
    note TEXT,
    dob TEXT,
    birthplace TEXT,
    job TEXT,
    education TEXT,
    phone TEXT,
    relation TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tạo bảng tributes (Bút ký dòng tộc)
CREATE TABLE IF NOT EXISTS public.tributes (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    time TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tạo bảng settings (Cấu hình hệ thống, chữ chạy)
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Vô hiệu hóa bảo mật Row Level Security (RLS) để đồng bộ trực tiếp từ ứng dụng
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;`;
                    navigator.clipboard.writeText(sqlCode);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép mã SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800 shadow-inner max-h-[350px] overflow-y-auto">
                <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed">
{`-- 1. Tạo bảng members (Thành viên Gia Phả)
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT,
    generation INTEGER NOT NULL,
    branch TEXT,
    spouse TEXT,
    "parentId" TEXT,
    "motherId" TEXT,
    status TEXT,
    note TEXT,
    dob TEXT,
    birthplace TEXT,
    job TEXT,
    education TEXT,
    phone TEXT,
    relation TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tạo bảng tributes (Bút ký dòng tộc)
CREATE TABLE IF NOT EXISTS public.tributes (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    time TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tạo bảng settings (Cấu hình hệ thống, chữ chạy)
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Vô hiệu hóa bảo mật Row Level Security (RLS) để đồng bộ trực tiếp từ ứng dụng
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;`}
                </pre>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 italic text-center">
              * Lưu ý: Sau khi thực hiện truy vấn trên, cơ sở dữ liệu Supabase của bạn sẽ được kích hoạt đầy đủ 3 bảng để đồng bộ trơn tru với hệ thống phả hệ số.
            </p>
          </div>
        )}
      </div>

      {/* High-fidelity Premium Add Member Form */}
      <div className="bg-heritage-50/40 border border-heritage-300 rounded-2xl p-5 sm:p-6 shadow-md space-y-6">
        <div className="flex items-center gap-2 border-b border-heritage-200 pb-4">
          <Plus className="w-6 h-6 text-heritage-800" />
          <h2 className="text-lg font-serif font-bold text-heritage-900">
            Thêm thành viên mới vào gia phả
          </h2>
        </div>

        {/* Form fields layout */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700">
            
            {/* Column 1: Name, Status & Year of Birth */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-stone-800 mb-1.5">Họ và Tên *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-500"
                  placeholder="ví dụ: Nghiêm Xuân Sơn"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1.5">Tình trạng bản thân *</label>
                <div className="flex gap-4 items-center mt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "Còn sống"}
                      onChange={() => setStatus("Còn sống")}
                      className="accent-heritage-600"
                    />
                    <span>Còn sống</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "Đã mất"}
                      onChange={() => setStatus("Đã mất")}
                      className="accent-heritage-600"
                    />
                    <span>Đã khuất</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "Mất sớm (Phạp)"}
                      onChange={() => setStatus("Mất sớm (Phạp)")}
                      className="accent-heritage-600"
                    />
                    <span>Kính tế (Phạp)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1.5">
                  Năm sinh (Dương lịch)
                </label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-500"
                  placeholder="ví dụ: 1985 hoặc 15-08-1985"
                />
              </div>

              {/* Lunar output box */}
              <div className="bg-red-50/50 border border-red-200 rounded-xl p-3.5 text-red-950">
                <span className="block font-bold text-[10px] tracking-widest text-red-700 uppercase mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Đặc trưng Âm Lịch &amp; Tuổi Gia Tộc
                </span>
                {lunarOutput ? (
                  <div className="text-[11px] leading-relaxed space-y-1">
                    <div>Thiên Can - Địa Chi: <strong className="text-red-800">{lunarOutput.lunarYear}</strong></div>
                    <div>Tuổi mụ (tính đến 2026): <strong className="text-red-800">{lunarOutput.lunarAge} tuổi</strong></div>
                    <div className="text-stone-500">Tuổi Dương: {lunarOutput.solarAge} tuổi</div>
                  </div>
                ) : (
                  <p className="text-[11px] italic text-red-800/80">
                    Vui lòng nhập năm sinh ở trên để tự động suy luận...
                  </p>
                )}
              </div>
            </div>

            {/* Column 2: Parent selector & Spouses */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-stone-800 mb-1.5">Thế hệ (Đời thứ mấy) *</label>
                <select
                  value={generation}
                  onChange={(e) => {
                    setGeneration(parseInt(e.target.value, 10));
                    setParentId("");
                  }}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-heritage-500 text-stone-700 font-medium"
                >
                  <option value={15}>Đời thứ 15</option>
                  <option value={16}>Đời thứ 16</option>
                  <option value={17}>Đời thứ 17</option>
                  <option value={18}>Đời thứ 18</option>
                  <option value={19}>Đời thứ 19</option>
                  <option value={20}>Đời thứ 20</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1.5">Cha trong họ (Thế hệ trước)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-heritage-500 text-stone-700"
                >
                  <option value="">-- Cấp Tổ / Không chọn --</option>
                  {parentCandidates.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Đời {p.generation} - {p.branch})
                    </option>
                  ))}
                </select>
                
                <div className="mt-2 flex items-start gap-2 bg-stone-100 p-2 rounded border border-stone-200">
                  <input
                    type="checkbox"
                    id="isInlaw"
                    checked={isInlaw}
                    onChange={(e) => setIsInlaw(e.target.checked)}
                    className="w-4.5 h-4.5 mt-0.5 text-heritage-600 focus:ring-heritage-500 accent-heritage-600 rounded"
                  />
                  <label htmlFor="isInlaw" className="text-[11px] font-semibold text-stone-700 leading-tight">
                    Thành viên là Dâu / Rể (Cha chồng/bợ gọi là ngoại tộc kết nghĩa)
                  </label>
                </div>
              </div>

              {/* Mother selection loaded from spouses of father */}
              <div className="bg-red-50/50 border border-red-200 rounded-xl p-3">
                <label className="block font-bold text-[10px] uppercase tracking-widest text-red-700 mb-1.5">
                  ● MẸ (CHỌN MẸ DƯỚI CẤP CHA TRONG HỌ)
                </label>
                <select
                  value={motherId}
                  onChange={(e) => setMotherId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-3 focus:outline-none text-stone-700"
                >
                  <option value="">-- Không chọn mẹ --</option>
                  {motherCandidates.map((wife, i) => (
                    <option key={i} value={wife}>
                      {wife}
                    </option>
                  ))}
                </select>
              </div>

              {/* Spouse manager */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-800 mb-1">
                  Bạn Đời (Vợ / Chồng) - Có thể thêm nhiều
                </label>
                
                {/* Spouse listing chips */}
                <div className="text-[11px] text-stone-500 italic bg-stone-100/50 p-2.5 rounded-lg border border-stone-200/80 min-h-8">
                  {spouses.length === 0 ? (
                    "Chưa khai báo bạn đời."
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {spouses.map((sp, i) => (
                        <span
                          key={i}
                          className="bg-red-50 text-red-800 border border-red-200 py-1 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-semibold"
                        >
                          {sp.name} ({sp.type})
                          <button
                            type="button"
                            onClick={() => handleRemoveSpouse(i)}
                            className="text-red-600 hover:text-red-900 ml-1 font-bold"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-red-200 bg-red-50/30 rounded-xl p-3.5 space-y-2">
                  <span className="block font-bold text-[10px] text-red-700 uppercase">
                    ● THÊM BẠN ĐỜI MỚI
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={tempSpouseName}
                      onChange={(e) => setTempSpouseName(e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg py-1.5 px-2 focus:outline-none text-stone-800"
                      placeholder="Tên vợ/chồng..."
                    />
                    <select
                      value={tempSpouseType}
                      onChange={(e) => setTempSpouseType(e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg py-1.5 px-1 focus:outline-none text-stone-700"
                    >
                      <option value="Vợ">Vợ</option>
                      <option value="Chồng">Chồng</option>
                      <option value="Cụ bà Chính thất">Cụ bà Chính thất</option>
                      <option value="Cụ bà Trắc thất">Cụ bà Trắc thất</option>
                      <option value="Vợ cả">Vợ cả</option>
                      <option value="Vợ hai">Vợ hai</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpouse}
                    className="w-full bg-red-800 hover:bg-red-900 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg transition uppercase tracking-wider"
                  >
                    + Thêm bạn đời
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: Gender, branch and relation */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-stone-800 mb-1.5">Giới Tính *</label>
                <div className="flex gap-4 items-center mt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "Nam"}
                      onChange={() => setGender("Nam")}
                      className="accent-heritage-600"
                    />
                    <span>Nam</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "Nữ"}
                      onChange={() => setGender("Nữ")}
                      className="accent-heritage-600"
                    />
                    <span>Nữ</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1.5">
                  Chi / Ngành trực thuộc
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-500"
                  placeholder="ví dụ: Chi cả, Nhánh 1..."
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1.5">
                  Mối quan hệ với Tổ (Vai vế)
                </label>
                <input
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-500"
                  placeholder="ví dụ: Con trai trưởng, Cháu nội..."
                />
              </div>
            </div>
          </div>

          {/* Row 2: Careers, Phone and Educations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700">
            <div>
              <label className="block font-bold text-stone-800 mb-1.5">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none"
                placeholder="ví dụ: 0912.345.678"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1.5">Nghề nghiệp hiện tại</label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none"
                placeholder="ví dụ: Giáo viên, Bác sĩ, Doanh nhân..."
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1.5">Học vấn / Trình độ</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none"
                placeholder="ví dụ: Cử nhân, Thạc sĩ, Tiến sĩ..."
              />
            </div>
          </div>

          <div className="text-xs text-stone-700">
            <label className="block font-bold text-stone-800 mb-1.5">Nơi sinh / Quê quán</label>
            <input
              type="text"
              value={birthplace}
              onChange={(e) => setBirthplace(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-stone-800 focus:outline-none"
            />
          </div>

          {/* Biography with AI writer assistant */}
          <div className="text-xs text-stone-700">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block font-bold text-stone-800">
                Tiểu sử / Biểu sử cuộc đời
              </label>
              <button
                type="button"
                onClick={handleGenerateBioAI}
                disabled={isGeneratingAI}
                className="text-purple-700 hover:text-purple-900 font-bold text-[10px] flex items-center gap-1 bg-purple-100 hover:bg-purple-200 border border-purple-200 px-2.5 py-1 rounded transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                {isGeneratingAI ? "AI đang biên soạn..." : "✨ Nhờ AI Viết"}
              </button>
            </div>
            <textarea
              value={bioNotes}
              onChange={(e) => setBioNotes(e.target.value)}
              rows={4}
              className="w-full bg-white border border-stone-300 rounded-lg py-2.5 px-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-500"
              placeholder="Nhập ghi chú những đóng góp, cuộc đời, sự nghiệp của thành viên để lưu vào gia phong..."
            />
          </div>

          {/* Action triggers */}
          <div className="flex justify-end gap-3 pt-4 border-t border-heritage-200">
            <button
              type="button"
              onClick={(e) => handleFormSubmit(e, true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> Thêm &amp; Đồng bộ đám mây
            </button>
            <button
              type="button"
              onClick={(e) => handleFormSubmit(e, false)}
              className="bg-heritage-700 hover:bg-heritage-800 text-white font-bold text-xs py-2 px-5 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Thêm vào Gia Phả
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
