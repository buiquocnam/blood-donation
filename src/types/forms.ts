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