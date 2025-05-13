import { VAITRO, NGUOIDUNG, NHOMMAU } from '../types';

// Mock data for VAITRO (User Roles)
export const mockVaiTro: VAITRO[] = [
  {
    MaVaiTro: "ROLE_DONOR",
    TenVaiTro: "donor",
    MoTa: "Người hiến máu"
  },
  {
    MaVaiTro: "ROLE_MEDICAL",
    TenVaiTro: "medical_staff",
    MoTa: "Nhân viên y tế"
  },
  {
    MaVaiTro: "ROLE_DOCTOR",
    TenVaiTro: "doctor",
    MoTa: "Bác sĩ"
  },
  {
    MaVaiTro: "ROLE_VOLUNTEER",
    TenVaiTro: "volunteer_center_manager",
    MoTa: "Trưởng cơ sở tình nguyện"
  },
  {
    MaVaiTro: "ROLE_DIRECTOR",
    TenVaiTro: "blood_bank_director",
    MoTa: "Giám đốc ngân hàng máu"
  },
  {
    MaVaiTro: "ROLE_ADMIN",
    TenVaiTro: "admin",
    MoTa: "Admin hệ thống"
  }
];

// Mock data for NHOMMAU (Blood Types)
export const mockNhomMau: NHOMMAU[] = [
  {
    MaNhomMau: "A_POS",
    MoTaNhomMau: "A+",
    DoPhoBien: 29.5,
    GhiChu: "Nhóm máu A dương tính",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  },
  {
    MaNhomMau: "A_NEG",
    MoTaNhomMau: "A-",
    DoPhoBien: 6.3,
    GhiChu: "Nhóm máu A âm tính",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  },
  {
    MaNhomMau: "B_POS",
    MoTaNhomMau: "B+",
    DoPhoBien: 20.4,
    GhiChu: "Nhóm máu B dương tính",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  },
  {
    MaNhomMau: "B_NEG",
    MoTaNhomMau: "B-",
    DoPhoBien: 1.7,
    GhiChu: "Nhóm máu B âm tính",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  },
  {
    MaNhomMau: "O_POS",
    MoTaNhomMau: "O+",
    DoPhoBien: 38.5,
    GhiChu: "Nhóm máu O dương tính - người cho máu phổ biến",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  },
  {
    MaNhomMau: "O_NEG",
    MoTaNhomMau: "O-",
    DoPhoBien: 7.2,
    GhiChu: "Nhóm máu O âm tính - người cho máu đa năng",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  },
  {
    MaNhomMau: "AB_POS",
    MoTaNhomMau: "AB+",
    DoPhoBien: 4.2,
    GhiChu: "Nhóm máu AB dương tính - người nhận máu đa năng",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  },
  {
    MaNhomMau: "AB_NEG",
    MoTaNhomMau: "AB-",
    DoPhoBien: 0.8,
    GhiChu: "Nhóm máu AB âm tính - nhóm máu hiếm gặp nhất",
    NgayTao: "2024-01-01T00:00:00.000Z",
    NgaySua: "2024-01-01T00:00:00.000Z"
  }
];

// Mock data for NGUOIDUNG (Users)
export const mockNguoiDung: NGUOIDUNG[] = [
  {
    MaNguoiDung: "ND001",
    MaVaiTro: "ROLE_DONOR",
    HoTen: "Nguyễn Văn A",
    NgaySinh: "1990-05-15",
    Email: "nguyenvana@example.com",
    SDT: "0901234567",
    MatKhau: "hashed_password_1",
    GioiTinh: true,
    CCCD: "079090123456",
    MaNhomMau: "A_POS",
    AnhDaiDien: "https://example.com/avatars/user1.jpg",
    tenDiaChi: "123 Đường Nguyễn Huệ",
    IdPhuong: "P01",
    TinhTrangTK: true,
    NgayTao: "2023-01-10T08:00:00.000Z"
  },
  {
    MaNguoiDung: "ND002",
    MaVaiTro: "ROLE_DONOR",
    HoTen: "Trần Thị B",
    NgaySinh: "1995-08-20",
    Email: "tranthib@example.com",
    SDT: "0912345678",
    MatKhau: "hashed_password_2",
    GioiTinh: false,
    CCCD: "079095654321",
    MaNhomMau: "O_POS",
    AnhDaiDien: "https://example.com/avatars/user2.jpg",
    tenDiaChi: "456 Đường Lê Lợi",
    IdPhuong: "P02",
    TinhTrangTK: true,
    NgayTao: "2023-02-15T09:30:00.000Z"
  },
  {
    MaNguoiDung: "ND003",
    MaVaiTro: "ROLE_MEDICAL",
    HoTen: "Lê Văn C",
    NgaySinh: "1988-03-25",
    Email: "levanc@example.com",
    SDT: "0923456789",
    MatKhau: "hashed_password_3",
    GioiTinh: true,
    CCCD: "079088123456",
    MaNhomMau: "B_POS",
    AnhDaiDien: "https://example.com/avatars/user3.jpg",
    tenDiaChi: "789 Đường Trần Hưng Đạo",
    IdPhuong: "P03",
    TinhTrangTK: true,
    NgayTao: "2023-03-01T10:45:00.000Z"
  },
  {
    MaNguoiDung: "ND004",
    MaVaiTro: "ROLE_DOCTOR",
    HoTen: "Phạm Văn D",
    NgaySinh: "1982-07-12",
    Email: "phamvand@example.com",
    SDT: "0934567890",
    MatKhau: "hashed_password_4",
    GioiTinh: true,
    CCCD: "079082654321",
    MaNhomMau: "AB_POS",
    AnhDaiDien: "https://example.com/avatars/user4.jpg",
    tenDiaChi: "101 Đường Nguyễn Du",
    IdPhuong: "P04",
    TinhTrangTK: true,
    NgayTao: "2023-04-05T14:20:00.000Z"
  },
  {
    MaNguoiDung: "ND005",
    MaVaiTro: "ROLE_VOLUNTEER",
    HoTen: "Hoàng Thị E",
    NgaySinh: "1992-11-30",
    Email: "hoangthie@example.com",
    SDT: "0945678901",
    MatKhau: "hashed_password_5",
    GioiTinh: false,
    CCCD: "079092123456",
    MaNhomMau: "O_NEG",
    AnhDaiDien: "https://example.com/avatars/user5.jpg",
    tenDiaChi: "202 Đường Lê Duẩn",
    IdPhuong: "P05",
    TinhTrangTK: true,
    NgayTao: "2023-05-20T11:15:00.000Z"
  },
  {
    MaNguoiDung: "ND006",
    MaVaiTro: "ROLE_DIRECTOR",
    HoTen: "Vũ Văn F",
    NgaySinh: "1985-04-18",
    Email: "vuvanf@example.com",
    SDT: "0956789012",
    MatKhau: "hashed_password_6",
    GioiTinh: true,
    CCCD: "079085654321",
    MaNhomMau: "A_NEG",
    AnhDaiDien: "https://example.com/avatars/user6.jpg",
    tenDiaChi: "303 Đường Trần Phú",
    IdPhuong: "P06",
    TinhTrangTK: true,
    NgayTao: "2023-06-10T16:40:00.000Z"
  },
  {
    MaNguoiDung: "ND007",
    MaVaiTro: "ROLE_ADMIN",
    HoTen: "Ngô Thị G",
    NgaySinh: "1980-09-05",
    Email: "ngothig@example.com",
    SDT: "0967890123",
    MatKhau: "hashed_password_7",
    GioiTinh: false,
    CCCD: "079080123456",
    MaNhomMau: "B_NEG",
    AnhDaiDien: "https://example.com/avatars/user7.jpg",
    tenDiaChi: "404 Đường Nguyễn Trãi",
    IdPhuong: "P01",
    TinhTrangTK: true,
    NgayTao: "2023-07-15T08:30:00.000Z"
  }
]; 