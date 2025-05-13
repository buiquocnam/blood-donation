import { 
  DANGKITOCHUCHIENMAU, 
  DANGKIHIENMAU, 
  PHANHOI, 
  GIAYCHUNGNHAN,
  TrangThaiDangKy,
  TrangThaiHienMau,
  TrangThaiSuKien,
  TrangThaiSucKhoe,
  THONGBAODKTOCHUC
} from '../types';

// mockDangKiToChucHienMau, mockDangKiHienMau, mockPhanHoi, mockGiayChungNhan

// Mock data for DANGKITOCHUCHIENMAU (Blood Donation Event Registration)
export const mockDangKiToChucHienMau: DANGKITOCHUCHIENMAU[] = [
  {
    IdSuKien: "SK001",
    IdThongBaoDK: "TB001",
    IDCoSoTinhNguyen: "CS001",
    NgayDangKi: "2024-04-16T09:15:00.000Z",
    TinhTrangDK: TrangThaiDangKy.DA_DUYET,
    SoLuongDK: 150,
    SoLuongDDK: 1,
    TrangThaiSuKien: TrangThaiSuKien.SAP_DIEN_RA,
    NgayDang: "2024-04-16T09:15:00.000Z",
    NgaySua: "2024-04-18T14:30:00.000Z",
    HanDK: "2024-05-15"
  },
  {
    IdSuKien: "SK002",
    IdThongBaoDK: "TB001",
    IDCoSoTinhNguyen: "CS002",
    NgayDangKi: "2024-04-17T10:20:00.000Z",
    TinhTrangDK: TrangThaiDangKy.DA_DUYET,
    SoLuongDK: 100,
    SoLuongDDK: 2,
    TrangThaiSuKien: TrangThaiSuKien.DANG_DIEN_RA,
    NgayDang: "2024-04-17T10:20:00.000Z",
    NgaySua: "2024-04-19T11:45:00.000Z",
    HanDK: "2024-05-15"
  },
  {
    IdSuKien: "SK003",
    IdThongBaoDK: "TB002",
    IDCoSoTinhNguyen: "CS003",
    NgayDangKi: "2024-05-05T08:30:00.000Z",
    TinhTrangDK: TrangThaiDangKy.CHO_DUYET,
    SoLuongDK: 200,
    SoLuongDDK: 1,
    TrangThaiSuKien: TrangThaiSuKien.SAP_DIEN_RA,
    NgayDang: "2024-05-05T08:30:00.000Z",
    NgaySua: "2024-05-05T08:30:00.000Z",
    HanDK: "2024-05-30"
  },
  {
    IdSuKien: "SK004",
    IdThongBaoDK: "TB002",
    IDCoSoTinhNguyen: "CS004",
    NgayDangKi: "2024-05-08T13:45:00.000Z",
    TinhTrangDK: TrangThaiDangKy.CHO_DUYET,
    SoLuongDK: 200,
    SoLuongDDK: 0,
    TrangThaiSuKien: TrangThaiSuKien.SAP_DIEN_RA,
    NgayDang: "2024-05-08T13:45:00.000Z",
    NgaySua: "2024-05-08T13:45:00.000Z",
    HanDK: "2024-05-30"
  },
  {
    IdSuKien: "SK005",
    IdThongBaoDK: "TB003",
    IDCoSoTinhNguyen: "CS005",
    NgayDangKi: "2024-07-22T09:10:00.000Z",
    TinhTrangDK: TrangThaiDangKy.TU_CHOI,
    SoLuongDK: 250,
    SoLuongDDK: 0,
    TrangThaiSuKien: TrangThaiSuKien.DA_HUY,
    NgayDang: "2024-07-22T09:10:00.000Z",
    NgaySua: "2024-07-22T09:10:00.000Z",
    HanDK: "2024-08-20"
  },
  {
    IdSuKien: "SK006",
    IdThongBaoDK: "TB004",
    IDCoSoTinhNguyen: "CS006",
    NgayDangKi: "2024-01-15T09:10:00.000Z",
    TinhTrangDK: TrangThaiDangKy.DA_DUYET,
    SoLuongDK: 180,
    SoLuongDDK: 1,
    TrangThaiSuKien: TrangThaiSuKien.DA_HOAN_THANH,
    NgayDang: "2024-01-15T09:10:00.000Z",
    NgaySua: "2024-02-05T09:10:00.000Z",
    HanDK: "2024-01-25"
  }
];

// Mock data for DANGKIHIENMAU (Blood Donation Registrations)
export const mockDangKiHienMau: DANGKIHIENMAU[] = [
  // 1. TRƯỜNG HỢP ĐÃ HOÀN THÀNH HIẾN MÁU - ĐƠN ĐÃ DUYỆT (SK006)
  {
    MaDKiHienMau: "DK001",
    IdNguoiHienMau: "ND001",
    IdNVDuyet: "ND003",
    IdBacSi: "ND004",
    IdSuKienHienMau: "SK006",
    IdDanhMucDVHienMau: "DM001",
    TrangThaiHienMau: TrangThaiHienMau.DA_HOAN_THANH, // Đã hiến máu thành công
    TrangThaiDonDK: TrangThaiDangKy.DA_DUYET, // Đơn đã được duyệt
    NgayDangKi: "2024-01-18T08:00:00.000Z",
    NgaySua: "2024-02-02T10:30:00.000Z",
    ChieuCao: 170,
    CanNang: 65,
    NhietDo: 36.5,
    NhipTim: 72,
    HuyetAp: "120/80",
    DaTungHienMau: true,
    TienSuBenh: "Không có",
    MacBenhHienTai: "Không có",
    ThongTin12ThangQua: "Không có phẫu thuật hoặc tiêm máu",
    ThongTin6ThangQua: "Không có xăm mình hoặc châm cứu",
    ThongTin1ThangQua: "Không có sốt hoặc dùng kháng sinh",
    ThongTin14NgayQua: "Không có tiếp xúc với người bệnh truyền nhiễm",
    Thuoc7Ngay: "Không dùng thuốc",
    ThongTinPhuNu12ThangQua: "",
    TTSKKhamSangLoc: TrangThaiSucKhoe.DU_DIEU_KIEN,
    TTSKSauHien: "Bình thường",
    GhiChu: "Hiến máu thành công"
  },
  
  // 2. TRƯỜNG HỢP ĐANG CHỜ DUYỆT ĐƠN (SK001)
  {
    MaDKiHienMau: "DK003",
    IdNguoiHienMau: "ND001",
    IdNVDuyet: "",
    IdBacSi: "",
    IdSuKienHienMau: "SK001",
    IdDanhMucDVHienMau: "DM001",
    TrangThaiHienMau: TrangThaiHienMau.CHO_HIEN, // Chưa hiến máu
    TrangThaiDonDK: TrangThaiDangKy.CHO_DUYET, // Đơn đang chờ duyệt
    NgayDangKi: "2024-04-25T10:30:00.000Z",
    NgaySua: "2024-04-25T10:30:00.000Z",
    ChieuCao: 170,
    CanNang: 65,
    NhietDo: 0,
    NhipTim: 0,
    HuyetAp: "",
    DaTungHienMau: true,
    TienSuBenh: "Không có",
    MacBenhHienTai: "Không có",
    ThongTin12ThangQua: "Không có phẫu thuật hoặc tiêm máu",
    ThongTin6ThangQua: "Không có xăm mình hoặc châm cứu",
    ThongTin1ThangQua: "Không có sốt hoặc dùng kháng sinh",
    ThongTin14NgayQua: "Không có tiếp xúc với người bệnh truyền nhiễm",
    Thuoc7Ngay: "Không dùng thuốc",
    ThongTinPhuNu12ThangQua: "",
    TTSKKhamSangLoc: TrangThaiSucKhoe.CHUA_DANH_GIA,
    TTSKSauHien: "",
    GhiChu: "Đơn đăng ký mới"
  },
  
  // 3. TRƯỜNG HỢP ĐÃ DUYỆT ĐANG CHỜ HIẾN MÁU (SK002)
  {
    MaDKiHienMau: "DK005",
    IdNguoiHienMau: "ND001",
    IdNVDuyet: "ND003",
    IdBacSi: "",
    IdSuKienHienMau: "SK002", // Sự kiện đang diễn ra
    IdDanhMucDVHienMau: "DM001",
    TrangThaiHienMau: TrangThaiHienMau.CHO_HIEN, // Chưa hiến máu
    TrangThaiDonDK: TrangThaiDangKy.DA_DUYET, // Đơn đã được duyệt
    NgayDangKi: "2024-04-27T14:30:00.000Z",
    NgaySua: "2024-04-28T11:30:00.000Z",
    ChieuCao: 170,
    CanNang: 65,
    NhietDo: 0,
    NhipTim: 0,
    HuyetAp: "",
    DaTungHienMau: true,
    TienSuBenh: "Không có",
    MacBenhHienTai: "Không có",
    ThongTin12ThangQua: "Không có phẫu thuật hoặc tiêm máu",
    ThongTin6ThangQua: "Không có xăm mình hoặc châm cứu",
    ThongTin1ThangQua: "Không có sốt hoặc dùng kháng sinh",
    ThongTin14NgayQua: "Không có tiếp xúc với người bệnh truyền nhiễm",
    Thuoc7Ngay: "Không dùng thuốc",
    ThongTinPhuNu12ThangQua: "",
    TTSKKhamSangLoc: TrangThaiSucKhoe.CHUA_DANH_GIA,
    TTSKSauHien: "",
    GhiChu: "Đã duyệt đơn, đang đợi ngày hiến máu"
  },
  
  // 4. TRƯỜNG HỢP TỪ CHỐI ĐƠN ĐĂNG KÝ (SK003)
  {
    MaDKiHienMau: "DK006",
    IdNguoiHienMau: "ND002",
    IdNVDuyet: "ND003",
    IdBacSi: "",
    IdSuKienHienMau: "SK003",
    IdDanhMucDVHienMau: "DM002",
    TrangThaiHienMau: TrangThaiHienMau.CHO_HIEN, // Vẫn ở trạng thái chờ hiến
    TrangThaiDonDK: TrangThaiDangKy.TU_CHOI, // Đơn bị từ chối
    NgayDangKi: "2024-04-28T10:15:00.000Z",
    NgaySua: "2024-04-29T09:45:00.000Z",
    ChieuCao: 165,
    CanNang: 55,
    NhietDo: 0,
    NhipTim: 0,
    HuyetAp: "",
    DaTungHienMau: false,
    TienSuBenh: "Không có",
    MacBenhHienTai: "Tiền sử bệnh thiếu máu",
    ThongTin12ThangQua: "Không có phẫu thuật hoặc tiêm máu",
    ThongTin6ThangQua: "Không có xăm mình hoặc châm cứu",
    ThongTin1ThangQua: "Có sốt và dùng kháng sinh",
    ThongTin14NgayQua: "Không có tiếp xúc với người bệnh truyền nhiễm",
    Thuoc7Ngay: "Có dùng thuốc kháng sinh",
    ThongTinPhuNu12ThangQua: "Không có thai, không cho con bú",
    TTSKKhamSangLoc: TrangThaiSucKhoe.KHONG_DU_DIEU_KIEN,
    TTSKSauHien: "",
    GhiChu: "Từ chối do đang sử dụng thuốc kháng sinh"
  },
  
  // 5. TRƯỜNG HỢP ĐƠN ĐÃ DUYỆT NHƯNG KHÔNG ĐỦ ĐIỀU KIỆN HIẾN MÁU (SK002)
  {
    MaDKiHienMau: "DK010",
    IdNguoiHienMau: "ND002",
    IdNVDuyet: "ND003",
    IdBacSi: "ND004",
    IdSuKienHienMau: "SK002",
    IdDanhMucDVHienMau: "DM002",
    TrangThaiHienMau: TrangThaiHienMau.TU_CHOI, // Không đủ điều kiện hiến máu
    TrangThaiDonDK: TrangThaiDangKy.DA_DUYET, // Đơn đã được duyệt
    NgayDangKi: "2024-03-22T08:15:00.000Z",
    NgaySua: "2024-03-25T14:10:00.000Z",
    ChieuCao: 165,
    CanNang: 55,
    NhietDo: 37.2,
    NhipTim: 76,
    HuyetAp: "130/85",
    DaTungHienMau: true,
    TienSuBenh: "Không có",
    MacBenhHienTai: "Không có",
    ThongTin12ThangQua: "Không có phẫu thuật hoặc tiêm máu",
    ThongTin6ThangQua: "Không có xăm mình hoặc châm cứu",
    ThongTin1ThangQua: "Có sốt nhẹ",
    ThongTin14NgayQua: "Không có tiếp xúc với người bệnh truyền nhiễm",
    Thuoc7Ngay: "Đang dùng thuốc cảm",
    ThongTinPhuNu12ThangQua: "Không có thai, không cho con bú",
    TTSKKhamSangLoc: TrangThaiSucKhoe.KHONG_DU_DIEU_KIEN,
    TTSKSauHien: "",
    GhiChu: "Không đủ điều kiện sức khỏe vào ngày hiến máu"
  }
];

// Mock data for PHANHOI (Feedback)
export const mockPhanHoi: PHANHOI[] = [
  {
    MaPhanHoi: "PH001",
    MaDKiKienMau: "DK001",
    TinhTrangMoTa: "Sau khi hiến máu cảm thấy hơi chóng mặt trong khoảng 1 giờ, sau đó trở lại bình thường.",
    NgayPhanHoi: "2024-04-21T14:30:00.000Z"
  },
  {
    MaPhanHoi: "PH002",
    MaDKiKienMau: "DK002",
    TinhTrangMoTa: "Vết kim tiêm hơi bầm, gây đau nhẹ trong 2 ngày.",
    NgayPhanHoi: "2024-04-22T16:45:00.000Z"
  }
];

// Mock data for GIAYCHUNGNHAN (Blood Donation Certificates)
export const mockGiayChungNhan: GIAYCHUNGNHAN[] = [
  {
    IdGiayChungNhan: "GCN001",
    MaNguoiDung: "ND001",
    IdSuKienHienMau: "SK006",
    NgayCap: "2024-02-03T00:00:00.000Z"
  },
  {
    IdGiayChungNhan: "GCN002",
    MaNguoiDung: "ND002",
    IdSuKienHienMau: "SK006",
    NgayCap: "2024-02-03T00:00:00.000Z"
  }
]; 