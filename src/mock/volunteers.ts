import { COSOTINHNGUYEN } from '../types';

// Mock data for COSOTINHNGUYEN (Volunteer Centers)
export const mockCoSoTinhNguyen: COSOTINHNGUYEN[] = [
  {
    IDCoSoTinhNguyen: "CS001",
    TenCoSoTinhNguyen: "Trung tâm Hiến máu Quận 1",
    DiaChi: "123 Nguyễn Huệ, Quận 1",
    SDT: "0283123456",
    Email: "hienmauq1@example.com",
    IdPhuong: "P01",
    NguoiPhuTrach: "Nguyễn Văn Quản Lý",
    MinhChung: "https://example.com/evidence/cs001.jpg",
    UserName: "hienmau_q1",
    MatKhau: "hashed_password_cs1",
    TinhTrang: true,
    NgayTao: "2023-01-05T08:00:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER"
  },
  {
    IDCoSoTinhNguyen: "CS002",
    TenCoSoTinhNguyen: "Trung tâm Hiến máu Quận 2",
    DiaChi: "456 Thảo Điền, Quận 2",
    SDT: "0283234567",
    Email: "hienmauq2@example.com",
    IdPhuong: "P03",
    NguoiPhuTrach: "Trần Thị Điều Hành",
    MinhChung: "https://example.com/evidence/cs002.jpg",
    UserName: "hienmau_q2",
    MatKhau: "hashed_password_cs2",
    TinhTrang: true,
    NgayTao: "2023-02-10T09:30:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER"
  },
  {
    IDCoSoTinhNguyen: "CS003",
    TenCoSoTinhNguyen: "Trung tâm Hiến máu Ba Đình",
    DiaChi: "789 Trúc Bạch, Ba Đình",
    SDT: "0243456789",
    Email: "hienmaubd@example.com",
    IdPhuong: "P04",
    NguoiPhuTrach: "Lê Văn Tổ Chức",
    MinhChung: "https://example.com/evidence/cs003.jpg",
    UserName: "hienmau_bd",
    MatKhau: "hashed_password_cs3",
    TinhTrang: true,
    NgayTao: "2023-03-15T10:45:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER"
  },
  {
    IDCoSoTinhNguyen: "CS004",
    TenCoSoTinhNguyen: "Trung tâm Hiến máu Hải Châu",
    DiaChi: "101 Thanh Bình, Hải Châu",
    SDT: "0236789012",
    Email: "hiemmauhc@example.com",
    IdPhuong: "P05",
    NguoiPhuTrach: "Phạm Thị Quản Trị",
    MinhChung: "https://example.com/evidence/cs004.jpg",
    UserName: "hienmau_hc",
    MatKhau: "hashed_password_cs4",
    TinhTrang: true,
    NgayTao: "2023-04-20T14:20:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER"
  },
  {
    IDCoSoTinhNguyen: "CS005",
    TenCoSoTinhNguyen: "Trung tâm Hiến máu Ninh Kiều",
    DiaChi: "202 Tân An, Ninh Kiều",
    SDT: "0292345678",
    Email: "hienmauninhkieu@example.com",
    IdPhuong: "P06",
    NguoiPhuTrach: "Hoàng Văn Điều Phối",
    MinhChung: "https://example.com/evidence/cs005.jpg",
    UserName: "hienmau_nk",
    MatKhau: "hashed_password_cs5",
    TinhTrang: true,
    NgayTao: "2023-05-25T11:15:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER"
  }
];

// Mock data cho các cơ sở tình nguyện đang chờ duyệt
export const mockCoSoTinhNguyenPending: COSOTINHNGUYEN[] = [
  {
    IDCoSoTinhNguyen: "CS006",
    TenCoSoTinhNguyen: "Trung tâm Tình nguyện Quận 7",
    DiaChi: "55 Nguyễn Lương Bằng, Quận 7",
    SDT: "0283776543",
    Email: "tinhnguyen_q7@example.com",
    IdPhuong: "P07",
    NguoiPhuTrach: "Trần Minh Đức",
    MinhChung: "https://example.com/evidence/cs006.jpg",
    UserName: "tinhnguyen_q7",
    MatKhau: "hashed_password_cs6",
    TinhTrang: false,
    NgayTao: "2023-07-15T09:45:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER"
  },
  {
    IDCoSoTinhNguyen: "CS007",
    TenCoSoTinhNguyen: "Trung tâm Hiến máu Tân Bình",
    DiaChi: "122 Cộng Hòa, Tân Bình",
    SDT: "0283657890",
    Email: "hienmau_tb@example.com",
    IdPhuong: "P08",
    NguoiPhuTrach: "Nguyễn Thị Hồng",
    MinhChung: "https://example.com/evidence/cs007.jpg",
    UserName: "hienmau_tb",
    MatKhau: "hashed_password_cs7",
    TinhTrang: false,
    NgayTao: "2023-08-22T14:30:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER" 
  },
  {
    IDCoSoTinhNguyen: "CS008",
    TenCoSoTinhNguyen: "Trung tâm Tình nguyện Đại học Y Dược",
    DiaChi: "217 Hồng Bàng, Quận 5",
    SDT: "0283833456",
    Email: "tnv_dhyd@example.com",
    IdPhuong: "P09",
    NguoiPhuTrach: "Lê Quang Minh",
    MinhChung: "https://example.com/evidence/cs008.jpg",
    UserName: "tnv_dhyd",
    MatKhau: "hashed_password_cs8",
    TinhTrang: false,
    NgayTao: "2023-09-10T08:15:00.000Z",
    MaVaiTro: "ROLE_VOLUNTEER"
  }
]; 