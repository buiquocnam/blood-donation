import { PHUONG_WithQuan } from './location';

// Bảng VAITRO (Vai trò)
export interface VAITRO {
  MaVaiTro: string; // MAVAITRO in DB
  TenVaiTro: string; // TENVAITRO in DB
  MoTa: string; // MOTA in DB
}

// Bảng NHOMMAU (Nhóm máu)
export interface NHOMMAU {
  MaNhomMau: string; // MANHOMMAU in DB
  MoTaNhomMau: string; // MOTANHOMMAU in DB
  DoPhoBien: number; // DOPHOBIEN in DB (DECIMAL)
  GhiChu: string; // GHICHU in DB
  NgayTao: string; // NGAYTAO in DB (DATETIME)
  NgaySua: string; // NGAYSUA in DB (DATETIME)
}

// Bảng NGUOIDUNG (Người dùng)
export interface NGUOIDUNG {
  MaNguoiDung: string; // MANGUOIDUNG in DB
  MaVaiTro: string; // MAVAITRO in DB
  HoTen: string; // HOTEN in DB
  NgaySinh: string; // NGAYSINH in DB (DATE)
  Email: string; // EMAIL in DB
  SDT: string; // SDT in DB
  MatKhau: string; // PASSWORD in DB
  GioiTinh: boolean; // GIOITINH in DB (BIT): 0: Nữ, 1: Nam
  CCCD: string; // CCCD in DB
  MaNhomMau: string; // MANHOMMAU in DB
  AnhDaiDien: string; // ANHDAIDIEN in DB
  tenDiaChi: string; // TENDUONG in DB
  IdPhuong: string; // IDPHUONG in DB
  TinhTrangTK: boolean; // TINHTRANG in DB (BIT): 0: Không hoạt động, 1: Hoạt động
  NgayTao: string; // NGAYTAO in DB (DATETIME)
  NgayKhoa?: string; // NGAYKHOA in DB (DATETIME)
}

// Bảng COSOTINHNGUYEN (Cơ sở tình nguyện)
export interface COSOTINHNGUYEN {
  IDCoSoTinhNguyen: string; // IDCOSOTINHNGUYEN in DB
  TenCoSoTinhNguyen: string; // TENCOSOTINHNGUYEN in DB
  DiaChi: string; // DIACHI in DB
  SDT: string; // SDT in DB
  Email: string; // EMAIL in DB
  IdPhuong: string; // IDPHUONG in DB
  NguoiPhuTrach: string; // NGUOIPHUTRACH in DB
  MinhChung: string; // MINHCHUNG in DB
  UserName: string; // USERNAME in DB
  MatKhau: string; // PASSWORD in DB
  TinhTrang: boolean; // TINHTRANG in DB (BIT)
  NgayTao: string; // NGAYTAO in DB (DATETIME)
  MaVaiTro: string; // MAVAITRO in DB
}

// Kiểu mở rộng cho người dùng
export interface NGUOIDUNG_WithRole extends NGUOIDUNG {
  VaiTro?: VAITRO;
  NhomMau?: NHOMMAU;
}

// Kiểu mở rộng cho cơ sở tình nguyện
export interface COSOTINHNGUYEN_WithLocation extends COSOTINHNGUYEN {
  Phuong?: PHUONG_WithQuan;
} 