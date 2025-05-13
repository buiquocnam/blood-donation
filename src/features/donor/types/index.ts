import { DANGKIHIENMAU_WithRelations, DANGKITOCHUCHIENMAU_WithRelations } from "@/types/events";
import { PHANHOI } from "@/types/events";

// Định nghĩa interface cho dữ liệu lọc đăng ký hiến máu
export interface TuyChonLocSuKien {
  searchQuery?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  location?: string;
}

// Interface cho lịch sử hiến máu
export interface LichSuHienMau extends DANGKIHIENMAU_WithRelations {
  // Thêm các trường tính toán nếu cần
  ngayHienFormatted?: string;
  mauTrangThai?: string; // Trạng thái máu
}

// Interface cho thống kê hiến máu của người hiến
export interface ThongKeNguoiHien {
  tongLuotHien: number;
  tongLuotDaDuyet: number;
  tongLuotChoDuyet: number;
  ngayHienGanNhat?: string;
  tongLuongMauHien?: number; // ml
  soGiayChungNhan: number;
}

// Interface cho form phản hồi sau hiến máu
export interface FormPhanHoiHienMau {
  maDKiHienMau: string;
  tinhTrangMoTa: string;
  ngayPhanHoi?: string;
}

// Interface cho form đăng ký hiến máu
export interface FormDangKyHienMau {
  idSuKienHienMau: string;
  idDanhMucDVHienMau: string;
  daTungHienMau: boolean;
  
  // Thông tin sức khỏe cơ bản
  chieuCao?: number;
  canNang?: number;
  
  // Thông tin tiền sử
  tienSuBenh?: string;
  macBenhHienTai?: string;
  thongTin12ThangQua?: string;
  thongTin6ThangQua?: string;
  thongTin1ThangQua?: string;
  thongTin14NgayQua?: string;
  thuoc7Ngay?: string;
  thongTinPhuNu12ThangQua?: string;
  
  // Các thông tin bổ sung khác nếu cần
  ghiChu?: string;
}

// Interface cho trang chi tiết đăng ký hiến máu
export interface ChiTietDangKyHienMau {
  dangKyHienMau: DANGKIHIENMAU_WithRelations;
  suKienHienMau: DANGKITOCHUCHIENMAU_WithRelations;
  phanHoi?: PHANHOI;
  coTheHuy: boolean;
  coTheGuiPhanHoi: boolean;
} 