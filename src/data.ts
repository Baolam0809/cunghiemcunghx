import { Member, Tribute, Activity } from "./types";

export const initialMembers: Member[] = [
  // Đời 15
  {
    id: "M15_1",
    name: "Nghiêm Điều (Chu)",
    gender: "Nam",
    generation: 15,
    branch: "Khởi tổ",
    spouse: "Cụ cố bà Đỗ Thị Lùn",
    parentId: null,
    status: "Đã mất",
    note: "Khởi tổ nhánh (Chi thứ 5 – Hệ 4 Phái Giáp - Tiểu Tông). Con của Cụ Ôn Lương Công.",
    dob: "1885",
    birthplace: "Hòa Xá, Ứng Hòa, Hà Nội",
    job: "Nho học, Làm ruộng",
    relation: "Khởi tổ dòng họ",
    bio: "Cụ cố khởi tổ nhánh chi thứ 5 luôn giữ nề nếp gia phong hiếu học, là tấm gương sáng cho con cháu ngàn đời soi chung."
  },
  {
    id: "M15_2",
    name: "Đỗ Thị Lùn",
    gender: "Nữ",
    generation: 15,
    branch: "Khởi tổ",
    spouse: "Cụ ông Nghiêm Điều (Chu)",
    parentId: null,
    status: "Đã mất",
    note: "Cụ cố bà quê gốc Hòa Xá, trọn đời hiếu thảo vun đắp gia đình.",
    dob: "1888",
    birthplace: "Hòa Xá, Ứng Hòa, Hà Nội",
    job: "Làm ruộng, Nội trợ",
    relation: "Cụ bà khởi tổ"
  },
  
  // Đời 16
  {
    id: "M16_1",
    name: "Nghiêm Cung (Cõn)",
    gender: "Nam",
    generation: 16,
    branch: "Trưởng nhánh",
    spouse: "Cụ Phùng Thị Đích, Cụ Đỗ Thị Miến",
    parentId: "M15_1",
    status: "Đã mất",
    note: "Con trai độc nhất cụ Nghiêm Điều, rạng danh dòng tộc.",
    dob: "1912",
    birthplace: "Hòa Xá, Ứng Hòa, Hà Nội",
    job: "Học thức, Kinh doanh",
    relation: "Thế hệ kế cận nối dõi"
  },
  {
    id: "M16_2",
    name: "Phùng Thị Đích",
    gender: "Nữ",
    generation: 16,
    branch: "Khởi tổ",
    spouse: "Cụ ông Nghiêm Cung",
    parentId: null,
    status: "Đã mất",
    note: "Cụ bà cả - Sinh được 2 con gái hiếu thuận."
  },
  {
    id: "M16_3",
    name: "Đỗ Thị Miến",
    gender: "Nữ",
    generation: 16,
    branch: "Khởi tổ",
    spouse: "Cụ ông Nghiêm Cung",
    parentId: null,
    status: "Đã mất",
    note: "Cụ bà hai - Sinh được 3 trai lớn nối dõi và 4 gái hiền lương."
  },

  // Đời 17
  {
    id: "M17_THI",
    name: "Nghiêm Thị",
    gender: "Nữ",
    generation: 17,
    branch: "Mẹ cụ Đích",
    spouse: "Chưa rõ",
    parentId: "M16_1",
    motherId: "M16_2",
    status: "Đã mất",
    note: "Con gái cụ Phùng Thị Đích."
  },
  {
    id: "M17_LUONG",
    name: "Nghiêm Lương",
    gender: "Nữ",
    generation: 17,
    branch: "Mẹ cụ Đích",
    spouse: "Chưa rõ",
    parentId: "M16_1",
    motherId: "M16_2",
    status: "Đã mất",
    note: "Con gái cụ Phùng Thị Đích."
  },
  {
    id: "M17_CANH",
    name: "Nghiêm Cảnh",
    gender: "Nam",
    generation: 17,
    branch: "Nhánh 1",
    spouse: "Chưa rõ",
    parentId: "M16_1",
    motherId: "M16_3",
    status: "Đã mất",
    note: "Sinh hạ 8 người con (4 trai, 4 gái) thuộc Nhánh 1.",
    dob: "1938",
    relation: "Trưởng Nhánh 1"
  },
  {
    id: "M17_PHAC",
    name: "Nghiêm Phác",
    gender: "Nam",
    generation: 17,
    branch: "Nhánh 2",
    spouse: "Chưa rõ",
    parentId: "M16_1",
    motherId: "M16_3",
    status: "Đã mất",
    note: "Sinh hạ 4 người con (1 trai, 3 gái) thuộc Nhánh 2.",
    dob: "1942",
    relation: "Trưởng Nhánh 2"
  },
  {
    id: "M17_XUAN_MA",
    name: "Nghiêm Xuân Mã",
    gender: "Nam",
    generation: 17,
    branch: "Nhánh 3",
    spouse: "Chưa rõ",
    parentId: "M16_1",
    motherId: "M16_3",
    status: "Đã mất",
    note: "Sinh hạ 3 người con (2 trai, 1 gái) thuộc Nhánh 3.",
    dob: "1946",
    relation: "Trưởng Nhánh 3"
  },
  {
    id: "M17_TOAN",
    name: "Nghiêm Thị Toàn",
    gender: "Nữ",
    generation: 17,
    branch: "Nhánh 2/3",
    spouse: "Chưa rõ",
    parentId: "M16_1",
    motherId: "M16_3",
    status: "Đã mất",
    note: "Con gái cụ Đỗ Thị Miến."
  },
  {
    id: "M17_HOAN",
    name: "Nghiêm Thị Hoàn",
    gender: "Nữ",
    generation: 17,
    branch: "Nhánh 2/3",
    spouse: "Chưa rõ",
    parentId: "M16_1",
    motherId: "M16_3",
    status: "Đã mất",
    note: "Con gái cụ Đỗ Thị Miến."
  },
  {
    id: "M17_LOC_PHAP",
    name: "Nghiêm Lộc (Phạp)",
    gender: "Nữ",
    generation: 17,
    branch: "Khác",
    spouse: "Không có",
    parentId: "M16_1",
    motherId: "M16_3",
    status: "Mất sớm (Phạp)",
    note: "Con gái cụ hai, mệnh bạc mất sớm khi còn nhỏ tuổi."
  },
  {
    id: "M17_XUAN_PHAP",
    name: "Nghiêm Thị Xuân (Phạp)",
    gender: "Nữ",
    generation: 17,
    branch: "Khác",
    spouse: "Không có",
    parentId: "M16_1",
    motherId: "M16_3",
    status: "Mất sớm (Phạp)",
    note: "Con gái cụ hai, mệnh bạc mất sớm khi còn nhỏ tuổi."
  },

  // Đời 18 - Nhánh 1 (Con cụ Cảnh)
  {
    id: "M18_CUC",
    name: "Nghiêm Cúc",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M17_CANH",
    status: "Còn sống",
    note: "Hậu duệ dòng Nghiêm Cảnh tại Hòa Xá."
  },
  {
    id: "M18_HUNG",
    name: "Nghiêm Hùng",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M17_CANH",
    status: "Còn sống",
    note: "Sinh được 3 người con (1 trai, 2 gái)."
  },
  {
    id: "M18_XUYEN",
    name: "Nghiêm Xuyến",
    gender: "Nữ",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M17_CANH",
    status: "Còn sống"
  },
  {
    id: "M18_CUONG",
    name: "Nghiêm Cương",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M17_CANH",
    status: "Còn sống",
    note: "Sinh được 3 người con trai giỏi giang, thành đạt."
  },
  {
    id: "M18_YEN",
    name: "Nghiêm Yến",
    gender: "Nữ",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M17_CANH",
    status: "Còn sống"
  },
  {
    id: "M18_CUONG_PHAP",
    name: "Nghiêm Cường (Phạp)",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không có",
    parentId: "M17_CANH",
    status: "Mất sớm (Phạp)"
  },
  {
    id: "M18_LIEM",
    name: "Nghiêm Liêm",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M17_CANH",
    status: "Còn sống",
    note: "Sinh được 3 người con gái hiếu nghĩa."
  },
  {
    id: "M18_QUYEN",
    name: "Nghiêm Quyên",
    gender: "Nữ",
    generation: 18,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M17_CANH",
    status: "Còn sống"
  },

  // Đời 18 - Nhánh 2 (Con cụ Phác)
  {
    id: "M18_MINH",
    name: "Nghiêm Minh",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 2",
    spouse: "Không rõ",
    parentId: "M17_PHAC",
    status: "Còn sống",
    note: "Sinh được 4 người con (3 trai, 1 gái) giỏi giang."
  },
  {
    id: "M18_HAI",
    name: "Nghiêm Thị Hải",
    gender: "Nữ",
    generation: 18,
    branch: "Nhánh 2",
    spouse: "Không rõ",
    parentId: "M17_PHAC",
    status: "Còn sống"
  },
  {
    id: "M18_HANH",
    name: "Nghiêm Thị Hạnh",
    gender: "Nữ",
    generation: 18,
    branch: "Nhánh 2",
    spouse: "Không rõ",
    parentId: "M17_PHAC",
    status: "Còn sống"
  },
  {
    id: "M18_PHUONG",
    name: "Nghiêm Thị Phượng",
    gender: "Nữ",
    generation: 18,
    branch: "Nhánh 2",
    spouse: "Không rõ",
    parentId: "M17_PHAC",
    status: "Còn sống"
  },

  // Đời 18 - Nhánh 3 (Con cụ Xuân Mã)
  {
    id: "M18_QUAN",
    name: "Nghiêm Hồng Quân",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 3",
    spouse: "Nguyễn Thị Mai (Vợ)",
    parentId: "M17_XUAN_MA",
    status: "Còn sống",
    note: "Trực tiếp điều hành, bảo vệ và số hóa thành công Hệ thống Gia Phả dòng tộc. Sinh được 1 trai hiếu đễ, 1 gái thảo ngoan.",
    dob: "1978",
    birthplace: "Hòa Xá, Ứng Hòa, Hà Nội",
    job: "Kỹ sư Công nghệ, Quản trị viên dòng tộc",
    education: "Thạc sĩ Khoa học Máy tính",
    phone: "0987.654.321"
  },
  {
    id: "M18_TRANG",
    name: "Nghiêm Thị Thu Trang",
    gender: "Nữ",
    generation: 18,
    branch: "Nhánh 3",
    spouse: "Chưa rõ",
    parentId: "M17_XUAN_MA",
    status: "Còn sống"
  },
  {
    id: "M18_VIET",
    name: "Nghiêm Quốc Việt",
    gender: "Nam",
    generation: 18,
    branch: "Nhánh 3",
    spouse: "Chưa rõ",
    parentId: "M17_XUAN_MA",
    status: "Còn sống",
    note: "Sinh được 1 trai lớn nối dõi tông đường, 2 gái duyên dáng hiền đức."
  },

  // Đời 19 - Nhánh 1 (Hậu duệ Nghiêm Hùng)
  {
    id: "M19_TU",
    name: "Nghiêm Thị Tú",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 1",
    parentId: "M18_HUNG",
    status: "Còn sống"
  },
  {
    id: "M19_NGOC",
    name: "Nghiêm Thị Ngọc",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 1",
    parentId: "M18_HUNG",
    status: "Còn sống"
  },
  {
    id: "M19_HOANG",
    name: "Nghiêm Hoằng",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M18_HUNG",
    status: "Còn sống",
    note: "Sinh được 1 trai tiếp nối đời 20, 1 gái."
  },

  // Đời 19 - Nhánh 1 (Hậu duệ Nghiêm Cương)
  {
    id: "M19_HIEP",
    name: "Nghiêm Huy Hiệp",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M18_CUONG",
    status: "Còn sống",
    note: "Sinh được 1 trai nối dõi đời 20, 1 gái duyên dáng."
  },
  {
    id: "M19_DANG",
    name: "Nghiêm Ngọc Đăng",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 1",
    spouse: "Không rõ",
    parentId: "M18_CUONG",
    status: "Còn sống",
    note: "Sinh được 1 trai tiếp bước đời 20, 2 con gái nết na."
  },
  {
    id: "M19_DO",
    name: "Nghiêm Tiến Độ",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 1",
    parentId: "M18_CUONG",
    status: "Còn sống"
  },

  // Đời 19 - Nhánh 1 (Hậu duệ Nghiêm Liêm)
  {
    id: "M19_VAN",
    name: "Nghiêm Thị Vân",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 1",
    parentId: "M18_LIEM",
    status: "Còn sống"
  },
  {
    id: "M19_HANG",
    name: "Nghiêm Thị Hằng",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 1",
    parentId: "M18_LIEM",
    status: "Còn sống"
  },
  {
    id: "M19_BONG",
    name: "Nghiêm Thị (Bông)",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 1",
    parentId: "M18_LIEM",
    status: "Còn sống"
  },

  // Đời 19 - Nhánh 2 (Hậu duệ Nghiêm Minh)
  {
    id: "M19_DAO",
    name: "Nghiêm Quang Đạo",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 2",
    spouse: "Không rõ",
    parentId: "M18_MINH",
    status: "Còn sống"
  },
  {
    id: "M19_THI_PHAP",
    name: "Nghiêm Thị (Phạp)",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 2",
    parentId: "M18_MINH",
    status: "Mất sớm (Phạp)"
  },
  {
    id: "M19_THANG",
    name: "Nghiêm Việt Thắng",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 2",
    spouse: "Không rõ",
    parentId: "M18_MINH",
    status: "Còn sống"
  },
  {
    id: "M19_THIEP",
    name: "Nghiêm Văn Thiệp",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 2",
    spouse: "Không rõ",
    parentId: "M18_MINH",
    status: "Còn sống",
    note: "Sinh hạ được 1 con gái xinh xắn nết na."
  },

  // Đời 19 - Nhánh 3 (Hậu duệ Nghiêm Hồng Quân)
  {
    id: "M19_LINH",
    name: "Nghiêm Hồng Phương Linh",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 3",
    parentId: "M18_QUAN",
    status: "Còn sống",
    dob: "2010",
    birthplace: "Thành phố Hà Nội",
    job: "Học sinh",
    relation: "Con gái cả của Admin"
  },
  {
    id: "M19_LAM",
    name: "Nghiêm Cao Bảo Lâm",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 3",
    parentId: "M18_QUAN",
    status: "Còn sống",
    dob: "2015",
    birthplace: "Thành phố Hà Nội",
    job: "Học sinh",
    relation: "Con trai thứ của Admin, tương lai nối dõi tông đường"
  },

  // Đời 19 - Nhánh 3 (Hậu duệ Nghiêm Quốc Việt)
  {
    id: "M19_VY",
    name: "Nghiêm Vũ Khánh Vy",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 3",
    parentId: "M18_VIET",
    status: "Còn sống"
  },
  {
    id: "M19_NGOC_VY",
    name: "Nghiêm Vũ Khánh Ngọc",
    gender: "Nữ",
    generation: 19,
    branch: "Nhánh 3",
    parentId: "M18_VIET",
    status: "Còn sống"
  },
  {
    id: "M19_KHANG",
    name: "Nghiêm Gia Khang",
    gender: "Nam",
    generation: 19,
    branch: "Nhánh 3",
    parentId: "M18_VIET",
    status: "Còn sống"
  },

  // Đời 20 - Hậu duệ Nghiêm Hoằng
  {
    id: "M20_A_NU",
    name: "Nghiêm Thị A",
    gender: "Nữ",
    generation: 20,
    branch: "Nhánh 1",
    parentId: "M19_HOANG",
    status: "Còn sống"
  },
  {
    id: "M20_A_NAM",
    name: "Nghiêm Hoằng (A)",
    gender: "Nam",
    generation: 20,
    branch: "Nhánh 1",
    parentId: "M19_HOANG",
    status: "Còn sống"
  },

  // Đời 20 - Hậu duệ Nghiêm Huy Hiệp
  {
    id: "M20_B_NU",
    name: "Nghiêm Thị B",
    gender: "Nữ",
    generation: 20,
    branch: "Nhánh 1",
    parentId: "M19_HIEP",
    status: "Còn sống"
  },
  {
    id: "M20_B_NAM",
    name: "Nghiêm Huy (B)",
    gender: "Nam",
    generation: 20,
    branch: "Nhánh 1",
    parentId: "M19_HIEP",
    status: "Còn sống"
  },

  // Đời 20 - Hậu duệ Nghiêm Ngọc Đăng
  {
    id: "M20_C_NU",
    name: "Nghiêm Thị (C)",
    gender: "Nữ",
    generation: 20,
    branch: "Nhánh 1",
    parentId: "M19_DANG",
    status: "Còn sống"
  },
  {
    id: "M20_D_NU",
    name: "Nghiêm Thị (D)",
    gender: "Nữ",
    generation: 20,
    branch: "Nhánh 1",
    parentId: "M19_DANG",
    status: "Còn sống"
  },
  {
    id: "M20_C_NAM",
    name: "Nghiêm Ngọc (C)",
    gender: "Nam",
    generation: 20,
    branch: "Nhánh 1",
    parentId: "M19_DANG",
    status: "Còn sống"
  },

  // Đời 20 - Hậu duệ Nghiêm Văn Thiệp
  {
    id: "M20_E_NU",
    name: "Nghiêm Thị (E)",
    gender: "Nữ",
    generation: 20,
    branch: "Nhánh 2",
    parentId: "M19_THIEP",
    status: "Còn sống"
  }
];

export const initialTributes: Tribute[] = [
  {
    id: "T1",
    author: "Nghiêm Hồng Quân",
    time: "2 giờ trước",
    content: "Cầu chúc cho đại gia đình họ Nghiêm hưng thịnh muôn thu vạn đại, con cháu thành tài, luôn hướng về nguồn cội linh thiêng."
  },
  {
    id: "T2",
    author: "Nghiêm Tiến Độ",
    time: "5 giờ trước",
    content: "Kính cẩn nghiêng mình dâng nén hương thơm tưởng niệm công lao khai sinh mở đất mở chi của các bậc tiên tổ."
  },
  {
    id: "T3",
    author: "Nghiêm Thị Hằng",
    time: "1 ngày trước",
    content: "Thật tự hào khi được là một phần của dòng họ Nghiêm Hòa Xá, cảm ơn ban quản trị đã tạo dựng sổ gia phả điện tử tuyệt vời này."
  }
];

export const initialActivities: Activity[] = [
  {
    id: "act-gioto",
    title: "Ngày lễ Thường niên họ Nghiêm",
    body: "Vào ngày 12 tháng 10 Âm lịch hàng năm, con cháu dòng họ Nghiêm từ khắp mọi miền Tổ quốc đều tề tựu đông đủ về nhà thờ tổ chi thứ 5 tại Hòa Xá để dâng hương, báo cáo thành tựu và họp mặt thắt chặt tình gia tộc thân thương.",
    type: "Lễ Tổ",
    dateString: "Ngày 12 tháng 10 Âm lịch hằng năm",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "act-ton-tao",
    title: "Tôn tạo và Trùng tu Từ Đường",
    body: "Năm 2025, với sự đóng góp hảo tâm minh bạch của toàn thể con cháu các chi và sự điều hành của Ban quản lý dòng họ, đại sảnh và lư hương từ đường Hòa Xá đã được sơn thếp trùng tu tôn tạo khang trang, tôn nghiêm và ấm cúng vô ngần.",
    type: "Tôn Tạo",
    dateString: "Hoàn thành tháng 12/2025",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "act-khuyen-hoc",
    title: "Đại hội Khuyến Học dòng họ Nghiêm",
    body: "Quỹ khuyến học chi thứ 5 phát thưởng thường niên cho con em đời 19, đời 20 đạt thành tích học tập xuất sắc, đỗ đại học điểm cao, tiếp nối truyền thống khoa bảng hiếu học quý báu của cha ông họ Nghiêm.",
    type: "Khuyến Học",
    dateString: "Tổ chức vào rằm tháng 8 Âm lịch",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"
  }
];
