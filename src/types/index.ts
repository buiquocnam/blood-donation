/**
 * Các kiểu dữ liệu toàn cục cho Hệ thống Hiến máu
 * Dựa trên cấu trúc cơ sở dữ liệu đã cập nhật
 */

// Kiểu vai trò người dùng
export type VaiTroNguoiDung = 
  | "donor" // người hiến máu
  | "medical_staff" // nhân viên y tế
  | "doctor" // bác sĩ
  | "volunteer_center_manager" // trưởng cơ sở tình nguyện
  | "blood_bank_director" // giám đốc ngân hàng máu
  | "admin"; // quản trị viên

// Bảng THANHPHO (Thành phố)
export interface THANHPHO {
  IdThanhPho: string; // IDTHANHPHO in DB
  TenThanhPho: string; // TENTHANHPHO in DB
}

// Bảng QUAN (Quận)
export interface QUAN {
  IdQuan: string; // IDQUAN in DB
  IdThanhPho: string; // IDTHANHPHO in DB
  TenQuan: string; // TENQUAN in DB
}

// Bảng PHUONG (Phường)
export interface PHUONG {
  IdPhuong: string; // IDPHUONG in DB
  IdQuan: string; // IDQUAN in DB
  TenPhuong: string; // TENPHUONG in DB
}

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
}

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
  TinhTrangDK: string; // TINHTRANGDK in DB -- pending, approved, rejected
  SoLuongDK: number; // SOLUONGDK in DB
  SoLuongDDK: number; // SOLUONGDDK in DB
  TrangThaiSuKien: string; // TRANGTHAISUKIEN in DB -- upcoming, ongoing, completed, cancelled
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
  TrangThaiHienMau: string; // TRANGTHAIHIENMAU in DB
  TrangThaiDonDK: string; // TRANGTHAIDONDK in DB
  NgayDangKi: string; // NGAYDANGKI in DB (DATETIME)
  NgaySua: string; // NGAYSUA in DB (DATETIME)
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
  TTSKKhamSangLoc: string; // TTSKKHAMSANGLOC in DB
  TTSKSauHien: string; // TTSKSAUHIEN in DB
  GhiChu: string; // GHICHU in DB
}

// Bảng PHANHOI (Phản hồi)
export interface PHANHOI {
  MaPhanHoi: string; // MAPHANHOI in DB
  MaDKiKienMau: string; // MADKIKIENMAU in DB
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

/**
 * Các kiểu dữ liệu dành riêng cho giao diện người dùng (Mở rộng từ kiểu dữ liệu cơ sở dữ liệu)
 */

// Kiểu mở rộng liên quan đến vị trí
export interface QUAN_WithCity extends QUAN {
  ThanhPho?: THANHPHO;
}

export interface PHUONG_WithQuan extends PHUONG {
  Quan?: QUAN_WithCity;
}

export interface AddressDetail {
  thanhPho: THANHPHO;
  quan: QUAN;
  phuong: PHUONG;
  diaChi: string;
}

// Kiểu mở rộng cho người dùng
export interface NGUOIDUNG_WithRole extends NGUOIDUNG {
  VaiTro?: VAITRO;
  NhomMau?: NHOMMAU;
  DiaChi?: AddressDetail;
}

// Kiểu mở rộng cho cơ sở tình nguyện
export interface COSOTINHNGUYEN_WithLocation extends COSOTINHNGUYEN {
  Phuong?: PHUONG_WithQuan;
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

// Kiểu dữ liệu biểu mẫu
export interface FormDuLieuThongBao {
  TieuDe: string;
  NoiDung: string;
  SoLuongMauHien: number;
  HanDangKi: string;
  TgBatDauDK: string;
  TgKetThucDK: string;
  TgBatDauSK?: string;
  TgKetThucSK?: string;
  HanDK?: string;
}

export interface FormDuLieuSuKien {
  SoLuongDK: number;
  SoLuongDDK: number;
  TrangThaiSuKien: string;
  HanDK: string;
}

export interface FormDuLieuDangKyHienMau {
  IdSuKienHienMau: string;
  IdDanhMucDVHienMau?: string;
}

export interface FormDuLieuSucKhoe {
  ChieuCao: number;
  CanNang: number;
  NhietDo: number;
  NhipTim: number;
  HuyetAp: string;
  DaTungHienMau: boolean;
  TienSuBenh: string;
  MacBenhHienTai: string;
  ThongTin12ThangQua: string;
  ThongTin6ThangQua: string;
  ThongTin1ThangQua: string;
  ThongTin14NgayQua: string;
  Thuoc7Ngay: string;
  ThongTinPhuNu12ThangQua?: string;
}

export interface FormDuLieuPhanHoi {
  TinhTrangMoTa: string;
}

// Các enum và hằng số trạng thái giao diện người dùng
export enum TrangThaiSuKien {
  SAP_DIEN_RA = 'upcoming',
  DANG_DIEN_RA = 'ongoing',
  DA_HOAN_THANH = 'completed',
  DA_HUY = 'cancelled'
}

export enum TrangThaiDangKy {
  CHO_DUYET = 'pending',
  DA_DUYET = 'approved',
  TU_CHOI = 'rejected'
}

export enum TrangThaiHienMau {
  DA_DANG_KY = 'registered',
  DA_SANG_LOC = 'screened',
  DA_DUYET = 'approved',
  DA_HOAN_THANH = 'completed',
  TU_CHOI = 'rejected'
}

// Ánh xạ giữa trạng thái số trong cơ sở dữ liệu và enum trạng thái giao diện người dùng
export const MAP_TRANG_THAI_DANG_KY = {
  'pending': TrangThaiDangKy.CHO_DUYET,
  'approved': TrangThaiDangKy.DA_DUYET,
  'rejected': TrangThaiDangKy.TU_CHOI
};

export const MAP_TRANG_THAI_HIEN_MAU = {
  'registered': TrangThaiHienMau.DA_DANG_KY,
  'screened': TrangThaiHienMau.DA_SANG_LOC,
  'approved': TrangThaiHienMau.DA_DUYET,
  'completed': TrangThaiHienMau.DA_HOAN_THANH,
  'rejected': TrangThaiHienMau.TU_CHOI
};

// Kiểu xác thực
export interface ThongTinDangNhap {
  Email: string;
  MatKhau: string;
}

export interface ThongTinDangKy {
  HoTen: string;
  Email: string;
  MatKhau: string;
  SDT: string;
  NgaySinh: string;
  GioiTinh: string;
  CCCD: string;
  MaNhomMau?: string;
  DiaChi: {
    tenDiaChi: string;
    IdPhuong: string;
  };
}

// Kiểu thống kê
export interface ThongKeNhomMau {
  MaNhomMau: string;
  MoTaNhomMau: string;
  SoLuong: number;
  PhanTram: number;
}

export interface ThongKeHienMau {
  tongSoDangKy: number;
  soLuongThanhCong: number;
  thongKeTheoThang: Array<{
    thang: string;
    soLuong: number;
  }>;
}

export interface BaoCaoNganHangMau {
  thongKeNhomMau: ThongKeNhomMau[];
  thongKeHienMau: ThongKeHienMau;
  thongKeSuKien: {
    tongSoSuKien: number;
    suKienSapDienRa: number;
    suKienDaHoanThanh: number;
  };
}



// ------------------------------
// ------------------------------
// ------------------------------
// Các kiểu dữ liệu thống kê 
export interface BloodTypeStats {
  MaNhomMau: string;
  MoTaNhomMau: string;
  SoLuong: number;
  PhanTram: number;
}

export interface DonationStats {
  tongSoDangKy: number;
  soLuongThanhCong: number;
  thongKeTheoThang: Array<{
    thang: string;
    soLuong: number;
  }>;
}

export interface BloodBankReport {
  bloodTypeStats: BloodTypeStats[];
  donationStats: DonationStats;
  eventStats: {
    totalEvents: number;
    upcomingEvents: number;
    ongoingEvents: number;
    completedEvents: number;
  };
} 