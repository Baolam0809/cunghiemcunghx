import React, { useState } from "react";
import { Tribute } from "../types";
import { Sparkles, Flame, BellRing, MessageSquare, Send, HeartHandshake } from "lucide-react";

interface MemorialRoomProps {
  tributes: Tribute[];
  onAddTribute: (content: string) => void;
}

export default function MemorialRoom({ tributes, onAddTribute }: MemorialRoomProps) {
  const [isBurning, setIsBurning] = useState(false);
  const [tributeText, setTributeText] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Thắp nhang ảo
  const handleLightIncense = () => {
    if (isBurning) {
      alert("Nhang đang cháy lung linh, xin hãy thành kính cầu khấn dòng họ...");
      return;
    }
    setIsBurning(true);
    // Auto extinguish after 30 seconds
    setTimeout(() => {
      setIsBurning(false);
    }, 30000);
  };

  // Khánh chuông từ đường
  const handleRingBell = () => {
    // We can play an audio or just a gorgeous notification
    alert("🔔 Boong... Boong... Khánh chuông từ đường Hòa Xá vang vọng ấm cúng, cầu khấn linh hồn tiền tổ độ trì gia quyến.");
  };

  // Submit Guestbook message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tributeText.trim()) return;
    onAddTribute(tributeText);
    setTributeText("");
  };

  // AI draft assistant calls our server-side API `/api/gemini/tribute`
  const handleGenerateTributeAI = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/gemini/tribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Hãy soạn thảo một lời tri ân tổ tiên, bày tỏ lòng biết ơn vô hạn của thế hệ con cháu và ước mong dòng họ hưng thịnh." }),
      });
      
      const data = await response.json();
      if (data.tribute) {
        setTributeText(data.tribute);
      } else {
        // Fallback draft in Vietnamese
        setTributeText("Thành kính dâng nén hương thơm kính viếng linh hồn Tiên tổ họ Nghiêm, nguyện cầu Tổ tiên linh thiêng gia hộ cho con cháu vạn đời bình an, tài lộc thịnh vượng.");
      }
    } catch (err) {
      // Graceful fallback draft
      setTributeText("Thành kính dâng nén hương thơm kính viếng linh hồn Tiên tổ họ Nghiêm, nguyện cầu Tổ tiên linh thiêng gia hộ cho con cháu vạn đời bình an, tài lộc thịnh vượng.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="bg-heritage-950 text-heritage-100 border-2 border-heritage-600 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#cfa065_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Title */}
      <div className="text-center max-w-lg mx-auto mb-6">
        <div className="flex justify-center mb-1 text-amber-500 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-amber-100 uppercase tracking-widest">
          Phòng Tưởng Nhớ Gia Phong
        </h2>
        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-2"></div>
        <p className="text-xs text-stone-300 italic">
          &quot;Cây có gốc mới nở cành xanh lá, nước có nguồn mới bể cả sông sâu&quot;. Con cháu kính cẩn dâng nén nhang thắp sáng tâm linh, ghi nhớ công lao trời bể của tiền nhân.
        </p>
      </div>

      {/* Lư hương & Incense stage */}
      <div className="bg-heritage-900/60 border border-heritage-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative max-w-md mx-auto shadow-inner">
        
        {/* Smoke overlay simulation */}
        {isBurning && (
          <div className="w-full h-24 relative overflow-hidden flex items-end justify-center pointer-events-none mb-2">
            <svg className="w-32 h-24 text-stone-200/40 opacity-70" viewBox="0 0 100 100" fill="currentColor">
              <circle className="smoke-particle" cx="50" cy="80" r="12" style={{ animationDelay: "0s" }} />
              <circle className="smoke-particle" cx="45" cy="80" r="14" style={{ animationDelay: "1.2s" }} />
              <circle className="smoke-particle" cx="55" cy="80" r="11" style={{ animationDelay: "2.5s" }} />
            </svg>
          </div>
        )}

        {/* Traditional incense burner illustration */}
        <div className="relative z-10 my-4">
          {isBurning && (
            <div className="absolute inset-x-0 bottom-6 w-16 h-16 bg-amber-400/30 rounded-full blur-xl mx-auto animate-pulse"></div>
          )}
          <div className="relative">
            {/* The burning incense sticks */}
            {isBurning && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 w-10">
                <div className="w-0.5 h-16 bg-gradient-to-b from-red-600 to-amber-700 animate-pulse"></div>
                <div className="w-0.5 h-20 bg-gradient-to-b from-red-600 to-amber-700 animate-pulse"></div>
                <div className="w-0.5 h-16 bg-gradient-to-b from-red-600 to-amber-700 animate-pulse"></div>
              </div>
            )}
            {/* Censer / Lư hương structure */}
            <svg className={`w-28 h-28 mx-auto transition ${isBurning ? "text-amber-500" : "text-stone-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 01-14 0c0-2.5 3.5-5 7-5s7 2.5 7 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7V3M8 12h8m-5 3h2M6 19l-1 2m13-2l1 2" />
            </svg>
          </div>
        </div>

        {/* Text and Actions */}
        <div className="mt-2 z-10 w-full">
          <p className="text-xs text-amber-200/90 mb-4 h-6 font-medium">
            {isBurning ? (
              <span className="flex items-center justify-center gap-1 text-amber-400 animate-pulse">
                <Flame className="w-4 h-4 fill-amber-500" />
                Hương khói nghi ngút... Con cháu đang kính cẩn cầu nguyện.
              </span>
            ) : (
              "Lư hương tĩnh lặng, kính mời con cháu thắp nén nhang thành kính bái lạy."
            )}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleLightIncense}
              className="bg-amber-500 hover:bg-amber-600 text-heritage-950 font-bold text-xs py-2 px-5 rounded-xl shadow-lg transition transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-4 h-4" /> Thắp nhang ảo
            </button>
            <button
              onClick={handleRingBell}
              className="bg-heritage-800 hover:bg-heritage-700 text-amber-200 font-bold text-xs py-2 px-4 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer border border-heritage-700"
            >
              <BellRing className="w-4 h-4" /> Khánh chuông
            </button>
          </div>
        </div>
      </div>

      {/* Memorial log / Digital guestbook */}
      <div className="mt-8 border-t border-heritage-800 pt-5">
        <h3 className="text-sm font-bold text-amber-200 mb-3.5 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Sổ lưu bút tri ân tiên tổ
        </h3>
        
        {/* Messages list */}
        <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1 tree-scroll">
          {tributes.map((t) => (
            <div
              key={t.id}
              className="bg-heritage-900/50 p-3.5 rounded-xl border border-heritage-800/80 hover:border-heritage-700 transition"
            >
              <div className="flex justify-between items-center text-[10px] text-amber-400 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                  {t.author}
                </span>
                <span>{t.time}</span>
              </div>
              <p className="text-xs text-stone-200 italic leading-relaxed">&quot;{t.content}&quot;</p>
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <input
            type="text"
            value={tributeText}
            onChange={(e) => setTributeText(e.target.value)}
            placeholder="Kính cẩn viết lời tri ân tiên tổ dòng họ..."
            className="bg-heritage-900 text-white border border-heritage-700 rounded-xl px-4 py-2.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-400"
          />
          <button
            type="button"
            onClick={handleGenerateTributeAI}
            disabled={isGeneratingAI}
            className="bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 font-bold text-xs px-3 rounded-xl shrink-0 transition flex items-center gap-1.5"
            title="Dùng Gemini AI soạn thảo nén tâm nhang tri ân"
          >
            {isGeneratingAI ? "Đang soạn..." : "✨ AI Soạn"}
          </button>
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 rounded-xl shrink-0 transition flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" /> Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
