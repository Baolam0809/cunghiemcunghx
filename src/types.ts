export interface Member {
  id: string;
  name: string;
  gender: "Nam" | "Nữ";
  generation: number;
  branch: string;
  spouse?: string;
  parentId?: string | null;
  motherId?: string | null;
  status: "Còn sống" | "Đã mất" | "Mất sớm (Phạp)";
  note?: string;
  dob?: string;
  birthplace?: string;
  job?: string;
  education?: string;
  phone?: string;
  relation?: string;
  bio?: string;
}

export interface Tribute {
  id: string;
  author: string;
  time: string;
  content: string;
}

export interface Activity {
  id: string;
  title: string;
  body: string;
  type: "Lễ Tổ" | "Tôn Tạo" | "Khuyến Học" | "Khác";
  dateString: string;
  imageUrl?: string;
}
