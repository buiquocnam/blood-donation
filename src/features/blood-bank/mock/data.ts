import { BloodEvent, BloodTypeStats, DonationStats, Notification, RegistrationRequest, VolunteerCenter } from "../types";

// Dữ liệu mẫu cho thông báo
export const mockNotifications: Notification[] = [
  {
    IdThongBaoDK: "tb1",
    IdNguoiTao: "user1",
    TieuDe: "Kêu gọi hiến máu tháng 9/2023",
    NoiDung: "Ngân hàng máu đang rất cần các tình nguyện viên hiến máu nhóm O và A trong tháng 9/2023. Mời các đơn vị đăng ký tổ chức hiến máu.",
    SoLuongHien: 100,
    HanDangKi: new Date(2023, 8, 25).toISOString(),
    TgBatDauDK: new Date(2023, 8, 1).toISOString(),
    TgKetThucDK: new Date(2023, 8, 20).toISOString(),
    HanDK: new Date(2023, 8, 30).toISOString(),
    NgayDang: new Date(2023, 8, 1).toISOString(),
    NgaySua: new Date(2023, 8, 1).toISOString()
  },
  {
    IdThongBaoDK: "tb2",
    IdNguoiTao: "user1",
    TieuDe: "Kêu gọi hiến máu tháng 10/2023",
    NoiDung: "Cùng chung tay vì cộng đồng, mời các trường đại học đăng ký tổ chức hiến máu tình nguyện.",
    SoLuongHien: 150,
    HanDangKi: new Date(2023, 9, 25).toISOString(),
    TgBatDauDK: new Date(2023, 9, 1).toISOString(),
    TgKetThucDK: new Date(2023, 9, 20).toISOString(),
    HanDK: new Date(2023, 9, 30).toISOString(),
    NgayDang: new Date(2023, 9, 1).toISOString(),
    NgaySua: new Date(2023, 9, 1).toISOString()
  },
  {
    IdThongBaoDK: "tb3",
    IdNguoiTao: "user1",
    TieuDe: "Kêu gọi hiến máu tháng 11/2023",
    NoiDung: "Mùa lễ hội đến gần, nhu cầu máu tăng cao. Mời các đơn vị đăng ký tổ chức hiến máu tình nguyện.",
    SoLuongHien: 200,
    HanDangKi: new Date(2023, 10, 25).toISOString(),
    TgBatDauDK: new Date(2023, 10, 1).toISOString(),
    TgKetThucDK: new Date(2023, 10, 20).toISOString(),
    HanDK: new Date(2023, 10, 30).toISOString(),
    NgayDang: new Date(2023, 10, 1).toISOString(),
    NgaySua: new Date(2023, 10, 1).toISOString()
  }
];

// Dữ liệu mẫu cho các cơ sở tình nguyện
export const mockVolunteerCenters: VolunteerCenter[] = [
  {
    IDCoSoTinhNguyen: "cs1",
    TenCoSoTinhNguyen: "Trường Đại học Sư phạm Kỹ thuật",
    SDT: "0912345678",
    Email: "spkt@hcmute.edu.vn",
    NguoiPhuTrach: "Nguyễn Văn A",
    idPhuong: "p1",
    DiaChi: "1 Võ Văn Ngân, Thủ Đức",
    TinhTrang: "active",
    NgayTao: new Date(2023, 0, 1).toISOString()
  },
  {
    IDCoSoTinhNguyen: "cs2",
    TenCoSoTinhNguyen: "Trường Đại học Bách Khoa",
    SDT: "0987654321",
    Email: "bk@hcmut.edu.vn",
    NguoiPhuTrach: "Trần Văn B",
    idPhuong: "p2",
    DiaChi: "268 Lý Thường Kiệt, Quận 10",
    TinhTrang: "active",
    NgayTao: new Date(2023, 0, 2).toISOString()
  },
  {
    IDCoSoTinhNguyen: "cs3",
    TenCoSoTinhNguyen: "Trường Đại học Khoa học Tự nhiên",
    SDT: "0976543210",
    Email: "hcmus@hcmus.edu.vn",
    NguoiPhuTrach: "Lê Văn C",
    idPhuong: "p3",
    DiaChi: "227 Nguyễn Văn Cừ, Quận 5",
    TinhTrang: "active",
    NgayTao: new Date(2023, 0, 3).toISOString()
  }
];

// Dữ liệu mẫu cho đăng ký hiến máu
export const mockRegistrationRequests: RegistrationRequest[] = [
  {
    IdDangKiTC: "dk1",
    IDThongBaoDK: "tb1",
    IDCoSoTinhNguyen: "cs1",
    NgayDangKi: new Date(2023, 8, 5).toISOString(),
    TinhTrangDK: "pending",
    CoSoTinhNguyen: mockVolunteerCenters[0],
    ThongBao: mockNotifications[0]
  },
  {
    IdDangKiTC: "dk2",
    IDThongBaoDK: "tb1",
    IDCoSoTinhNguyen: "cs2",
    NgayDangKi: new Date(2023, 8, 7).toISOString(),
    TinhTrangDK: "pending",
    CoSoTinhNguyen: mockVolunteerCenters[1],
    ThongBao: mockNotifications[0]
  },
  {
    IdDangKiTC: "dk3",
    IDThongBaoDK: "tb2",
    IDCoSoTinhNguyen: "cs3",
    NgayDangKi: new Date(2023, 9, 3).toISOString(),
    TinhTrangDK: "pending",
    CoSoTinhNguyen: mockVolunteerCenters[2],
    ThongBao: mockNotifications[1]
  },
  {
    IdDangKiTC: "dk4",
    IDThongBaoDK: "tb1",
    IDCoSoTinhNguyen: "cs3",
    NgayDangKi: new Date(2023, 8, 10).toISOString(),
    TinhTrangDK: "approved",
    CoSoTinhNguyen: mockVolunteerCenters[2],
    ThongBao: mockNotifications[0]
  },
  {
    IdDangKiTC: "dk5",
    IDThongBaoDK: "tb2",
    IDCoSoTinhNguyen: "cs1",
    NgayDangKi: new Date(2023, 9, 5).toISOString(),
    TinhTrangDK: "rejected",
    CoSoTinhNguyen: mockVolunteerCenters[0],
    ThongBao: mockNotifications[1]
  }
];

// Dữ liệu mẫu cho sự kiện hiến máu
export const mockBloodEvents: BloodEvent[] = [
  {
    IdSuKienHienMau: "sk1",
    IdDangKiTC: "dk4",
    SoLuongDK: 50,
    SoLuongDDK: 40,
    TgBatDauSK: new Date(2023, 8, 25).toISOString(),
    TgKetThucSK: new Date(2023, 8, 25, 16, 0).toISOString(),
    NgayDang: new Date(2023, 8, 15).toISOString(),
    NgaySua: new Date(2023, 8, 15).toISOString(),
    HanDK: new Date(2023, 8, 23).toISOString(),
    TrangThaiSuKien: "upcoming",
    DangKiTC: mockRegistrationRequests[3]
  }
];

// Dữ liệu mẫu cho thống kê nhóm máu
export const mockBloodTypeStats: BloodTypeStats[] = [
  { MaNhomMau: "A+", MoTaNhomMau: "A Dương", SoLuong: 250, PhanTram: 34.7 },
  { MaNhomMau: "A-", MoTaNhomMau: "A Âm", SoLuong: 30, PhanTram: 4.2 },
  { MaNhomMau: "B+", MoTaNhomMau: "B Dương", SoLuong: 185, PhanTram: 25.7 },
  { MaNhomMau: "B-", MoTaNhomMau: "B Âm", SoLuong: 20, PhanTram: 2.8 },
  { MaNhomMau: "O+", MoTaNhomMau: "O Dương", SoLuong: 180, PhanTram: 25.0 },
  { MaNhomMau: "O-", MoTaNhomMau: "O Âm", SoLuong: 25, PhanTram: 3.5 },
  { MaNhomMau: "AB+", MoTaNhomMau: "AB Dương", SoLuong: 25, PhanTram: 3.5 },
  { MaNhomMau: "AB-", MoTaNhomMau: "AB Âm", SoLuong: 5, PhanTram: 0.7 }
];

// Dữ liệu mẫu cho thống kê hiến máu
export const mockDonationStats: DonationStats = {
  totalDonations: 720,
  totalVolume: 324000, // mL
  successfulDonations: 700,
  failedDonations: 20,
  byMonth: [
    { month: "Tháng 1", count: 50 },
    { month: "Tháng 2", count: 45 },
    { month: "Tháng 3", count: 60 },
    { month: "Tháng 4", count: 55 },
    { month: "Tháng 5", count: 70 },
    { month: "Tháng 6", count: 65 },
    { month: "Tháng 7", count: 80 },
    { month: "Tháng 8", count: 85 },
    { month: "Tháng 9", count: 90 },
    { month: "Tháng 10", count: 75 },
    { month: "Tháng 11", count: 20 },
    { month: "Tháng 12", count: 25 }
  ]
}; 