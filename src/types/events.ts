import { NGUOIDUNG_WithRole } from './users';
import { COSOTINHNGUYEN_WithLocation } from './users';
import { TrangThaiDangKy, TrangThaiHienMau, TrangThaiSucKhoe, TrangThaiSuKien } from './common';

// Bảng THONGBAODKTOCHUC (Thông báo đăng ký tổ chức)
export interface THONGBAODKTOCHUC {
  IdThongBaoDK: string; // IDTHONGBAODK in DB
  IDNguoiTao: string; // IDNGUOITAO in DB
  TieuDe: string; // TIEUDE in DB
  NoiDung: string; // NOIDUNG in DB
  SoLuongMauHien: number; // SOLUONGHIEN in DB
  HanDangKi: string; // HANDANGKI in DB (DATE) - Có thể trùng với HanDK
  TgBatDauDK: string; // TGBATDAUDK in DB (DATETIME)
  TgKetThucDK: string; // TGKETTHUCDK in DB (DATETIME) 
  HanDK: string; // HANDK in DB (DATE) - Có thể trùng với HanDangKi
  NgayDang: string; // NGAYDANG in DB (DATETIME)
  NgaySua: string; // NGAYSUA in DB (DATETIME)
  TgBatDauSK: string; // TGBATDAUSK in DB (DATETIME)
  TgKetThucSK: string; // TGKETTHUCSK in DB (DATETIME)
}

// Bảng DANGKITOCHUCHIENMAU (Đăng ký tổ chức hiến máu) 
export interface DANGKITOCHUCHIENMAU {
  IdSuKien: string; // IDSUKIEN in DB
  IdThongBaoDK: string; // IDTHONGBAODK in DB
  IDCoSoTinhNguyen: string; // IDCOSOTINHNGUYEN in DB
  NgayDangKi: string; // NGAYDANGKI in DB (DATETIME)
  TinhTrangDK: TrangThaiDangKy; // TINHTRANGDK in DB -- pending, approved, rejected
  SoLuongDK: number; // SOLUONGDK in DB
  SoLuongDDK: number; // SOLUONGDDK in DB
  TrangThaiSuKien: TrangThaiSuKien; // TRANGTHAISUKIEN in DB -- upcoming, ongoing, completed, cancelled
  NgayDang: string; // NGAYDANG in DB (DATETIME)
  NgaySua: string; // NGAYSUA in DB (DATETIME)
  HanDK: string; // HANDK in DB (DATE)
}

// Bảng DANHMUCDVMAU (Danh mục đơn vị hiến máu)
export interface DANHMUCDVMAU {
  IdDanhMucDVHienMau: string; // IDDANHMUCDVHIENMAU in DB
  SoLuongMau: number; // SOLUONGMAU in DB (DECIMAL)
  GhiChu: string; // GHICHU in DB
}

// Bảng DANGKIHIENMAU (Đăng ký hiến máu)
export interface DANGKIHIENMAU {
  MaDKiHienMau: string; // MADKIHIENMAU in DB
  IdNguoiHienMau: string; // IDNGUOIHIENMAU in DB
  IdNVDuyet: string; // IDNVDUYET in DB
  IdBacSi: string; // IDBACSI in DB
  IdSuKienHienMau: string; // Tham chiếu đến IDSUKIEN trong DANGKITOCHUCHIENMAU
  IdDanhMucDVHienMau: string; // IDDANHMUCDVHIENMAU in DB
  TrangThaiHienMau: TrangThaiHienMau; // Trạng thái hiến máu
  TrangThaiDonDK: TrangThaiDangKy; // Trạng thái đăng ký hiến máu    
  NgayDangKi: string; // Ngày đăng ký
  NgaySua: string; // Ngày sửa
  // Các trường thông tin sức khỏe
  ChieuCao: number; // CHIEUCAO in DB (DECIMAL)
  CanNang: number; // CANNANG in DB (DECIMAL)
  NhietDo: number; // NHIETDO in DB (DECIMAL)
  NhipTim: number; // NHIPTIM in DB (INT)
  HuyetAp: string; // HUYETAP in DB
  DaTungHienMau: boolean; // DATUNGHIENMAU in DB (BIT)
  TienSuBenh: string; // TIENSUBENH in DB
  MacBenhHienTai: string; // MACBENHHIENTAI in DB
  ThongTin12ThangQua: string; // THONGTIN12THANGQUA in DB
  ThongTin6ThangQua: string; // THONGTIN6THANGQUA in DB
  ThongTin1ThangQua: string; // THONGTIN1THANGQUA in DB
  ThongTin14NgayQua: string; // THONGTIN14NGAYQUA in DB
  Thuoc7Ngay: string; // THUOC7NGAY in DB
  ThongTinPhuNu12ThangQua: string; // THONGTINPHUNU12THANGQUA in DB
  TTSKKhamSangLoc: TrangThaiSucKhoe; // TTSKKHAMSANGLOC in DB
  TTSKSauHien: string; // TTSKSAUHIEN in DB
  GhiChu: string; // GHICHU in DB
}

// Bảng PHANHOI (Phản hồi)
export interface PHANHOI {
  MaPhanHoi: string; // MAPHANHOI in DB
  MaDKiHienMau: string; // MADKIHIENMAU in DB
  TinhTrangMoTa: string; // TINHTRANGMOTA in DB
  NgayPhanHoi: string; // NGAYPHANHOI in DB (DATETIME)
}

// Bảng GIAYCHUNGNHAN (Giấy chứng nhận hiến máu)
export interface GIAYCHUNGNHAN {
  IdGiayChungNhan: string; // IDGIAYCHUNGNHAN in DB
  MaNguoiDung: string; // MANGUOIDUNG in DB
  IdSuKienHienMau: string; // Tham chiếu đến IDSUKIEN trong DANGKITOCHUCHIENMAU
  NgayCap: string; // NGAYCAP in DB (DATE)
}

// Kiểu mở rộng cho đăng ký và sự kiện
export interface THONGBAODKTOCHUC_WithCreator extends THONGBAODKTOCHUC {
  NguoiTao?: NGUOIDUNG_WithRole;
}

export interface DANGKITOCHUCHIENMAU_WithRelations extends DANGKITOCHUCHIENMAU {
  CoSoTinhNguyen?: COSOTINHNGUYEN_WithLocation;
  ThongBao?: THONGBAODKTOCHUC_WithCreator;
}

export interface DANGKIHIENMAU_WithRelations extends DANGKIHIENMAU {
  NguoiHienMau?: NGUOIDUNG_WithRole;
  NhanVienDuyet?: NGUOIDUNG_WithRole;
  BacSi?: NGUOIDUNG_WithRole;
  SuKien?: DANGKITOCHUCHIENMAU_WithRelations;
  DanhMucDVHienMau?: DANHMUCDVMAU;
  PhanHoi?: PHANHOI[];
  GiayChungNhan?: GIAYCHUNGNHAN;
} 