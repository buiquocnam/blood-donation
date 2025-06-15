# KẾ HOẠCH PHÁT TRIỂN BACKEND - HỆ THỐNG QUẢN LÝ HIẾN MÁU

## 1. Tổng quan hệ thống

Hệ thống quản lý hiến máu là nền tảng toàn diện giúp quản lý cơ sở dữ liệu người hiến máu, cơ sở tình nguyện, sự kiện hiến máu và các hoạt động liên quan. Hệ thống được thiết kế để phục vụ nhiều đối tượng người dùng khác nhau từ người hiến máu đến nhân viên y tế, bác sĩ và cán bộ quản lý.

## 2. Công nghệ sử dụng

### Backend Framework và Ngôn ngữ
- **Node.js 20+**: Nền tảng runtime cho backend
- **Express.js**: Framework chính cho RESTful API
- **Sequelize**: ORM h tương tác với CSDL
- **JWT**: Xác thực và phân quyền
- **JS**

### Cơ sở dữ liệu
- **SQL Server**: CSDL quan hệ chính
- **Redis**: Cache và quản lý phiên người dùng

## 3. Kiến trúc hệ thống

### Kiến trúc tổng quan
- **Modular Monolith**: Ứng dụng đơn khối nhưng tổ chức theo module
- **RESTful API**: Giao tiếp chuẩn REST với frontend
- **Stateless Authentication**: Xác thực không lưu trạng thái với JWT

### Cấu trúc project
```
src/
├── config/                  # Cấu hình ứng dụng
├── api/                     # API endpoints
│   ├── auth/                # Authentication routes
│   ├── users/               # User management routes
│   ├── donations/           # Blood donation routes
│   ├── events/              # Event management routes
│   ├── centers/             # Volunteer center routes
│   └── ...
├── services/                # Business logic
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── donation.service.ts
│   └── ...
├── models/                  # Prisma schema & models
├── middlewares/             # Express middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── ...
├── utils/                   # Utility functions
├── types/                   # TypeScript type definitions
└── server.ts                # Entry point
```

## 4. Mô hình dữ liệu

### Các entity chính
- **NGUOIDUNG**: Quản lý thông tin tất cả người dùng
- **VAITRO**: Định nghĩa vai trò và quyền trong hệ thống
- **DANGKIHIENMAU**: Quản lý đăng ký hiến máu
- **THONGBAODKTOCHUC**: Thông báo và sự kiện từ ngân hàng máu
- **COSOTINHNGUYEN**: Quản lý các cơ sở tình nguyện
- **DANGKITOCHUCHIENMAU**: Đăng ký tổ chức sự kiện hiến máu
- **DANHMUCDVMAU**: Danh mục dịch vụ hiến máu
- **GIAYCHUNGNHAN**: Quản lý giấy chứng nhận hiến máu
- **NHOMMAU**: Quản lý thông tin nhóm máu
- **PHANHOI**: Phản hồi của người dùng về quá trình hiến máu

### SQL Schema (SQL Server)
```sql
CREATE TABLE THANHPHO (
    IdThanhPho NVARCHAR(50) NOT NULL,       -- IDTHANHPHO
    TenThanhPho NVARCHAR(100) NOT NULL,     -- TENTHANHPHO
    PRIMARY KEY (IdThanhPho)
);

-- Table QUAN
CREATE TABLE QUAN (
    IdQuan NVARCHAR(50) NOT NULL,           -- IDQUAN
    IdThanhPho NVARCHAR(50) NOT NULL,       -- IDTHANHPHO
    TenQuan NVARCHAR(100) NOT NULL,         -- TENQUAN
    PRIMARY KEY (IdQuan),
    FOREIGN KEY (IdThanhPho) REFERENCES THANHPHO(IdThanhPho)
);

-- Table PHUONG
CREATE TABLE PHUONG (
    IdPhuong NVARCHAR(50) NOT NULL,         -- IDPHUONG
    IdQuan NVARCHAR(50) NOT NULL,           -- IDQUAN
    TenPhuong NVARCHAR(100) NOT NULL,       -- TENPHUONG
    PRIMARY KEY (IdPhuong),
    FOREIGN KEY (IdQuan) REFERENCES QUAN(IdQuan)
);

CREATE TABLE NHOMMAU (
    MaNhomMau NVARCHAR(50) NOT NULL,        -- MANHOMMAU
    MoTaNhomMau NVARCHAR(255) NULL,         -- MOTANHOMMAU
    DoPhoBien DECIMAL(5,2) NULL,            -- DOPHOBIEN
    GhiChu NVARCHAR(500) NULL,              -- GHICHU
    NgayTao DATETIME2 DEFAULT GETDATE(),    -- NGAYTAO
    NgaySua DATETIME2 NULL,                 -- NGAYSUA
    PRIMARY KEY (MaNhomMau)
);

-- Table VAITRO (Vai trò)
CREATE TABLE VAITRO (
    MaVaiTro NVARCHAR(50) NOT NULL,         -- MAVAITRO
    TenVaiTro NVARCHAR(50) NOT NULL,        -- TENVAITRO
    MoTa NVARCHAR(255) NULL,                -- MOTA
    PRIMARY KEY (MaVaiTro)
);

-- Table NGUOIDUNG (Người dùng)
CREATE TABLE NGUOIDUNG (
    MaNguoiDung NVARCHAR(50) NOT NULL,            -- MANGUOIDUNG
    MaVaiTro NVARCHAR(50) NOT NULL,               -- MAVAITRO
    IdPhuong NVARCHAR(50) NULL,                   -- IDPHUONG
    MaNhomMau NVARCHAR(50) NULL,                  -- MANHOMMAU
    HoTen NVARCHAR(100) NOT NULL,                 -- HOTEN
    NgaySinh DATE NOT NULL,                       -- NGAYSINH
    Email NVARCHAR(100) NOT NULL,                 -- EMAIL
    SDT NVARCHAR(15) NULL,                        -- SDT
    MatKhau NVARCHAR(256) NOT NULL,               -- PASSWORD
    GioiTinh BIT NULL,                            -- GIOITINH (0: Nữ, 1: Nam)
    tenDiaChi NVARCHAR(200) NULL,                 -- TENDUONG
    CCCD NVARCHAR(12) NULL,                       -- CCCD
    AnhDaiDien NVARCHAR(255) NULL,                -- ANHDAIDIEN
    TinhTrangTK BIT NULL,                         -- TINHTRANG (0: Không hoạt động, 1: Hoạt động)
    NgayTao DATETIME2 DEFAULT GETDATE(),          -- NGAYTAO
    NgayKhoa DATETIME2 DEFAULT GETDATE(),         -- NGAYKHOA
    PRIMARY KEY (MaNguoiDung),
    FOREIGN KEY (MaVaiTro) REFERENCES VAITRO(MaVaiTro),
    FOREIGN KEY (IdPhuong) REFERENCES PHUONG(IdPhuong),
    FOREIGN KEY (MaNhomMau) REFERENCES NHOMMAU(MaNhomMau)
);


-- Table COSOTINHNGUYEN
CREATE TABLE COSOTINHNGUYEN (
    IDCoSoTinhNguyen NVARCHAR(50) NOT NULL,        -- IDCOSOTINHNGUYEN
    TenCoSoTinhNguyen NVARCHAR(100) NOT NULL,      -- TENCOSOTINHNGUYEN
    MaVaiTro NVARCHAR(50) NOT NULL,                -- MAVAITRO
    SDT NVARCHAR(15) NULL,                         -- SDT
    Email NVARCHAR(100) NULL,                      -- EMAIL
    NguoiPhuTrach NVARCHAR(100) NULL,              -- NGUOIPHUTRACH
    IdPhuong NVARCHAR(50) NULL,                    -- IDPHUONG
    DiaChi NVARCHAR(255) NULL,                     -- DIACHI
    UserName NVARCHAR(50) NULL,                    -- USERNAME
    MinhChung NVARCHAR(255) NULL,                  -- MINHCHUNG
    MatKhau NVARCHAR(256) NOT NULL,                -- PASSWORD
    TinhTrang NVARCHAR(50) NULL,                            -- TINHTRANG 
    NgayTao DATETIME2 DEFAULT GETDATE(),           -- NGAYTAO
    PRIMARY KEY (IDCoSoTinhNguyen),
    FOREIGN KEY (IdPhuong) REFERENCES PHUONG(IdPhuong),
    FOREIGN KEY (MaVaiTro) REFERENCES VAITRO(MaVaiTro)
);


-- Table THONGBAODKTOCHUC
CREATE TABLE THONGBAODKTOCHUC (
    IdThongBaoDK NVARCHAR(50) NOT NULL,             -- IDTHONGBAODK
    IDNguoiTao NVARCHAR(50) NOT NULL,               -- IDNGUOITAO
    TieuDe NVARCHAR(255) NOT NULL,                  -- TIEUDE
    NoiDung NVARCHAR(1000) NULL,                    -- NOIDUNG
    SoLuongMauHien INT NULL,                        -- SOLUONGHIEN
    HanDangKi DATE NULL,                            -- HANDANGKI
    TgBatDauDK DATETIME2 NULL,                      -- TGBATDAUDK
    TgKetThucDK DATETIME2 NULL,                     -- TGKETTHUCDK
    HanDK DATE NULL,                                -- HANDK
    NgayDang DATETIME2 DEFAULT GETDATE(),           -- NGAYDANG
    NgaySua DATETIME2 NULL,                         -- NGAYSUA
    TgBatDauSK DATETIME2 NULL,                      -- TGBATDAUSK
    TgKetThucSK DATETIME2 NULL,                     -- TGKETTHUCSK
    PRIMARY KEY (IdThongBaoDK),
    FOREIGN KEY (IDNguoiTao) REFERENCES NGUOIDUNG(MANGUOIDUNG)
);

-- Table DANGKITOCHUCHIENMAU
CREATE TABLE DANGKITOCHUCHIENMAU (
    IdSuKien NVARCHAR(50) NOT NULL,                  -- IDSUKIEN
    IdThongBaoDK NVARCHAR(50) NOT NULL,              -- IDTHONGBAODK
    IDCoSoTinhNguyen NVARCHAR(50) NOT NULL,          -- IDCOSOTINHNGUYEN
    NgayDangKi DATETIME2 DEFAULT GETDATE(),          -- NGAYDANGKI
    TinhTrangDK NVARCHAR(50) NULL,                   -- TINHTRANGDK
    SoLuongDK INT NULL,                              -- SOLUONGDK
    SoLuongDDK INT NULL,                             -- SOLUONGDDK
    TrangThaiSuKien NVARCHAR(50) NULL,               -- TRANGTHAISUKIEN
    NgayDang DATETIME2 NULL,                         -- NGAYDANG
    NgaySua DATETIME2 NULL,                          -- NGAYSUA
    HanDK DATE NULL,                                 -- HANDK
    PRIMARY KEY (IdSuKien),
    FOREIGN KEY (IdThongBaoDK) REFERENCES THONGBAODKTOCHUC(IdThongBaoDK),
    FOREIGN KEY (IDCoSoTinhNguyen) REFERENCES COSOTINHNGUYEN(IDCoSoTinhNguyen)
);


-- Table DANHMUCDVMAU
CREATE TABLE DANHMUCDVMAU (
    IdDanhMucDVHienMau NVARCHAR(50) NOT NULL, -- IDDANHMUCDVHIENMAU in DB
    SoLuongMau DECIMAL(10,2) NULL,            -- SOLUONGMAU in DB (DECIMAL)
    GhiChu NVARCHAR(500) NULL,                -- GHICHU in DB
    PRIMARY KEY (IdDanhMucDVHienMau)
);

-- Table DANGKIHIENMAU
CREATE TABLE DANGKIHIENMAU (
    MaDKiHienMau NVARCHAR(50) NOT NULL,            -- MADKIHIENMAU in DB
    IdNguoiHienMau NVARCHAR(50) NOT NULL,          -- IDNGUOIHIENMAU in DB
    IdNVDuyet NVARCHAR(50) NULL,                   -- IDNVDUYET in DB
    IdBacSi NVARCHAR(50) NULL,                     -- IDBACSI in DB
    IdSuKienHienMau NVARCHAR(50) NOT NULL,         -- IDSUKIEN in DB (reference to DANGKITOCHUCHIENMAU)
    IdDanhMucDVHienMau NVARCHAR(50) NULL,          -- IDDANHMUCDVHIENMAU in DB
    TrangThaiHienMau NVARCHAR(50) NULL,            -- TRANGTHAIHIENMAU in DB
    TrangThaiDonDK NVARCHAR(50) NULL,              -- TRANGTHAIDONDK in DB
    NgayDangKi DATETIME2 NOT NULL,                 -- NGAYDANGKI in DB
    NgaySua DATETIME2 NULL,                        -- NGAYSUA in DB
    ChieuCao DECIMAL(5,2) NULL,                    -- CHIEUCAO in DB (DECIMAL)
    CanNang DECIMAL(5,2) NULL,                     -- CANNANG in DB (DECIMAL)
    NhietDo DECIMAL(4,1) NULL,                     -- NHIETDO in DB (DECIMAL)
    NhipTim INT NULL,                              -- NHIPTIM in DB (INT)
    HuyetAp NVARCHAR(50) NULL,                     -- HUYETAP in DB
    DaTungHienMau BIT NULL,                        -- DATUNGHIENMAU in DB (BIT)
    TienSuBenh NVARCHAR(500) NULL,                 -- TIENSUBENH in DB
    MacBenhHienTai NVARCHAR(500) NULL,             -- MACBENHHIENTAI in DB
    ThongTin12ThangQua NVARCHAR(500) NULL,         -- THONGTIN12THANGQUA in DB
    ThongTin6ThangQua NVARCHAR(500) NULL,          -- THONGTIN6THANGQUA in DB
    ThongTin1ThangQua NVARCHAR(500) NULL,          -- THONGTIN1THANGQUA in DB
    ThongTin14NgayQua NVARCHAR(500) NULL,          -- THONGTIN14NGAYQUA in DB
    Thuoc7Ngay NVARCHAR(500) NULL,                 -- THUOC7NGAY in DB
    ThongTinPhuNu12ThangQua NVARCHAR(500) NULL,    -- THONGTINPHUNU12THANGQUA in DB
    TTSKKhamSangLoc NVARCHAR(500) NULL,            -- TTSKKHAMSANGLOC in DB
    TTSKSauHien NVARCHAR(500) NULL,                -- TTSKSAUHIEN in DB
    GhiChu NVARCHAR(1000) NULL,                    -- GHICHU in DB
    PRIMARY KEY (MaDKiHienMau),
    FOREIGN KEY (IdNguoiHienMau) REFERENCES NGUOIDUNG(MANGUOIDUNG),
    FOREIGN KEY (IdNVDuyet) REFERENCES NGUOIDUNG(MANGUOIDUNG),
    FOREIGN KEY (IdBacSi) REFERENCES NGUOIDUNG(MANGUOIDUNG),
    FOREIGN KEY (IdSuKienHienMau) REFERENCES DANGKITOCHUCHIENMAU(IDSUKIEN),
    FOREIGN KEY (IdDanhMucDVHienMau) REFERENCES DANHMUCDVMAU(IDDANHMUCDVHIENMAU),
    CONSTRAINT CHK_CHIEUCAO CHECK (ChieuCao > 0 AND ChieuCao <= 300),
    CONSTRAINT CHK_CANNANG CHECK (CanNang > 0 AND CanNang <= 500),
    CONSTRAINT CHK_NHIETDO CHECK (NhietDo >= 30 AND NhietDo <= 45),
    CONSTRAINT CHK_NHIPTIM CHECK (NhipTim >= 30 AND NhipTim <= 200)
);


-- Table GIAYCHUNGNHAN
CREATE TABLE GIAYCHUNGNHAN (
    IdGiayChungNhan NVARCHAR(50) NOT NULL,         -- IDGIAYCHUNGNHAN in DB
    MaNguoiDung NVARCHAR(50) NOT NULL,             -- MANGUOIDUNG in DB
    IdSuKienHienMau NVARCHAR(50) NOT NULL,         -- IDSUKIEN in DB (reference to DANGKITOCHUCHIENMAU)
    NgayCap DATE NOT NULL,                         -- NGAYCAP in DB (DATE)
    PRIMARY KEY (IdGiayChungNhan),
    FOREIGN KEY (MaNguoiDung) REFERENCES NGUOIDUNG(MANGUOIDUNG),
    FOREIGN KEY (IdSuKienHienMau) REFERENCES DANGKITOCHUCHIENMAU(IDSUKIEN)
);

-- Table PHANHOI
CREATE TABLE PHANHOI (
    MaPhanHoi NVARCHAR(50) NOT NULL,              -- MAPHANHOI in DB
    MaDKiHienMau NVARCHAR(50) NOT NULL,            -- MADKIHIENMAU in DB
    TinhTrangMoTa NVARCHAR(500) NULL,              -- TINHTRANGMOTA in DB
    NgayPhanHoi DATETIME2 DEFAULT GETDATE(),      -- NGAYPHANHOI in DB (DATETIME)
    PRIMARY KEY (MaPhanHoi),
    FOREIGN KEY (MaDKiHienMau) REFERENCES DANGKIHIENMAU(MADKIHIENMAU)
);

```

## 5. Phân quyền và vai trò

### Vai trò chính
1. **ROLE_GUEST**: Khách vãng lai, truy cập thông tin công khai
2. **ROLE_DONOR**: Người hiến máu
3. **ROLE_MEDICAL_STAFF**: Nhân viên y tế
4. **ROLE_DOCTOR**: Bác sĩ
5. **ROLE_VOLUNTEER_MANAGER**: Trưởng cơ sở tình nguyện
6. **ROLE_BLOOD_DIRECTOR**: Giám đốc ngân hàng máu
7. **ROLE_ADMIN**: Quản trị viên hệ thống

### Phân quyền API
- Middleware xác thực và kiểm tra quyền truy cập
- JWT với thông tin vai trò được mã hóa
- Phân tách API theo module và vai trò

## 6. Kế hoạch triển khai

### Giai đoạn 1: Thiết lập cơ sở
- Khởi tạo project Node.js với Express và TypeScript
- Cấu hình SQL Server và kết nối với Prisma
- Thiết lập hệ thống xác thực JWT

### Giai đoạn 2: Xây dựng API core
- API quản lý người dùng (đăng ký, đăng nhập, quản lý profile)
- API quản lý sự kiện hiến máu
- API đăng ký hiến máu
- API quản lý cơ sở tình nguyện

### Giai đoạn 3: Phát triển tính năng nâng cao
- API thống kê và báo cáo
- Hệ thống gửi thông báo (email, SMS với Nodemailer/Twilio)
- API xuất giấy chứng nhận
- API quản lý phản hồi

### Giai đoạn 4: Hoàn thiện và tối ưu
- Tối ưu hiệu suất và bảo mật
- Tài liệu API với Swagger
- Triển khai CI/CD

## 7. API Endpoints

### Auth APIs
- `POST /api/auth/register`: Đăng ký tài khoản
- `POST /api/auth/login`: Đăng nhập
- `POST /api/auth/refresh`: Làm mới token
- `POST /api/auth/logout`: Đăng xuất

### User APIs
- `GET /api/users`: Lấy danh sách người dùng (Admin)
- `GET /api/users/:id`: Lấy thông tin người dùng
- `PUT /api/users/:id`: Cập nhật thông tin người dùng
- `DELETE /api/users/:id`: Xóa người dùng (Admin)

### Blood Donation APIs
- `POST /api/donations/register`: Đăng ký hiến máu
- `GET /api/donations/me`: Lấy lịch sử hiến máu của người dùng
- `GET /api/donations`: Lấy danh sách đăng ký hiến máu (Staff)
- `PUT /api/donations/:id/status`: Cập nhật trạng thái đăng ký

### Event APIs
- `POST /api/events`: Tạo sự kiện hiến máu mới
- `GET /api/events`: Lấy danh sách sự kiện
- `GET /api/events/:id`: Lấy chi tiết sự kiện
- `PUT /api/events/:id`: Cập nhật sự kiện
- `DELETE /api/events/:id`: Xóa sự kiện

### Volunteer Center APIs
- `POST /api/centers`: Đăng ký cơ sở tình nguyện mới
- `GET /api/centers`: Lấy danh sách cơ sở tình nguyện
- `GET /api/centers/pending`: Lấy danh sách cơ sở chờ duyệt
- `PUT /api/centers/:id/approve`: Phê duyệt cơ sở
- `PUT /api/centers/:id/reject`: Từ chối cơ sở

### Certificate APIs
- `POST /api/certificates`: Tạo giấy chứng nhận mới
- `GET /api/certificates/me`: Lấy giấy chứng nhận của người dùng
- `GET /api/certificates/:id`: Lấy chi tiết giấy chứng nhận
- `GET /api/certificates/:id/download`: Tải giấy chứng nhận

### Statistic APIs
- `GET /api/statistics/blood-stock`: Thống kê tồn kho máu
- `GET /api/statistics/donations`: Thống kê số lượng hiến máu
- `GET /api/statistics/events`: Thống kê sự kiện hiến máu

## 8. Bảo mật và hiệu suất

### Bảo mật
- HTTPS cho tất cả giao tiếp
- JWT với thời gian hết hạn ngắn
- Helmet.js để bảo vệ HTTP headers
- Rate limiting với express-rate-limit
- Validation input với Zod
- Prepared statements và ORM để ngăn chặn SQL injection
- Nguyên tắc Principle of Least Privilege
- Logging và giám sát hành vi bất thường

### Hiệu suất
- Caching với Redis
- Indexing cơ sở dữ liệu hợp lý
- Pagination cho tất cả API trả về danh sách
- Compression với compression middleware
- Optimized queries với Prisma
- Connection pooling cho SQL Server

## 9. Quy trình phát triển

### Workflow
- **Git Flow**: feature branches -> develop -> release -> main
- **Naming convention**: feature/feature-name, bugfix/bug-name, etc.
- **Commit message**: Theo chuẩn Conventional Commits
- **PR review**: Tối thiểu 1 approval

### CI/CD
- Build tự động mỗi khi push
- Deploy tự động lên môi trường dev khi merge vào develop
- Deploy lên staging khi merge vào release
- Deploy lên production khi merge vào main

## 10. Tài liệu và Hướng dẫn

### Tài liệu API
- Swagger/OpenAPI documentation
- Chi tiết mỗi endpoint, input/output formats
- Authentication requirements

### Hướng dẫn phát triển
- Setup môi trường dev
- Prisma migration với SQL Server
- Adding new features
- Unit testing và integration testing


