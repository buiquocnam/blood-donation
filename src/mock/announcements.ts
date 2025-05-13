import { THONGBAODKTOCHUC, DANHMUCDVMAU } from '../types';

// Mock data for DANHMUCDVMAU (Blood Unit Catalog)
export const mockDanhMucDVMau: DANHMUCDVMAU[] = [
  {
    IdDanhMucDVHienMau: "DM001",
    SoLuongMau: 250,
    GhiChu: "Hiến máu tiêu chuẩn - 250ml"
  },
  {
    IdDanhMucDVHienMau: "DM002",
    SoLuongMau: 350,
    GhiChu: "Hiến máu nâng cao - 350ml"
  },
  {
    IdDanhMucDVHienMau: "DM003",
    SoLuongMau: 450,
    GhiChu: "Hiến máu đặc biệt - 450ml"
  }
];

// Mock data for THONGBAODKTOCHUC (Organization Registration Announcements)
export const mockThongBaoDKToChuc: THONGBAODKTOCHUC[] = [
  {
    IdThongBaoDK: "TB001",
    IDNguoiTao: "ND006",
    TieuDe: "Chiến dịch Hiến máu Mùa Hè 2024",
    NoiDung: "Mời các cơ sở tình nguyện đăng ký tham gia chiến dịch hiến máu mùa hè 2024. Chúng tôi cần thu thập ít nhất 1000 đơn vị máu để đáp ứng nhu cầu trong dịp hè sắp tới.",
    SoLuongMauHien: 1000,
    HanDangKi: "2024-05-15",
    TgBatDauDK: "2024-04-15T00:00:00.000Z",
    TgKetThucDK: "2024-05-15T23:59:59.000Z",
    HanDK: "2024-05-15",
    NgayDang: "2024-04-10T08:00:00.000Z",
    NgaySua: "2024-04-10T08:00:00.000Z",
    TgBatDauSK: "2024-06-01T08:00:00.000Z",
    TgKetThucSK: "2024-06-30T18:00:00.000Z"
  },
  {
    IdThongBaoDK: "TB002",
    IDNguoiTao: "ND006",
    TieuDe: "Hiến máu Nhân đạo - Kỷ niệm Ngày Quốc tế Hiến máu",
    NoiDung: "Nhân dịp kỷ niệm Ngày Quốc tế Hiến máu 14/06, chúng tôi tổ chức chiến dịch hiến máu nhân đạo trên toàn quốc. Mời các cơ sở tình nguyện đăng ký tham gia.",
    SoLuongMauHien: 2000,
    HanDangKi: "2024-05-30",
    TgBatDauDK: "2024-05-01T00:00:00.000Z",
    TgKetThucDK: "2024-05-30T23:59:59.000Z",
    HanDK: "2024-05-30",
    NgayDang: "2024-04-25T09:30:00.000Z",
    NgaySua: "2024-04-25T09:30:00.000Z",
    TgBatDauSK: "2024-06-14T07:00:00.000Z",
    TgKetThucSK: "2024-06-14T19:00:00.000Z"
  },
  {
    IdThongBaoDK: "TB003",
    IDNguoiTao: "ND006",
    TieuDe: "Hiến máu Cứu người - Mùa Thu 2024",
    NoiDung: "Chiến dịch hiến máu mùa thu 2024 sẽ diễn ra trong tháng 9. Mời các cơ sở tình nguyện đăng ký tham gia để giúp đỡ những người cần máu.",
    SoLuongMauHien: 1500,
    HanDangKi: "2024-08-20",
    TgBatDauDK: "2024-07-20T00:00:00.000Z",
    TgKetThucDK: "2024-08-20T23:59:59.000Z",
    HanDK: "2024-08-20",
    NgayDang: "2024-07-15T10:45:00.000Z",
    NgaySua: "2024-07-15T10:45:00.000Z",
    TgBatDauSK: "2024-09-01T08:00:00.000Z",
    TgKetThucSK: "2024-09-30T18:00:00.000Z"
  }
]; 