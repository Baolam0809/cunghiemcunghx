import React, { useState, useEffect } from "react";
import { Member, Tribute, Activity } from "./types";
import { initialMembers, initialTributes, initialActivities } from "./data";
import InteractiveTree from "./components/InteractiveTree";
import MembersDirectory from "./components/MembersDirectory";
import MemorialRoom from "./components/MemorialRoom";
import StatsBoard from "./components/StatsBoard";
import AdminPanel from "./components/AdminPanel";

import { 
  Home, 
  Network, 
  Users, 
  Heart, 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert,
  Clock, 
  MapPin, 
  Bell, 
  Calendar, 
  Copy, 
  LogOut,
  LogIn,
  X,
  FileText,
  Bookmark,
  ChevronRight,
  Info
} from "lucide-react";

export default function App() {
  // --- CORE STATE PERSISTENCE ---
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [tributes, setTributes] = useState<Tribute[]>(initialTributes);
  const [marqueeText, setMarqueeText] = useState<string>(
    "Kính chào quý vị con cháu dòng tộc cụ Nghiêm Cung. Hệ thống gia phả số luôn tự động cập nhật và kết nối toàn bộ hệ thống các đời, hỗ trợ tra cứu trực tuyến thông tin lịch sử từ đường Hòa Xá, Hà Nội... Kính dâng tổ tiên lòng biết ơn vô hạn."
  );

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("nghiem_admin_logged");
    return saved === "true";
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; mode: string; error?: string }>({
    connected: false,
    mode: "Đang kiểm tra...",
  });

  // --- TAB NAVIGATION ---
  const [activeTab, setActiveTab] = useState<string>("home");

  // --- MODERN SLIDESHOW / CAROUSEL ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      title: "Hội ngộ con cháu ngày Giỗ Tổ",
      img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Sửa sang tôn tạo Từ Đường dòng họ",
      img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Gặp mặt chúc thọ các Cụ Cao Niên",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // --- CLOCK AND TIME ---
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      setTimeString(
        now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setDateString(
        `${days[now.getDay()]}, ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- DATABASE INITIALIZATION ON MOUNT ---
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [membersRes, tributesRes, marqueeRes, dbRes] = await Promise.all([
          fetch("/api/members"),
          fetch("/api/tributes"),
          fetch("/api/settings/marquee"),
          fetch("/api/db-status").catch(() => null)
        ]);

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
        }
        if (tributesRes.ok) {
          const tributesData = await tributesRes.json();
          setTributes(tributesData);
        }
        if (marqueeRes.ok) {
          const marqueeData = await marqueeRes.json();
          setMarqueeText(marqueeData.text);
        }
        if (dbRes && dbRes.ok) {
          const statusData = await dbRes.json();
          setDbStatus(statusData);
        } else {
          setDbStatus({ connected: false, mode: "Ngoại tuyến", error: "Không phản hồi từ máy chủ chính." });
        }
      } catch (err) {
        console.error("Failed to load initial data from Supabase backend:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("nghiem_admin_logged", isAdminLoggedIn ? "true" : "false");
  }, [isAdminLoggedIn]);

  // --- MODAL DIALOG STATES ---
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginDialog] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // --- LOGIN CONTROLLERS (admin / admin) ---
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === "admin" && passwordInput === "admin") {
      setIsAdminLoggedIn(true);
      setShowLoginDialog(false);
      setLoginError("");
      setUsernameInput("");
      setPasswordInput("");
      showToast("Đăng nhập quản trị viên thành công!", "success");
    } else {
      setLoginError("Tài khoản hoặc mật khẩu không chính xác.");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    if (activeTab === "admin") {
      setActiveTab("home");
    }
    showToast("Đã đăng xuất chế độ quản trị viên.", "info");
  };

  // --- CORE SYSTEM ACTIONS ---
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: "success" | "info" | "warning" }[]>([]);

  const showToast = (msg: string, type: "success" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Add tribute to the guestbook
  const handleAddTribute = (content: string) => {
    const newTribute: Tribute = {
      id: `T_USER_${Date.now()}`,
      author: isAdminLoggedIn ? "Ban Quản Trị" : "Con cháu dòng tộc",
      time: "Vừa xong",
      content: content.trim(),
    };

    fetch("/api/tributes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTribute)
    }).then(res => {
      if (res.ok) {
        setTributes((prev) => [newTribute, ...prev]);
        showToast("Đã lưu bút ký thành công!", "success");
      } else {
        showToast("Lưu bút ký lên cơ sở dữ liệu thất bại.", "warning");
      }
    }).catch(err => {
      console.error(err);
      showToast("Lỗi kết nối cơ sở dữ liệu khi lưu bút ký.", "warning");
    });
  };

  // Import list of members
  const handleBulkImport = async (importedMembers: Member[]) => {
    showToast(`Đang đồng bộ ${importedMembers.length} thành viên vào cơ sở dữ liệu...`, "info");
    try {
      let successCount = 0;
      for (const m of importedMembers) {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(m)
        });
        if (res.ok) successCount++;
      }
      
      const res = await fetch("/api/members");
      if (res.ok) {
        const membersData = await res.json();
        setMembers(membersData);
      }
      showToast(`Đã đồng bộ thành công ${successCount}/${importedMembers.length} thành viên vào phả hệ!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi nhập dữ liệu hàng loạt.", "warning");
    }
  };

  // Add single member
  const handleAddMember = (newMember: Member, shouldSync: boolean) => {
    // Check duplication
    const duplicate = members.some(
      (m) => m.name.toLowerCase() === newMember.name.toLowerCase() && m.generation === newMember.generation
    );

    if (duplicate) {
      if (!window.confirm(`Thành viên ${newMember.name} (Đời ${newMember.generation}) dường như đã tồn tại. Bạn có thực sự muốn thêm bản ghi mới này?`)) {
        return;
      }
    }

    fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember)
    }).then(res => {
      if (res.ok) {
        setMembers((prev) => [...prev, newMember]);
        showToast(`Đã thêm & đồng bộ thành công cụ ${newMember.name}!`, "success");
      } else {
        showToast("Lưu thành viên thất bại.", "warning");
      }
    }).catch(err => {
      console.error(err);
      showToast("Lỗi lưu thành viên lên cơ sở dữ liệu.", "warning");
    });
  };

  // Edit single member
  const [editedName, setEditedName] = useState("");
  const [editedGender, setEditedGender] = useState<"Nam" | "Nữ">("Nam");
  const [editedGen, setEditedGen] = useState(18);
  const [editedBranch, setEditedBranch] = useState("Chi thứ 5");
  const [editedStatus, setEditedStatus] = useState<"Còn sống" | "Đã mất" | "Mất sớm (Phạp)">("Còn sống");
  const [editedSpouse, setEditedSpouse] = useState("");
  const [editedNote, setEditedNote] = useState("");

  const startEditing = (id: string) => {
    const m = members.find((x) => x.id === id);
    if (!m) return;
    setEditMemberId(id);
    setEditedName(m.name);
    setEditedGender(m.gender);
    setEditedGen(m.generation);
    setEditedBranch(m.branch);
    setEditedStatus(m.status);
    setEditedSpouse(m.spouse || "");
    setEditedNote(m.note || "");
  };

  const saveEditedMember = () => {
    if (!editedName.trim()) {
      alert("Họ và Tên không được bỏ trống.");
      return;
    }
    
    const original = members.find(m => m.id === editMemberId);
    const updatedMember = {
      ...original,
      name: editedName.trim(),
      gender: editedGender,
      generation: editedGen,
      branch: editedBranch,
      status: editedStatus,
      spouse: editedSpouse,
      note: editedNote,
    };

    fetch(`/api/members/${editMemberId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMember)
    }).then(res => {
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => m.id === editMemberId ? (updatedMember as Member) : m)
        );
        showToast(`Đã cập nhật thông tin thành công!`, "success");
      } else {
        showToast("Cập nhật thông tin thất bại.", "warning");
      }
    }).catch(err => {
      console.error(err);
      showToast("Lỗi lưu chỉnh sửa thành viên.", "warning");
    }).finally(() => {
      setEditMemberId(null);
    });
  };

  // Delete single member
  const confirmDeleteMember = () => {
    if (!deleteMemberId) return;
    const m = members.find((x) => x.id === deleteMemberId);
    
    fetch(`/api/members/${deleteMemberId}`, {
      method: "DELETE"
    }).then(res => {
      if (res.ok) {
        setMembers((prev) => prev.filter((x) => x.id !== deleteMemberId));
        showToast(`Đã xóa thành viên ${m?.name} thành công.`, "success");
      } else {
        showToast("Xóa thành viên thất bại.", "warning");
      }
    }).catch(err => {
      console.error(err);
      showToast("Lỗi xóa thành viên.", "warning");
    }).finally(() => {
      setDeleteMemberId(null);
    });
  };

  // Zalo simulated copy link
  const handleCopyZalo = () => {
    navigator.clipboard.writeText("https://zalo.me/g/nghiemcunghoaxa");
    showToast("Đã sao chép liên kết nhóm Zalo dòng tộc!", "success");
  };

  const handleUpdateMarquee = (newText: string) => {
    fetch("/api/settings/marquee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText })
    }).then(res => {
      if (res.ok) {
        setMarqueeText(newText);
        showToast("Đã cập nhật dòng chữ thông báo chạy thành công!", "success");
      } else {
        showToast("Cập nhật dòng chữ thông báo chạy thất bại.", "warning");
      }
    }).catch(err => {
      console.error(err);
      showToast("Lỗi cập nhật dòng chữ thông báo chạy.", "warning");
    });
  };

  const handleTriggerSync = async () => {
    try {
      showToast("Đang đồng bộ dữ liệu với cơ sở dữ liệu Supabase...", "info");
      const [membersRes, tributesRes, marqueeRes, dbRes] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/tributes"),
        fetch("/api/settings/marquee"),
        fetch("/api/db-status").catch(() => null)
      ]);

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData);
      }
      if (tributesRes.ok) {
        const tributesData = await tributesRes.json();
        setTributes(tributesData);
      }
      if (marqueeRes.ok) {
        const marqueeData = await marqueeRes.json();
        setMarqueeText(marqueeData.text);
      }
      if (dbRes && dbRes.ok) {
        const statusData = await dbRes.json();
        setDbStatus(statusData);
      }
      showToast("Đồng bộ thành công và nhận dữ liệu mới nhất từ Supabase!", "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi đồng bộ dữ liệu với cơ sở dữ liệu.", "warning");
    }
  };

  return (
    <div className="font-sans text-stone-800 bg-stone-50 min-h-screen flex flex-col selection:bg-heritage-200">
      
      {/* --- FLOATING TOAST CONTAINERS --- */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-stone-900 text-white text-xs py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 pointer-events-auto animate-bounce"
          >
            {t.type === "success" ? (
              <span className="text-emerald-400">✓</span>
            ) : t.type === "warning" ? (
              <span className="text-amber-400">⚠</span>
            ) : (
              <span className="text-sky-400">ℹ</span>
            )}
            <span className="font-medium">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* --- HERO BANNER & HEADER --- */}
      <header className="bg-heritage-900 text-stone-100 shadow-xl border-b-4 border-heritage-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#cfa065_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and branding info */}
          <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-400 to-heritage-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-28 h-28 rounded-full border-4 border-heritage-300 bg-heritage-800 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Visual traditional temple outline representing Nhà thờ Họ */}
                <svg className="w-14 h-14 text-heritage-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 9h22L12 2zm0 3.3L18.4 9H5.6L12 5.3zM3 11v11h18V11H3zm3 3h3v5H6v-5zm9 0h3v5h-3v-5zM11 12h2v7h-2v-7z" />
                </svg>
                <div className="absolute bottom-0 inset-x-0 bg-heritage-950/80 text-[10px] text-center py-0.5 text-heritage-200 font-medium">Từ Đường</div>
              </div>
            </div>
            <div>
              <span className="text-heritage-300 uppercase tracking-widest text-xs font-bold font-serif">
                Chi thứ 5 • Hệ 4 Phái Giáp • Tiểu Tông
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-heritage-100 tracking-wide mt-1">
                GIA PHẢ GIA ĐÌNH CỤ NGHIÊM CUNG
              </h1>
              <p className="text-xs sm:text-sm text-heritage-300 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-4 h-4 text-heritage-400" /> Xã Hòa Xá, Ứng Hòa, Thành phố Hà Nội
              </p>
            </div>
          </div>

          {/* Mini interactive slideshow widget */}
          <div className="w-full md:w-80 bg-heritage-950/60 backdrop-blur-sm border border-heritage-800/80 rounded-2xl p-3 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between border-b border-heritage-800 pb-1.5 mb-2">
              <span className="text-xs font-bold uppercase text-heritage-300 tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-heritage-400" /> Hoạt động dòng tộc
              </span>
              <span className="text-[10px] text-stone-400 italic">Hòa Xá</span>
            </div>

            <div className="relative h-24 rounded-lg overflow-hidden bg-heritage-900 group">
              <div 
                className="absolute inset-0 transition-all duration-1000 flex flex-col justify-end p-2 bg-cover bg-center" 
                style={{ 
                  backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%), url('${slides[currentSlide].img}')` 
                }}
              >
                <p className="text-[11px] font-semibold text-white truncate">{slides[currentSlide].title}</p>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-1 right-1.5 flex gap-1 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === i ? "bg-white scale-125" : "bg-white/40"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* --- HORIZONTAL MENU --- */}
        <nav className="bg-heritage-950 border-t border-heritage-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center overflow-x-auto py-1 scrollbar-none w-full justify-between">
                <div className="flex space-x-2 sm:space-x-4 shrink-0">
                  <button
                    onClick={() => { setActiveTab("home"); showToast("Chào mừng quay về Trang chủ!", "info"); }}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === "home"
                        ? "bg-heritage-800 text-heritage-200 border-b-2 border-heritage-400"
                        : "text-stone-300 hover:text-white hover:bg-heritage-900"
                    }`}
                  >
                    <Home className="w-4 h-4" /> Trang chủ
                  </button>
                  <button
                    onClick={() => setActiveTab("tree")}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === "tree"
                        ? "bg-heritage-800 text-heritage-200 border-b-2 border-heritage-400"
                        : "text-stone-300 hover:text-white hover:bg-heritage-900"
                    }`}
                  >
                    <Network className="w-4 h-4" /> Cây gia phả
                  </button>
                  <button
                    onClick={() => setActiveTab("members")}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === "members"
                        ? "bg-heritage-800 text-heritage-200 border-b-2 border-heritage-400"
                        : "text-stone-300 hover:text-white hover:bg-heritage-900"
                    }`}
                  >
                    <Users className="w-4 h-4" /> Thành viên
                  </button>
                  <button
                    onClick={() => setActiveTab("memorial")}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === "memorial"
                        ? "bg-heritage-800 text-heritage-200 border-b-2 border-heritage-400"
                        : "text-stone-300 hover:text-white hover:bg-heritage-900"
                    }`}
                  >
                    <Heart className="w-4 h-4" /> Phòng tưởng nhớ
                  </button>
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === "stats"
                        ? "bg-heritage-800 text-heritage-200 border-b-2 border-heritage-400"
                        : "text-stone-300 hover:text-white hover:bg-heritage-900"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" /> Thống kê
                  </button>
                </div>

                <div className="shrink-0 pl-4 border-l border-heritage-800 flex items-center gap-2">
                  {isAdminLoggedIn ? (
                    <button
                      onClick={() => setActiveTab("admin")}
                      className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                        activeTab === "admin"
                          ? "bg-heritage-800 text-heritage-200 border-b-2 border-heritage-400"
                          : "text-emerald-400 hover:text-white hover:bg-heritage-900"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" /> Admin Mode
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowLoginDialog(true)}
                      className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold text-heritage-300 hover:text-heritage-100 hover:bg-heritage-900 border border-heritage-800 flex items-center gap-1.5 transition-all"
                    >
                      <LogIn className="w-4 h-4" /> Đăng nhập Admin
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* --- MARQUEE RUNNING TEXT BAR & REALTIME CLOCK --- */}
        <div className="bg-heritage-800 text-heritage-100 text-xs py-1.5 px-4 font-medium border-t border-heritage-700 select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span className="bg-red-800 text-white border border-red-600/50 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded shadow shrink-0 tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{timeString} | {dateString}</span>
            </span>
            <div className="marquee-container w-full">
              <div className="marquee-content text-heritage-100 italic">
                {marqueeText}
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* --- THREE COLUMN LAYOUT --- */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Admin controller quick session box */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-heritage-700"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-heritage-100 border-2 border-heritage-400 flex items-center justify-center text-heritage-700 shadow-md">
                {isAdminLoggedIn ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-heritage-700" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  {isAdminLoggedIn ? "Nghiêm Hồng Quân" : "Khách Viếng Thăm"}
                </h4>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${isAdminLoggedIn ? "bg-emerald-500 animate-ping" : "bg-stone-400"}`}></span>
                  {isAdminLoggedIn ? "Quản trị viên dòng tộc" : "Chế độ xem phả hệ"}
                </p>
              </div>
            </div>
            <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-col gap-2">
              {isAdminLoggedIn ? (
                <>
                  <button
                    onClick={() => setActiveTab("admin")}
                    className="w-full text-left text-xs bg-heritage-50 hover:bg-heritage-100 text-heritage-800 font-medium py-1.5 px-3 rounded-lg transition flex items-center justify-between"
                  >
                    <span>Cấu hình &amp; Thêm Phả hệ</span>
                    <ChevronRight className="w-3.5 h-3.5 text-heritage-600" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-xs bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-1.5 px-3 rounded-lg transition flex items-center justify-between"
                  >
                    <span>Đăng xuất Quản trị</span>
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginDialog(true)}
                  className="w-full text-center text-xs bg-heritage-800 hover:bg-heritage-900 text-white font-medium py-2 px-3 rounded-lg transition"
                >
                  Đăng nhập quyền Admin
                </button>
              )}
            </div>

            {/* Trạng thái liên kết CSDL */}
            <div id="db-connection-status-box" className="mt-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-500 font-medium">Trạng thái CSDL:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 shrink-0 ${
                  dbStatus.connected 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : dbStatus.mode.includes("Lỗi")
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.connected ? "bg-emerald-500 animate-pulse" : dbStatus.mode.includes("Lỗi") ? "bg-rose-500" : "bg-amber-500"}`}></span>
                  {dbStatus.mode}
                </span>
              </div>
              {dbStatus.error && (
                <div className="text-[10px] text-stone-500 mt-1.5 leading-relaxed bg-stone-50 p-1.5 rounded border border-stone-100">
                  <span className="font-semibold text-rose-600 block">⚠️ Chi tiết:</span>
                  {dbStatus.error}
                </div>
              )}
            </div>
          </div>

          {/* Left Vertical Nav */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase text-stone-700 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-heritage-600" /> Điều hướng dọc
              </h3>
              <span className="text-[10px] bg-heritage-100 text-heritage-800 font-bold px-2 py-0.5 rounded">
                Gia Tộc
              </span>
            </div>
            <ul className="divide-y divide-stone-100 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab("home")}
                  className={`w-full text-left px-4 py-3 hover:bg-heritage-50 hover:text-heritage-800 transition flex items-center gap-3 font-medium ${
                    activeTab === "home" ? "bg-heritage-50 text-heritage-900 font-bold" : "text-stone-700"
                  }`}
                >
                  <Home className="w-4 h-4 text-heritage-500" /> Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!isAdminLoggedIn) {
                      setShowLoginDialog(true);
                      showToast("Vui lòng đăng nhập admin để quản lý tài khoản dòng họ.", "warning");
                    } else {
                      setActiveTab("admin");
                    }
                  }}
                  className="w-full text-left px-4 py-3 text-stone-700 hover:bg-heritage-50 hover:text-heritage-800 transition flex items-center gap-3 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-heritage-500" /> Quản lý tài khoản
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("tree")}
                  className={`w-full text-left px-4 py-3 hover:bg-heritage-50 hover:text-heritage-800 transition flex items-center gap-3 font-medium ${
                    activeTab === "tree" ? "bg-heritage-50 text-heritage-900 font-bold" : "text-stone-700"
                  }`}
                >
                  <Network className="w-4 h-4 text-heritage-500" /> Danh sách phả hệ các đời
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    alert("Cài đặt hệ thống Gia phả: Tự động sao lưu và bảo mật SSL đang được kích hoạt an toàn.");
                  }}
                  className="w-full text-left px-4 py-3 text-stone-700 hover:bg-heritage-50 hover:text-heritage-800 transition flex items-center gap-3 font-medium"
                >
                  <Info className="w-4 h-4 text-heritage-500" /> Cài đặt hệ thống
                </button>
              </li>
            </ul>
          </div>

          {/* Branch summary status card */}
          <div className="bg-gradient-to-br from-heritage-900 to-heritage-950 text-heritage-100 rounded-2xl p-4 shadow-md relative overflow-hidden border border-heritage-800">
            <h4 className="font-serif font-bold text-base text-heritage-300 border-b border-heritage-800 pb-2 mb-3">
              Tóm tắt đại gia tộc
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Đời khởi thủy:</span>
                <span className="font-bold text-heritage-200">Đời thứ 15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Đời mới nhất:</span>
                <span className="font-bold text-heritage-200">Đời thứ 20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Khởi tổ chi thứ 5:</span>
                <span className="font-bold text-white text-right">Cụ Nghiêm Điều</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Nhánh lớn đời 17:</span>
                <span className="font-bold text-white">3 Nhánh chính</span>
              </div>
            </div>
          </div>

        </aside>

        {/* ==================== MIDDLE COLUMN (TAB CONTENTS) ==================== */}
        <section className="lg:col-span-6 flex flex-col gap-6">

          {/* TAB 1: HOME */}
          {activeTab === "home" && (
            <div className="space-y-6">
              
              {/* Introduction Welcome Banner */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-44 h-44 bg-heritage-100 rounded-full opacity-40 blur-2xl pointer-events-none"></div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-heritage-900 mb-3">
                  Tìm về cội nguồn - Lưu giữ muôn đời
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Chào mừng toàn thể con cháu và quan khách ghé thăm dòng chảy lịch sử Gia phả cụ Nghiêm Cung. Hệ thống là nơi lưu trữ gia phong, ghi ơn tổ tiên, kết nối tình thân giữa các đời và nhánh thuộc Tiểu Tông, Hòa Xá, Hà Nội.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab("tree")}
                    className="bg-heritage-800 hover:bg-heritage-900 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md flex items-center gap-1.5 transition"
                  >
                    <Network className="w-4 h-4" /> Xem Cây gia phả
                  </button>
                  <button
                    onClick={() => setActiveTab("memorial")}
                    className="bg-amber-100 hover:bg-amber-200 text-heritage-900 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Heart className="w-4 h-4 text-heritage-700" /> Tưởng nhớ Tổ tiên
                  </button>
                </div>
              </div>

              {/* Featured Activities */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-bold font-serif text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-500 fill-amber-100" />
                    Hoạt động dòng họ nổi bật
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {initialActivities.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => setSelectedActivity(act)}
                      className="border border-stone-100 hover:border-heritage-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition group cursor-pointer"
                    >
                      <div className="h-32 bg-stone-100 overflow-hidden relative">
                        <img
                          src={act.imageUrl}
                          alt={act.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-heritage-900/90 text-[10px] text-heritage-200 font-bold px-2 py-0.5 rounded uppercase">
                          {act.type}
                        </span>
                      </div>
                      <div className="p-3 bg-white">
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-heritage-800 transition line-clamp-1">
                          {act.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{act.body}</p>
                        <span className="text-[10px] text-stone-400 mt-2 block font-medium">
                          📅 {act.dateString}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Documentary showcase */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-bold font-serif text-stone-900 border-b border-stone-100 pb-3 mb-4">
                  🎥 Video tư liệu địa linh nhân kiệt Hòa Xá
                </h3>
                <div className="aspect-video rounded-xl bg-stone-900 relative overflow-hidden group shadow flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:scale-105 transition duration-500"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop')" }}
                  ></div>
                  <button 
                    onClick={() => alert("🎥 Đang tải luồng phát tư liệu lễ hội truyền thống Hòa Xá, Hà Nội...")}
                    className="relative z-10 w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center text-xl shadow-lg hover:scale-110 transition active:scale-95 cursor-pointer"
                  >
                    ▶
                  </button>
                  <div className="absolute bottom-3 left-3 bg-stone-950/80 px-2.5 py-1 rounded text-white text-xs z-10 font-semibold flex items-center gap-1">
                    <span>04:15 | Phóng sự hội đình Hòa Xá</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE TREE */}
          {activeTab === "tree" && (
            <InteractiveTree members={members} onViewDetails={setSelectedMemberId} />
          )}

          {/* TAB 3: MEMBERS TABLE DIRECTORY */}
          {activeTab === "members" && (
            <MembersDirectory
              members={members}
              isAdmin={isAdminLoggedIn}
              onViewDetails={setSelectedMemberId}
              onEditMember={startEditing}
              onDeleteMember={setDeleteMemberId}
              onAddNewClick={() => setActiveTab("admin")}
              onBulkImport={handleBulkImport}
              onTriggerLogin={() => {
                setShowLoginDialog(true);
                showToast("Vui lòng đăng nhập quyền quản trị để thao tác.", "warning");
              }}
            />
          )}

          {/* TAB 4: MEMORIAL INCENSE ROOM */}
          {activeTab === "memorial" && (
            <MemorialRoom tributes={tributes} onAddTribute={handleAddTribute} />
          )}

          {/* TAB 5: STATS */}
          {activeTab === "stats" && (
            <StatsBoard members={members} />
          )}

          {/* TAB 6: ADMIN CONTROL PANEL (Only accessible if logged in) */}
          {activeTab === "admin" && (
            <AdminPanel
              members={members}
              marqueeText={marqueeText}
              onUpdateMarquee={handleUpdateMarquee}
              onAddMember={handleAddMember}
              onTriggerSync={handleTriggerSync}
            />
          )}

        </section>

        {/* ==================== RIGHT SIDEBAR ==================== */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Notifications Noticeboard */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <h4 className="font-serif font-bold text-sm text-stone-950 border-b border-stone-100 pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-heritage-600 fill-heritage-100" />
                Bảng thông báo
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="bg-stone-50 hover:bg-heritage-50/50 p-3 rounded-lg border border-stone-100 transition">
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                  Khẩn
                </span>
                <p className="font-bold text-stone-800 mt-1">Thông báo lịch giỗ tổ niên độ 2026</p>
                <p className="text-stone-500 mt-0.5">Sẽ tổ chức đón tiếp dâng hương toàn tộc vào ngày 12 tháng 10 âm lịch hằng năm...</p>
              </div>

              <div className="bg-stone-50 hover:bg-heritage-50/50 p-3 rounded-lg border border-stone-100 transition">
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                  Tin vui
                </span>
                <p className="font-bold text-stone-800 mt-1">Hoàn thành Sổ Gia phả điện tử</p>
                <p className="text-stone-500 mt-0.5">Hệ thống phả hệ số chính thức bàn giao vận hành trực tuyến, bảo mật tuyệt đối.</p>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <h4 className="font-serif font-bold text-sm text-stone-950 border-b border-stone-100 pb-2 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-heritage-600" /> Sự kiện sắp tới
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex gap-2.5 items-start">
                <div className="bg-heritage-100 text-heritage-800 font-bold px-2 py-1.5 rounded text-center shrink-0 min-w-10">
                  <div className="text-[9px] uppercase">Tháng</div>
                  <div className="text-sm">11</div>
                </div>
                <div>
                  <p className="font-bold text-stone-800 leading-tight">Ngày Giỗ Cụ Nghiêm Điều</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Họp bàn chuẩn bị dâng lễ dòng họ chi 5.</p>
                  <span className="text-[10px] text-orange-600 font-semibold mt-1 inline-block">
                    ⏳ Còn khoảng 4 tháng
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Zalo Connection */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                Z
              </div>
              <div>
                <h4 className="font-bold text-sky-950 text-xs sm:text-sm">Zalo đại gia đình</h4>
                <p className="text-[10px] text-sky-700">Trao đổi trao tin tức nhanh</p>
              </div>
            </div>
            <p className="text-xs text-sky-900/80 mb-3.5 leading-relaxed">
              Kính mời con cháu cụ Nghiêm Cung tham gia nhóm để chia sẻ tin vui, hỏi han công việc trong tộc hằng ngày.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => alert("📲 Đang chuyển hướng tham gia Nhóm Zalo gia đình cụ Nghiêm Cung...")}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow transition text-center"
              >
                Tham gia nhóm
              </button>
              <button
                onClick={handleCopyZalo}
                className="bg-white hover:bg-sky-100 text-sky-850 border border-sky-200 rounded-xl px-2.5 transition"
                title="Sao chép liên kết"
              >
                <Copy className="w-4 h-4 text-sky-700" />
              </button>
            </div>
          </div>

        </aside>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-heritage-950 text-heritage-100 border-t-2 border-heritage-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-400">
          <div className="text-center md:text-left">
            <p className="font-serif font-bold text-sm text-heritage-200">GIA PHẢ GIA ĐÌNH CỤ NGHIÊM CUNG</p>
            <p className="mt-1">© 2026 Bản quyền thuộc về đại gia đình họ Nghiêm - Hòa Xá, Hà Nội.</p>
            <p className="mt-0.5">Người biên tập hệ thống: <strong className="text-heritage-300">Nghiêm Hồng Quân</strong></p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => alert("Tư liệu gia quyến dòng họ Nghiêm Hòa Xá bảo mật nghiêm ngặt.")} className="hover:text-white transition">
              Quy chế gia quyến
            </button>
            <span>•</span>
            <button onClick={() => alert("Hỗ trợ biên soạn phả hệ bởi ban trị sự.")} className="hover:text-white transition">
              Hỗ trợ kỹ thuật phả hệ
            </button>
          </div>
        </div>
      </footer>

      {/* ==================== MODALS AND DIALOGS ==================== */}
      
      {/* 1. MEMBER DETAIL MODAL */}
      {selectedMemberId && (() => {
        const m = members.find((x) => x.id === selectedMemberId);
        if (!m) return null;
        const isMale = m.gender === "Nam";
        return (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in duration-200">
              <div className="bg-gradient-to-r from-heritage-800 to-heritage-950 text-white p-4 relative">
                <button
                  onClick={() => setSelectedMemberId(null)}
                  className="absolute top-4 right-4 text-stone-300 hover:text-white text-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-[10px] font-bold uppercase tracking-wider text-heritage-300 mb-0.5">
                  Đời thứ {m.generation}
                </div>
                <h3 className="text-lg font-serif font-bold">{m.name}</h3>
              </div>
              
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-stone-400 font-semibold">Giới tính</span>
                    <span className="text-sm font-bold text-stone-800">{m.gender}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 font-semibold">Nhánh phái</span>
                    <span className="text-sm font-bold text-stone-800">{m.branch}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 font-semibold">Bạn đời (Vợ/Chồng)</span>
                    <span className="text-sm font-bold text-stone-800">{m.spouse || "Chưa rõ"}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 font-semibold">Tình trạng</span>
                    <span className={`text-sm font-bold ${isMale ? "text-sky-700" : "text-pink-700"}`}>
                      {m.status}
                    </span>
                  </div>
                </div>

                {m.dob && (
                  <div className="border-t border-stone-100 pt-3">
                    <span className="block text-stone-400 font-semibold">Năm sinh / Quê quán</span>
                    <span className="text-sm font-bold text-stone-800">
                      {m.dob} {m.birthplace ? `• tại ${m.birthplace}` : ""}
                    </span>
                  </div>
                )}

                <div className="border-t border-stone-100 pt-3">
                  <span className="block text-stone-400 font-semibold mb-1">
                    Ghi chú sự nghiệp / Thừa tự / Tiểu sử
                  </span>
                  <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-150 leading-relaxed italic">
                    {m.note || "Đang chờ cập nhật biên soạn thông tin."}
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 p-3 flex justify-end border-t border-stone-100">
                <button
                  onClick={() => setSelectedMemberId(null)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs py-1.5 px-4 rounded-lg transition"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. ADMIN EDIT MEMBER MODAL */}
      {editMemberId && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-700 to-blue-950 text-white p-4 relative">
              <button
                onClick={() => setEditMemberId(null)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-0.5">
                Chế độ quản trị viên
              </div>
              <h3 className="text-lg font-serif font-bold">Chỉnh sửa thành viên phả hệ</h3>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="col-span-2">
                  <label className="block font-semibold text-stone-600 mb-1">Họ và Tên</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Giới tính</label>
                  <select
                    value={editedGender}
                    onChange={(e) => setEditedGender(e.target.value as "Nam" | "Nữ")}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 focus:outline-none text-stone-700"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Thế hệ (Đời)</label>
                  <select
                    value={editedGen}
                    onChange={(e) => setEditedGen(parseInt(e.target.value, 10))}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 focus:outline-none text-stone-700"
                  >
                    <option value="15">Đời thứ 15</option>
                    <option value="16">Đời thứ 16</option>
                    <option value="17">Đời thứ 17</option>
                    <option value="18">Đời thứ 18</option>
                    <option value="19">Đời thứ 19</option>
                    <option value="20">Đời thứ 20</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Phân nhánh</label>
                  <input
                    type="text"
                    value={editedBranch}
                    onChange={(e) => setEditedBranch(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-3 focus:outline-none text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Tình trạng</label>
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 focus:outline-none text-stone-700"
                  >
                    <option value="Còn sống">Còn sống</option>
                    <option value="Đã mất">Đã mất</option>
                    <option value="Mất sớm (Phạp)">Mất sớm (Phạp)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-stone-600 mb-1">Vợ / Chồng</label>
                  <input
                    type="text"
                    value={editedSpouse}
                    onChange={(e) => setEditedSpouse(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-3 focus:outline-none text-stone-850"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-stone-600 mb-1">
                    Ghi chú tiểu sử, vai vế trong dòng họ
                  </label>
                  <textarea
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-3 focus:outline-none text-stone-850"
                  />
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-3 flex justify-end gap-2 border-t border-stone-100">
              <button
                onClick={() => setEditMemberId(null)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-850 font-bold text-xs py-1.5 px-4 rounded-lg transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={saveEditedMember}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-4 rounded-lg transition"
              >
                Lưu chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONFIRM DELETE MODAL */}
      {deleteMemberId && (() => {
        const m = members.find((x) => x.id === deleteMemberId);
        return (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in duration-200">
              <div className="bg-red-600 text-white p-4">
                <h3 className="text-base font-serif font-bold flex items-center gap-2">
                  ⚠️ Xác nhận xóa thành viên
                </h3>
              </div>
              <div className="p-5 text-stone-700 text-xs leading-relaxed">
                Bạn thực sự chắc chắn muốn xóa thành viên <strong className="text-stone-950 font-bold">{m?.name}</strong> khỏi cây gia phả? Hành động này sẽ loại bỏ hoàn toàn mọi tư liệu phả hệ và không thể hoàn tác lại.
              </div>
              <div className="bg-stone-50 p-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  onClick={() => setDeleteMemberId(null)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-850 font-bold text-xs py-1.5 px-4 rounded-lg transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmDeleteMember}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-1.5 px-4 rounded-lg transition"
                >
                  Đồng ý xóa
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. ACTIVITY DETAIL POPUP */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-heritage-800 text-white p-4 relative">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-serif font-bold">{selectedActivity.title}</h3>
            </div>
            
            <div className="p-5">
              {selectedActivity.imageUrl && (
                <div className="h-44 rounded-xl overflow-hidden mb-4 shadow-sm">
                  <img
                    src={selectedActivity.imageUrl}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-stone-700 leading-relaxed mb-4">{selectedActivity.body}</p>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-xs text-stone-500 font-semibold flex items-center gap-1">
                <MapPin className="w-4 h-4 text-heritage-600" />
                Địa điểm tổ chức: Hòa Xá, Ứng Hòa, Hà Nội (Từ Đường dòng họ)
              </div>
            </div>

            <div className="bg-stone-50 p-3 flex justify-end border-t border-stone-100">
              <button
                onClick={() => setSelectedActivity(null)}
                className="bg-heritage-800 hover:bg-heritage-900 text-white font-bold text-xs py-1.5 px-4 rounded-lg transition"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECURE ADMIN LOGIN DIALOG (username/password: admin/admin) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-heritage-800 to-heritage-950 text-white p-5 relative">
              <button
                onClick={() => {
                  setShowLoginDialog(false);
                  setLoginError("");
                  setUsernameInput("");
                  setPasswordInput("");
                }}
                className="absolute top-4 right-4 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-serif font-bold flex items-center gap-1.5">
                🔒 Đăng nhập Quản Trị Viên
              </h3>
              <p className="text-[11px] text-heritage-200 mt-1">
                Bảo vệ và biên soạn sử ký số dòng họ cụ Nghiêm Cung
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="p-5 space-y-4 text-xs">
              {loginError && (
                <div className="bg-red-50 text-red-700 p-2.5 rounded-lg border border-red-200 font-semibold">
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-stone-600 font-bold mb-1">Tên đăng nhập</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 focus:outline-none text-stone-800"
                  placeholder="Nhập tên đăng nhập (admin)"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold mb-1">Mật khẩu bảo mật</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 focus:outline-none text-stone-800"
                  placeholder="Nhập mật khẩu (admin)"
                />
              </div>

              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-150 text-[10px] text-stone-500 leading-normal">
                💡 <span className="font-semibold text-stone-600">Lưu ý:</span> Chỉ những thành viên ban trị sự dòng tộc được Nghiêm Hồng Quân ủy quyền mới có thông tin truy cập chỉnh sử dữ liệu.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginDialog(false);
                    setLoginError("");
                    setUsernameInput("");
                    setPasswordInput("");
                  }}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-heritage-800 hover:bg-heritage-900 text-white font-bold py-2 px-5 rounded-lg transition shadow"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
