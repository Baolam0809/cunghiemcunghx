import React, { useState } from "react";
import { Member } from "../types";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  Trash2, 
  HelpCircle,
  FileCheck
} from "lucide-react";
import * as XLSX from "xlsx";

interface MembersDirectoryProps {
  members: Member[];
  isAdmin: boolean;
  onViewDetails: (id: string) => void;
  onEditMember: (id: string) => void;
  onDeleteMember: (id: string) => void;
  onAddNewClick: () => void;
  onBulkImport: (imported: Member[]) => void;
  onTriggerLogin: () => void;
}

export default function MembersDirectory({
  members,
  isAdmin,
  onViewDetails,
  onEditMember,
  onDeleteMember,
  onAddNewClick,
  onBulkImport,
  onTriggerLogin,
}: MembersDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  // Filtering Logic
  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.note && m.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.job && m.job.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.birthplace && m.birthplace.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchGen =
      selectedGeneration === "all" ? true : m.generation.toString() === selectedGeneration;

    const matchBranch =
      selectedBranch === "all"
        ? true
        : m.branch.toLowerCase().includes(selectedBranch.toLowerCase());

    return matchSearch && matchGen && matchBranch;
  });

  // Action Guards for Admin features
  const handleEdit = (id: string) => {
    if (!isAdmin) {
      onTriggerLogin();
    } else {
      onEditMember(id);
    }
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) {
      onTriggerLogin();
    } else {
      onDeleteMember(id);
    }
  };

  const handleAddNew = () => {
    if (!isAdmin) {
      onTriggerLogin();
    } else {
      onAddNewClick();
    }
  };

  // Export spreadsheet schema standard
  const exportToExcel = () => {
    const exportData = members.map((m) => ({
      "Họ và Tên": m.name,
      "Thế hệ (Đời)": m.generation,
      "Giới tính": m.gender,
      "Tình trạng": m.status,
      "Chi / Ngành trực thuộc": m.branch,
      "Bạn đời (Vợ / Chồng)": m.spouse || "Chưa rõ",
      "Năm sinh": m.dob || "",
      "Nơi sinh / Quê quán": m.birthplace || "",
      "Nghề nghiệp": m.job || "",
      "Học vấn / Trình độ": m.education || "",
      "Số điện thoại": m.phone || "",
      "Vai vế / Mối quan hệ với Tổ": m.relation || "",
      "Tiểu sử": m.note || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gia_Pha_Gia_Dinh");
    XLSX.writeFile(workbook, "Danh_Sach_Gia_Pha_Ho_Nghiem.xlsx");
  };

  // Handle Excel upload parsing
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      onTriggerLogin();
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (rawJson.length === 0) {
          alert("Tệp tải lên không chứa dữ liệu thành viên hợp lệ.");
          return;
        }

        const parsedMembers: Member[] = rawJson.map((row, index) => {
          const gen = parseInt(row["Thế hệ (Đời)"] || row["Đời"] || "18", 10);
          const name = row["Họ và Tên"] || row["Tên"] || "[Không rõ]";
          const gender = row["Giới tính"] || "Nam";
          const status = row["Tình trạng"] || "Còn sống";
          const branch = row["Chi / Ngành trực thuộc"] || row["Phân nhánh"] || "Chi thứ 5";

          // Formulate biography note
          const dob = row["Năm sinh"] || "";
          const birthplace = row["Nơi sinh / Quê quán"] || "";
          const job = row["Nghề nghiệp"] || "";
          const edu = row["Học vấn / Trình độ"] || "";
          const phone = row["Số điện thoại"] || "";
          const relation = row["Vai vế / Mối quan hệ với Tổ"] || "";
          const bio = row["Tiểu sử"] || "";

          let noteText = `Hậu duệ Đời ${gen}.`;
          if (relation) noteText += ` Quan hệ: ${relation}.`;
          if (dob) noteText += ` Năm sinh: ${dob}.`;
          if (birthplace) noteText += ` Quê quán: ${birthplace}.`;
          if (job) noteText += ` Nghề nghiệp: ${job}.`;
          if (edu) noteText += ` Học vấn: ${edu}.`;
          if (phone) noteText += ` Liên hệ: ${phone}.`;
          if (bio) noteText += ` Ghi chú: ${bio}.`;

          return {
            id: `IMPORT_${Date.now()}_${index}`,
            name,
            gender: gender === "Nữ" ? "Nữ" : "Nam",
            generation: gen,
            branch,
            spouse: row["Bạn đời (Vợ / Chồng)"] || row["Vợ/Chồng"] || "",
            status: status.includes("mất") || status.includes("Đã khuất") ? "Đã mất" : status.includes("Phạp") ? "Mất sớm (Phạp)" : "Còn sống",
            dob,
            birthplace,
            job,
            education: edu,
            phone,
            relation,
            note: noteText,
          };
        });

        onBulkImport(parsedMembers);
      } catch (err) {
        console.error(err);
        alert("Lỗi phân tích file Excel. Vui lòng kiểm tra lại cấu trúc cột chuẩn.");
      }
    };
    reader.readAsBinaryString(file);
    // Reset file input value
    e.target.value = "";
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
        Danh sách thành viên dòng tộc
      </h2>

      {/* Control panel & filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl mb-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Tìm kiếm nhanh
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-heritage-500 focus:outline-none text-stone-800"
              placeholder="Nhập tên, quê quán, nghề nghiệp..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Chọn thế hệ (Đời)
          </label>
          <select
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-heritage-500 focus:outline-none text-stone-700"
          >
            <option value="all">Tất cả thế hệ</option>
            <option value="15">Đời thứ 15</option>
            <option value="16">Đời thứ 16</option>
            <option value="17">Đời thứ 17</option>
            <option value="18">Đời thứ 18</option>
            <option value="19">Đời thứ 19</option>
            <option value="20">Đời thứ 20</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Chọn nhánh phả hệ
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-heritage-500 focus:outline-none text-stone-700"
          >
            <option value="all">Tất cả các nhánh</option>
            <option value="Khởi tổ">Khởi tổ</option>
            <option value="Nhánh 1">Nhánh 1 (Cụ Cảnh)</option>
            <option value="Nhánh 2">Nhánh 2 (Cụ Phác)</option>
            <option value="Nhánh 3">Nhánh 3 (Cụ Mã)</option>
          </select>
        </div>
      </div>

      {/* Directory meta headers and actions */}
      <div className="text-xs text-stone-500 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
        <span>
          Đang hiển thị <strong className="text-heritage-900">{filteredMembers.length}</strong> trên{" "}
          <strong className="text-stone-700">{members.length}</strong> thành viên
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAddNew}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-1.5 px-3 rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" /> Thêm mới
          </button>
          
          <button
            onClick={exportToExcel}
            className="bg-amber-50 hover:bg-amber-100 text-heritage-800 border border-heritage-300 py-1.5 px-3 rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-heritage-700" /> Xuất Excel
          </button>

          <label className="bg-heritage-800 hover:bg-heritage-900 text-white py-1.5 px-3 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition">
            <Upload className="w-4 h-4 text-heritage-200" /> Nhập Excel
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={handleExcelImport}
            />
          </label>
        </div>
      </div>

      {/* Table listing */}
      <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-inner max-h-[450px]">
        <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
          <thead className="bg-stone-50 text-stone-700 font-bold uppercase sticky top-0 z-10 border-b border-stone-200">
            <tr>
              <th scope="col" class="px-4 py-3">Thế hệ</th>
              <th scope="col" class="px-4 py-3">Họ và Tên</th>
              <th scope="col" class="px-4 py-3">Giới tính</th>
              <th scope="col" class="px-4 py-3">Chi Nhánh</th>
              <th scope="col" class="px-4 py-3">Tình trạng</th>
              <th scope="col" class="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-stone-400 italic">
                  Không tìm thấy thành viên phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const isMale = m.gender === "Nam";
                return (
                  <tr key={m.id} className="hover:bg-stone-50 transition duration-150">
                    <td className="px-4 py-3 font-bold text-stone-600 whitespace-nowrap">Đời {m.generation}</td>
                    <td className="px-4 py-3 font-semibold text-stone-900 whitespace-nowrap">{m.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isMale ? "bg-sky-50 text-sky-800 border border-sky-100" : "bg-pink-50 text-pink-800 border border-pink-100"
                      }`}>
                        {m.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize whitespace-nowrap">{m.branch}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {m.status === "Còn sống" ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                          Còn sống
                        </span>
                      ) : m.status === "Đã mất" ? (
                        <span className="text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Đã khuất
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Kính tế (Phạp)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-3 items-center">
                        <button
                          onClick={() => onViewDetails(m.id)}
                          className="text-heritage-700 hover:text-heritage-900 font-bold text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem
                        </button>
                        <button
                          onClick={() => handleEdit(m.id)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
