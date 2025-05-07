import * as types from "../types";
import { BaoCaoNganHangMau, TrangThaiSuKien, BloodTypeStats, DonationStats, BloodBankReport } from "../types";

// Dữ liệu mẫu cho vai trò
export const mockRoles: types.VAITRO[] = [
  { MaVaiTro: "rol1", TenVaiTro: "Admin", MoTa: "Quản trị viên hệ thống" },
  { MaVaiTro: "rol2", TenVaiTro: "Người hiến máu", MoTa: "Người dùng đăng ký hiến máu" },
  { MaVaiTro: "rol3", TenVaiTro: "Nhân viên y tế", MoTa: "Nhân viên quản lý hiến máu" },
  { MaVaiTro: "rol4", TenVaiTro: "Bác sĩ", MoTa: "Bác sĩ kiểm tra sức khỏe người hiến máu" },
  { MaVaiTro: "rol5", TenVaiTro: "Trưởng cơ sở tình nguyện", MoTa: "Quản lý cơ sở tình nguyện" },
  { MaVaiTro: "rol6", TenVaiTro: "Giám đốc ngân hàng máu", MoTa: "Quản lý ngân hàng máu" }
];

// Dữ liệu mẫu cho nhóm máu
export const mockBloodTypes: types.NHOMMAU[] = [
  { 
    MaNhomMau: "A+", 
    MoTaNhomMau: "A Dương", 
    DoPhoBien: 34, 
    GhiChu: "Người có nhóm máu A+ có thể hiến máu cho người có nhóm máu A+ và AB+",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  },
  { 
    MaNhomMau: "A-", 
    MoTaNhomMau: "A Âm", 
    DoPhoBien: 6, 
    GhiChu: "Người có nhóm máu A- có thể hiến máu cho người có nhóm máu A+, A-, AB+, AB-",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  },
  { 
    MaNhomMau: "B+", 
    MoTaNhomMau: "B Dương", 
    DoPhoBien: 26, 
    GhiChu: "Người có nhóm máu B+ có thể hiến máu cho người có nhóm máu B+ và AB+",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  },
  { 
    MaNhomMau: "B-", 
    MoTaNhomMau: "B Âm", 
    DoPhoBien: 3, 
    GhiChu: "Người có nhóm máu B- có thể hiến máu cho người có nhóm máu B+, B-, AB+, AB-",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  },
  { 
    MaNhomMau: "O+", 
    MoTaNhomMau: "O Dương", 
    DoPhoBien: 25, 
    GhiChu: "Người có nhóm máu O+ có thể hiến máu cho người có nhóm máu O+, A+, B+, AB+",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  },
  { 
    MaNhomMau: "O-", 
    MoTaNhomMau: "O Âm", 
    DoPhoBien: 3, 
    GhiChu: "Người có nhóm máu O- có thể hiến máu cho tất cả các nhóm máu",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  },
  { 
    MaNhomMau: "AB+", 
    MoTaNhomMau: "AB Dương", 
    DoPhoBien: 2, 
    GhiChu: "Người có nhóm máu AB+ có thể hiến máu cho người có nhóm máu AB+",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  },
  { 
    MaNhomMau: "AB-", 
    MoTaNhomMau: "AB Âm", 
    DoPhoBien: 1, 
    GhiChu: "Người có nhóm máu AB- có thể hiến máu cho người có nhóm máu AB+ và AB-",
    NgayTao: new Date(2023, 0, 1).toISOString(),
    NgaySua: new Date(2023, 0, 1).toISOString()
  }
];

// Dữ liệu mẫu cho thành phố
export const mockCities: types.THANHPHO[] = [
  { IdThanhPho: "tp1", TenThanhPho: "TP Hồ Chí Minh" },
  { IdThanhPho: "tp2", TenThanhPho: "Hà Nội" },
  { IdThanhPho: "tp3", TenThanhPho: "Đà Nẵng" }
];

// Dữ liệu mẫu cho quận
export const mockDistricts: types.QUAN_WithCity[] = [
  { IdQuan: "q1", IdThanhPho: "tp1", TenQuan: "Quận 1", ThanhPho: mockCities[0] },
  { IdQuan: "q2", IdThanhPho: "tp1", TenQuan: "Quận 3", ThanhPho: mockCities[0] },
  { IdQuan: "q3", IdThanhPho: "tp1", TenQuan: "Quận 5", ThanhPho: mockCities[0] },
  { IdQuan: "q4", IdThanhPho: "tp1", TenQuan: "Quận Thủ Đức", ThanhPho: mockCities[0] }
];

// Dữ liệu mẫu cho phường
export const mockWards: types.PHUONG_WithQuan[] = [
  { IdPhuong: "p1", IdQuan: "q4", TenPhuong: "Phường Linh Trung", Quan: mockDistricts[3] },
  { IdPhuong: "p2", IdQuan: "q3", TenPhuong: "Phường 4", Quan: mockDistricts[2] },
  { IdPhuong: "p3", IdQuan: "q3", TenPhuong: "Phường 5", Quan: mockDistricts[2] },
  { IdPhuong: "p4", IdQuan: "q1", TenPhuong: "Phường Bến Nghé", Quan: mockDistricts[0] }
];

// Dữ liệu mẫu cho thông báo
export const mockNotifications: types.THONGBAODKTOCHUC[] = [
  {
    IdThongBaoDK: "tb1",
    IDNguoiTao: "user1",
    TieuDe: "Kêu gọi hiến máu tháng 9/2023",
    NoiDung: "Ngân hàng máu đang rất cần các tình nguyện viên hiến máu nhóm O và A trong tháng 9/2023. Mời các đơn vị đăng ký tổ chức hiến máu.",
    SoLuongMauHien: 100,
    HanDangKi: new Date(2023, 8, 14).toISOString(),
    TgBatDauDK: new Date(2023, 8, 15).toISOString(),
    TgKetThucDK: new Date(2023, 9, 15).toISOString(),
    HanDK: new Date(2023, 8, 14).toISOString(),
    TgBatDauSK: new Date(2023, 9, 16).toISOString(),
    TgKetThucSK: new Date(2023, 9, 20).toISOString(),
    NgayDang: new Date(2023, 8, 1).toISOString(),
    NgaySua: new Date(2023, 8, 1).toISOString()
  },
  {
    IdThongBaoDK: "tb2",
    IDNguoiTao: "user1",
    TieuDe: "Kêu gọi hiến máu tháng 10/2023",
    NoiDung: "Cùng chung tay vì cộng đồng, mời các trường đại học đăng ký tổ chức hiến máu tình nguyện.",
    SoLuongMauHien: 150,
    HanDangKi: new Date(2023, 9, 14).toISOString(),
    TgBatDauDK: new Date(2023, 9, 15).toISOString(),
    TgKetThucDK: new Date(2023, 10, 15).toISOString(),
    HanDK: new Date(2023, 9, 14).toISOString(),
    TgBatDauSK: new Date(2023, 10, 16).toISOString(),
    TgKetThucSK: new Date(2023, 10, 20).toISOString(),
    NgayDang: new Date(2023, 9, 1).toISOString(),
    NgaySua: new Date(2023, 9, 1).toISOString()
  },
  {
    IdThongBaoDK: "tb3",
    IDNguoiTao: "user1",
    TieuDe: "Kêu gọi hiến máu tháng 11/2023",
    NoiDung: "Mùa lễ hội đến gần, nhu cầu máu tăng cao. Mời các đơn vị đăng ký tổ chức hiến máu tình nguyện.",
    SoLuongMauHien: 200,
    HanDangKi: new Date(2023, 10, 14).toISOString(),
    TgBatDauDK: new Date(2023, 10, 15).toISOString(),
    TgKetThucDK: new Date(2023, 11, 15).toISOString(),
    HanDK: new Date(2023, 10, 14).toISOString(),
    TgBatDauSK: new Date(2023, 11, 16).toISOString(),
    TgKetThucSK: new Date(2023, 11, 20).toISOString(),
    NgayDang: new Date(2023, 10, 1).toISOString(),
    NgaySua: new Date(2023, 10, 1).toISOString()
  }
];

// Dữ liệu mẫu cho các cơ sở tình nguyện
export const mockVolunteerCenters: types.COSOTINHNGUYEN_WithLocation[] = [
  {
    IDCoSoTinhNguyen: "cs1",
    TenCoSoTinhNguyen: "Trường Đại học Sư phạm Kỹ thuật",
    DiaChi: "1 Võ Văn Ngân, Thủ Đức",
    SDT: "0912345678",
    Email: "spkt@hcmute.edu.vn",
    IdPhuong: "p1",
    NguoiPhuTrach: "Nguyễn Văn A",
    MinhChung: "giay_phep_cs1.pdf",
    UserName: "spkt_hcmute",
    MatKhau: "hashed_password",
    TinhTrang: true,
    NgayTao: new Date(2023, 1, 1).toISOString(),
    Phuong: mockWards[0]
  },
  {
    IDCoSoTinhNguyen: "cs2",
    TenCoSoTinhNguyen: "Trường Đại học Bách Khoa",
    DiaChi: "268 Lý Thường Kiệt, Quận 10",
    SDT: "0987654321",
    Email: "bk@hcmut.edu.vn",
    IdPhuong: "p2",
    NguoiPhuTrach: "Trần Văn B",
    MinhChung: "giay_phep_cs2.pdf",
    UserName: "bk_hcmut",
    MatKhau: "hashed_password",
    TinhTrang: true,
    NgayTao: new Date(2023, 1, 1).toISOString(),
    Phuong: mockWards[1]
  },
  {
    IDCoSoTinhNguyen: "cs3",
    TenCoSoTinhNguyen: "Trường Đại học Khoa học Tự nhiên",
    DiaChi: "227 Nguyễn Văn Cừ, Quận 5",
    SDT: "0976543210",
    Email: "hcmus@hcmus.edu.vn",
    IdPhuong: "p3",
    NguoiPhuTrach: "Lê Văn C",
    MinhChung: "giay_phep_cs3.pdf",
    UserName: "khtn_hcmus",
    MatKhau: "hashed_password",
    TinhTrang: true,
    NgayTao: new Date(2023, 1, 1).toISOString(),
    Phuong: mockWards[2]
  }
];

// Dữ liệu mẫu cho đăng ký tổ chức hiến máu
export const mockRegistrationRequests: types.DANGKITOCHUCHIENMAU_WithRelations[] = [
  {
    IdSuKien: "dk1",
    IdThongBaoDK: "tb1",
    IDCoSoTinhNguyen: "cs1",
    NgayDangKi: new Date(2023, 8, 5).toISOString(),
    TinhTrangDK: "pending",
    SoLuongDK: 50,
    SoLuongDDK: 0,
    TrangThaiSuKien: "upcoming",
    NgayDang: new Date(2023, 8, 5).toISOString(),
    NgaySua: new Date(2023, 8, 5).toISOString(),
    HanDK: new Date(2023, 8, 14).toISOString(),
    CoSoTinhNguyen: mockVolunteerCenters[0],
    ThongBao: mockNotifications[0]
  },
  {
    IdSuKien: "dk2",
    IdThongBaoDK: "tb1",
    IDCoSoTinhNguyen: "cs2",
    NgayDangKi: new Date(2023, 8, 7).toISOString(),
    TinhTrangDK: "pending",
    SoLuongDK: 75,
    SoLuongDDK: 0,
    TrangThaiSuKien: "upcoming",
    NgayDang: new Date(2023, 8, 7).toISOString(),
    NgaySua: new Date(2023, 8, 7).toISOString(),
    HanDK: new Date(2023, 8, 14).toISOString(),
    CoSoTinhNguyen: mockVolunteerCenters[1],
    ThongBao: mockNotifications[0]
  },
  {
    IdSuKien: "dk3",
    IdThongBaoDK: "tb2",
    IDCoSoTinhNguyen: "cs3",
    NgayDangKi: new Date(2023, 9, 3).toISOString(),
    TinhTrangDK: "pending",
    SoLuongDK: 100,
    SoLuongDDK: 0,
    TrangThaiSuKien: "upcoming",
    NgayDang: new Date(2023, 9, 3).toISOString(),
    NgaySua: new Date(2023, 9, 3).toISOString(),
    HanDK: new Date(2023, 9, 14).toISOString(),
    CoSoTinhNguyen: mockVolunteerCenters[2],
    ThongBao: mockNotifications[1]
  },
  {
    IdSuKien: "dk4",
    IdThongBaoDK: "tb1",
    IDCoSoTinhNguyen: "cs3",
    NgayDangKi: new Date(2023, 8, 10).toISOString(),
    TinhTrangDK: "approved",
    SoLuongDK: 120,
    SoLuongDDK: 80,
    TrangThaiSuKien: "ongoing",
    NgayDang: new Date(2023, 8, 10).toISOString(),
    NgaySua: new Date(2023, 8, 20).toISOString(),
    HanDK: new Date(2023, 8, 14).toISOString(),
    CoSoTinhNguyen: mockVolunteerCenters[2],
    ThongBao: mockNotifications[0]
  },
  {
    IdSuKien: "dk5",
    IdThongBaoDK: "tb2",
    IDCoSoTinhNguyen: "cs1",
    NgayDangKi: new Date(2023, 9, 5).toISOString(),
    TinhTrangDK: "rejected",
    SoLuongDK: 80,
    SoLuongDDK: 0,
    TrangThaiSuKien: "cancelled",
    NgayDang: new Date(2023, 9, 5).toISOString(),
    NgaySua: new Date(2023, 9, 8).toISOString(),
    HanDK: new Date(2023, 9, 14).toISOString(),
    CoSoTinhNguyen: mockVolunteerCenters[0],
    ThongBao: mockNotifications[1]
  },
  {
    IdSuKien: "dk6",
    IdThongBaoDK: "tb3",
    IDCoSoTinhNguyen: "cs2",
    NgayDangKi: new Date(2023, 10, 7).toISOString(),
    TinhTrangDK: "pending",
    SoLuongDK: 150,
    SoLuongDDK: 0,
    TrangThaiSuKien: "upcoming",
    NgayDang: new Date(2023, 10, 7).toISOString(),
    NgaySua: new Date(2023, 10, 7).toISOString(),
    HanDK: new Date(2023, 10, 14).toISOString(),
    CoSoTinhNguyen: mockVolunteerCenters[1],
    ThongBao: mockNotifications[2]
  },
  {
    IdSuKien: "dk7",
    IdThongBaoDK: "tb3",
    IDCoSoTinhNguyen: "cs3",
    NgayDangKi: new Date(2023, 10, 9).toISOString(),
    TinhTrangDK: "pending",
    SoLuongDK: 200,
    SoLuongDDK: 0,
    TrangThaiSuKien: "upcoming",
    NgayDang: new Date(2023, 10, 9).toISOString(),
    NgaySua: new Date(2023, 10, 9).toISOString(),
    HanDK: new Date(2023, 10, 14).toISOString(),
    CoSoTinhNguyen: mockVolunteerCenters[2],
    ThongBao: mockNotifications[2]
  }
];

// Dữ liệu mẫu cho sự kiện hiến máu
export const mockEvents = mockRegistrationRequests.filter(
  req => req.TinhTrangDK === "approved" || req.TinhTrangDK === "pending"
);

// Dữ liệu mẫu thống kê nhóm máu
export const mockBloodTypeStats: BloodTypeStats[] = [
  { MaNhomMau: "A+", MoTaNhomMau: "A Dương", SoLuong: 215, PhanTram: 34.0 },
  { MaNhomMau: "A-", MoTaNhomMau: "A Âm", SoLuong: 38, PhanTram: 6.0 },
  { MaNhomMau: "B+", MoTaNhomMau: "B Dương", SoLuong: 165, PhanTram: 26.0 },
  { MaNhomMau: "B-", MoTaNhomMau: "B Âm", SoLuong: 19, PhanTram: 3.0 },
  { MaNhomMau: "O+", MoTaNhomMau: "O Dương", SoLuong: 158, PhanTram: 25.0 },
  { MaNhomMau: "O-", MoTaNhomMau: "O Âm", SoLuong: 19, PhanTram: 3.0 },
  { MaNhomMau: "AB+", MoTaNhomMau: "AB Dương", SoLuong: 13, PhanTram: 2.0 },
  { MaNhomMau: "AB-", MoTaNhomMau: "AB Âm", SoLuong: 6, PhanTram: 1.0 }
];

// Dữ liệu mẫu thống kê hiến máu
export const mockDonationStats: DonationStats = {
  tongSoDangKy: 832,
  soLuongThanhCong: 634,
  thongKeTheoThang: [
    { thang: "T1", soLuong: 45 },
    { thang: "T2", soLuong: 52 },
    { thang: "T3", soLuong: 48 },
    { thang: "T4", soLuong: 70 },
    { thang: "T5", soLuong: 55 },
    { thang: "T6", soLuong: 59 },
    { thang: "T7", soLuong: 65 },
    { thang: "T8", soLuong: 51 },
    { thang: "T9", soLuong: 72 },
    { thang: "T10", soLuong: 48 },
    { thang: "T11", soLuong: 60 },
    { thang: "T12", soLuong: 59 }
  ]
};

// Dữ liệu mẫu báo cáo ngân hàng máu (cũ)
export const mockBloodBankReport: BaoCaoNganHangMau = {
  thongKeNhomMau: mockBloodTypeStats,
  thongKeHienMau: mockDonationStats,
  thongKeSuKien: {
    tongSoSuKien: 24,
    suKienSapDienRa: 5,
    suKienDaHoanThanh: 19
  }
};

// Dữ liệu mẫu báo cáo ngân hàng máu (mới)
export const mockBloodBankReportNew: BloodBankReport = {
  bloodTypeStats: mockBloodTypeStats,
  donationStats: mockDonationStats,
  eventStats: {
    totalEvents: 24,
    upcomingEvents: 5,
    ongoingEvents: 2,
    completedEvents: 17
  }
}; 