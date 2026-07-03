import React from "react";
import { Member } from "../types";
import { BarChart3, Users, Heart, Award, ArrowUpRight } from "lucide-react";

interface StatsBoardProps {
  members: Member[];
}

export default function StatsBoard({ members }: StatsBoardProps) {
  const total = members.length;
  const male = members.filter((m) => m.gender === "Nam").length;
  const female = members.filter((m) => m.gender === "Nữ").length;
  const alive = members.filter((m) => m.status === "Còn sống").length;
  const deceased = members.filter((m) => m.status === "Đã mất").length;
  const phap = members.filter((m) => m.status === "Mất sớm (Phạp)").length;

  // Calculate generational numbers
  const generations = [15, 16, 17, 18, 19, 20];
  const genCounts = generations.map((g) => ({
    gen: g,
    count: members.filter((m) => m.generation === g).length,
  }));

  const maxCount = Math.max(...genCounts.map((g) => g.count), 1);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-serif font-bold text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-heritage-600" />
        Thống kê phát triển dòng họ
      </h2>

      {/* Grid count stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-stone-50 p-4 rounded-xl text-center shadow-sm border border-stone-100">
          <div className="flex justify-center mb-1 text-heritage-700">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-xl font-extrabold text-heritage-800">{total}</div>
          <div className="text-[10px] font-bold text-stone-500 uppercase mt-1">
            Tổng thành viên
          </div>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl text-center shadow-sm border border-stone-100">
          <div className="text-xl font-extrabold text-sky-600">
            {male}
          </div>
          <div className="text-[10px] font-bold text-stone-500 uppercase mt-1">
            Tổng số Nam
          </div>
          <div className="text-[9px] text-stone-400 mt-0.5">
            ({total ? Math.round((male / total) * 100) : 0}%)
          </div>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl text-center shadow-sm border border-stone-100">
          <div className="text-xl font-extrabold text-pink-600">
            {female}
          </div>
          <div className="text-[10px] font-bold text-stone-500 uppercase mt-1">
            Tổng số Nữ
          </div>
          <div className="text-[9px] text-stone-400 mt-0.5">
            ({total ? Math.round((female / total) * 100) : 0}%)
          </div>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl text-center shadow-sm border border-stone-100">
          <div className="flex justify-center mb-1 text-emerald-600">
            <Heart className="w-5 h-5 fill-emerald-100" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600">
            {alive}
          </div>
          <div className="text-[10px] font-bold text-stone-500 uppercase mt-1">
            Đang còn sống
          </div>
        </div>
      </div>

      {/* Demographics bar breakdown */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-stone-600 tracking-wider flex items-center gap-1">
          <Award className="w-4 h-4 text-heritage-600" />
          Tỷ lệ phát triển thế hệ (Đời phả hệ)
        </h3>
        
        <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
          {genCounts.map(({ gen, count }) => {
            const percentage = (count / maxCount) * 100;
            return (
              <div key={gen}>
                <div className="flex justify-between text-xs text-stone-700 mb-1 font-medium">
                  <span>Đời {gen} {gen === 15 ? "(Tổ khởi sinh)" : gen === 17 ? "(Chia nhánh lớn)" : gen === 20 ? "(Hậu duệ trẻ tuổi)" : ""}</span>
                  <span className="font-bold text-heritage-800">{count} thành viên</span>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-heritage-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-heritage-50/50 border border-heritage-100 rounded-xl text-[11px] text-stone-600 flex justify-between items-center">
          <span>Tình trạng chung: <strong className="text-stone-800">{deceased}</strong> cụ đã tạ thế tôn nghiêm, <strong className="text-stone-800">{phap}</strong> thành viên kính tế mất sớm (Phạp).</span>
          <ArrowUpRight className="w-4 h-4 text-heritage-700 shrink-0" />
        </div>
      </div>
    </div>
  );
}
