import React, { useState } from "react";
import { Member } from "../types";
import { Network, ArrowRight, UserCheck, Eye, Heart, Info } from "lucide-react";

interface InteractiveTreeProps {
  members: Member[];
  onViewDetails: (id: string) => void;
}

export default function InteractiveTree({ members, onViewDetails }: InteractiveTreeProps) {
  // Let the user select branches or view active lines
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  // Get key members for visual presentation
  const doi15 = members.filter((m) => m.generation === 15);
  const doi16 = members.filter((m) => m.generation === 16);
  const doi17 = members.filter((m) => m.generation === 17);

  const getFilteredDoi17 = () => {
    if (selectedBranch === "all") return doi17;
    return doi17.filter((m) => m.branch.toLowerCase().includes(selectedBranch.toLowerCase()));
  };

  const currentDoi17 = getFilteredDoi17();

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-3 mb-4 gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            <Network className="text-heritage-600 w-5 h-5" />
            Sơ đồ cây gia phả tương tác
          </h2>
          <p className="text-xs text-stone-500">Chi thứ 5 • Hệ 4 Phái Giáp • Tiểu Tông (Cụ Nghiêm Cung)</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setSelectedBranch("all")}
            className={`px-3 py-1 rounded-full border transition font-medium ${
              selectedBranch === "all"
                ? "bg-heritage-800 text-white border-heritage-800"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200"
            }`}
          >
            Tất cả nhánh
          </button>
          <button
            onClick={() => setSelectedBranch("Nhánh 1")}
            className={`px-3 py-1 rounded-full border transition font-medium ${
              selectedBranch === "Nhánh 1"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200"
            }`}
          >
            Nhánh 1 (Cụ Cảnh)
          </button>
          <button
            onClick={() => setSelectedBranch("Nhánh 2")}
            className={`px-3 py-1 rounded-full border transition font-medium ${
              selectedBranch === "Nhánh 2"
                ? "bg-cyan-700 text-white border-cyan-700"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200"
            }`}
          >
            Nhánh 2 (Cụ Phác)
          </button>
          <button
            onClick={() => setSelectedBranch("Nhánh 3")}
            className={`px-3 py-1 rounded-full border transition font-medium ${
              selectedBranch === "Nhánh 3"
                ? "bg-amber-700 text-white border-amber-700"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200"
            }`}
          >
            Nhánh 3 (Cụ Mã)
          </button>
        </div>
      </div>

      {/* Main interactive visualization tree viewport */}
      <div className="tree-scroll overflow-x-auto overflow-y-hidden border border-stone-100 rounded-xl p-4 bg-amber-50/10 shadow-inner min-h-[500px]">
        <div className="w-[1000px] flex flex-col items-center justify-start gap-8 py-4 mx-auto">
          
          {/* ĐỜI 15: KHỞI TỔ */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] bg-heritage-900 text-heritage-100 font-bold px-2.5 py-0.5 rounded-full mb-2 tracking-wider">
              ĐỜI THỨ 15 (KHỞI TỔ NHÁNH)
            </span>
            <div className="flex gap-6 items-center">
              {doi15.map((m) => {
                const isMale = m.gender === "Nam";
                return (
                  <div
                    key={m.id}
                    onClick={() => onViewDetails(m.id)}
                    className={`cursor-pointer border-2 rounded-xl p-3.5 text-center w-52 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white ${
                      isMale 
                        ? "border-heritage-600 hover:border-heritage-800" 
                        : "border-pink-300 hover:border-pink-500"
                    }`}
                  >
                    <div className={`font-serif font-bold text-sm ${isMale ? "text-heritage-950" : "text-pink-950"}`}>
                      {m.name}
                    </div>
                    <div className="text-[10px] text-stone-500 font-medium mt-1">
                      {m.relation || (isMale ? "Cụ cố khởi tổ" : "Cụ cố bà")}
                    </div>
                    <div className="mt-2 text-[9px] bg-stone-100 text-stone-600 rounded py-0.5 px-2 inline-block">
                      {m.dob ? `Năm sinh: ${m.dob}` : "Đã khuất"}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-0.5 h-10 bg-gradient-to-b from-heritage-600 to-heritage-400 mt-2"></div>
          </div>

          {/* ĐỜI 16: HỆ KẾ CẬN */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] bg-heritage-800 text-heritage-100 font-bold px-2.5 py-0.5 rounded-full mb-2 tracking-wider">
              ĐỜI THỨ 16 (HỆ KẾ CẬN)
            </span>
            <div className="flex gap-4 items-center border border-dashed border-heritage-300 p-3 rounded-2xl bg-white shadow-sm">
              {doi16.map((m) => {
                const isMale = m.gender === "Nam";
                return (
                  <div
                    key={m.id}
                    onClick={() => onViewDetails(m.id)}
                    className={`cursor-pointer border rounded-xl p-2.5 text-center w-40 shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${
                      isMale 
                        ? "border-heritage-500 bg-heritage-50/50 hover:border-heritage-700 hover:bg-heritage-50" 
                        : "border-pink-200 bg-pink-50/30 hover:border-pink-400 hover:bg-pink-50"
                    }`}
                  >
                    <div className={`font-serif font-semibold text-xs ${isMale ? "text-heritage-900" : "text-pink-900"}`}>
                      {m.name}
                    </div>
                    <div className="text-[9px] text-stone-500 mt-0.5">
                      {m.parentId ? "Con cụ Điều" : "Cụ Bà"}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-0.5 h-10 bg-gradient-to-b from-heritage-400 to-heritage-300 mt-2"></div>
          </div>

          {/* ĐỜI 17: CHIA NHÁNH CHÍNH */}
          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] bg-heritage-800 text-heritage-100 font-bold px-2.5 py-0.5 rounded-full mb-3 tracking-wider">
              ĐỜI THỨ 17 (CHIA NHÁNH TRƯỞNG TÔNG)
            </span>
            <div className="flex justify-around w-full relative">
              <div className="absolute top-0 left-[15%] right-[15%] h-0.5 bg-heritage-300 -translate-y-4"></div>
              
              {currentDoi17.map((m) => {
                const isMale = m.gender === "Nam";
                let branchColor = "border-stone-300 hover:border-stone-500 bg-stone-50/50";
                let branchLabel = "Chi nhánh";
                
                if (m.branch.includes("1")) {
                  branchColor = "border-emerald-500 hover:border-emerald-700 bg-emerald-50/50 hover:bg-emerald-50";
                  branchLabel = "Trưởng Nhánh 1 (8 Con)";
                } else if (m.branch.includes("2")) {
                  branchColor = "border-cyan-500 hover:border-cyan-700 bg-cyan-50/50 hover:bg-cyan-50";
                  branchLabel = "Trưởng Nhánh 2 (4 Con)";
                } else if (m.branch.includes("3")) {
                  branchColor = "border-amber-500 hover:border-amber-700 bg-amber-50/50 hover:bg-amber-50";
                  branchLabel = "Trưởng Nhánh 3 (3 Con)";
                } else if (isMale) {
                  branchColor = "border-heritage-400 hover:border-heritage-600 bg-heritage-50/50";
                } else {
                  branchColor = "border-pink-200 hover:border-pink-400 bg-pink-50/10";
                }

                return (
                  <div key={m.id} className="flex flex-col items-center relative">
                    <div className="absolute w-0.5 h-4 bg-heritage-300 -translate-y-4"></div>
                    <div
                      onClick={() => onViewDetails(m.id)}
                      className={`cursor-pointer border-2 rounded-xl p-3 text-center w-40 shadow-sm transition-all duration-300 transform hover:-translate-y-1 ${branchColor}`}
                    >
                      <div className={`font-serif font-bold text-xs ${isMale ? "text-stone-900" : "text-pink-900"}`}>
                        {m.name}
                      </div>
                      <div className="text-[9px] text-stone-500 mt-1">{branchLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC HINT FOOTER */}
          <div className="w-full mt-6 bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-center text-xs text-stone-600 flex flex-col items-center gap-1.5">
            <span className="font-semibold text-heritage-900 flex items-center gap-1">
              <Info className="w-4 h-4 text-heritage-600" />
              Tra cứu đầy đủ đời tiếp nối (18, 19, 20) hằng ngày
            </span>
            <p className="max-w-xl text-[11px] text-stone-500">
              Với hơn 30+ con cháu thế hệ trẻ phát triển đông đúc, vui lòng nhấn sang tab 
              <strong className="text-heritage-800 font-bold ml-1">Thành viên</strong> để dễ dàng lọc tìm kiếm chi tiết theo từng Đời, tìm bạn đời, dâu rể hoặc mối liên hệ cha con trực quan.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
