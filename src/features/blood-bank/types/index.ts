export interface User {
  MaNguoiDung: string;
  HoTen: string;
  Email: string;
  VaiTro: string;
}

export interface Notification {
  IdThongBaoDK: string;
  IdNguoiTao: string;
  TieuDe: string;
  NoiDung: string;
  SoLuongHien: number;
  HanDangKi: string;
  TgBatDauDK: string;
  TgKetThucDK: string;
  HanDK: string;
  NgayDang: string;
  NgaySua: string;
}

export interface NotificationFormData {
  TieuDe: string;
  NoiDung: string;
  SoLuongHien: number;
  HanDangKi: string;
  TgBatDauDK: string;
  TgKetThucDK: string;
  HanDK: string;
}

export interface VolunteerCenter {
  IDCoSoTinhNguyen: string;
  TenCoSoTinhNguyen: string;
  SDT: string;
  Email: string;
  NguoiPhuTrach: string;
  idPhuong: string;
  DiaChi: string;
  TinhTrang: string;
  NgayTao: string;
}

export interface RegistrationRequest {
  IdDangKiTC: string;
  IDThongBaoDK: string;
  IDCoSoTinhNguyen: string;
  NgayDangKi: string;
  TinhTrangDK: 'pending' | 'approved' | 'rejected';
  CoSoTinhNguyen?: VolunteerCenter;
  ThongBao?: Notification;
}

export interface BloodEvent {
  IdSuKienHienMau: string;
  IdDangKiTC: string;
  SoLuongDK: number;
  SoLuongDDK: number;
  TgBatDauSK: string;
  TgKetThucSK: string;
  NgayDang: string;
  NgaySua: string;
  HanDK: string;
  TrangThaiSuKien: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  DangKiTC?: RegistrationRequest;
}

export interface EventFormData {
  TgBatDauSK: string;
  TgKetThucSK: string;
  HanDK: string;
}

export interface BloodTypeStats {
  MaNhomMau: string;
  MoTaNhomMau: string;
  SoLuong: number;
  PhanTram: number;
}

export interface DonationStats {
  totalDonations: number;
  totalVolume: number;
  successfulDonations: number;
  failedDonations: number;
  byMonth: Array<{
    month: string;
    count: number;
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