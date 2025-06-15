# API Documentation - Hệ thống Quản lý Hiến máu

Tài liệu này mô tả chi tiết về các API endpoint có sẵn trong hệ thống Quản lý Hiến máu.

## Cấu trúc Xác thực

Hệ thống sử dụng xác thực JWT. Token cần được gửi trong header HTTP của mỗi request yêu cầu xác thực:

```
Authorization: Bearer <token>
```

## Danh sách API Endpoints

### 1. Authentication APIs

#### 1.1. Đăng ký người dùng cá nhân

- **URL**: `/api/auth/register/user`
- **Method**: `POST`
- **Require Auth**: Không
- **Body**:
  ```json
  {
    "HOTEN": "Nguyễn Văn A",
    "EMAIL": "nguyen.van.a@example.com",
    "PASSWORD": "Password123",
    "NGAYSINH": "1990-01-01",
    "GIOITINH": true,
    "SDT": "0912345678",
    "IDPHUONG": "P001",
    "TENDUONG": "123 Đường ABC",
    "CCCD": "079123456789",
    "MANHOMMAU": "A+"
  }
  ```
- **Response (201)**:
  ```json
  {
    "message": "Đăng ký thành công",
    "user": {
      "id": "ND12345678",
      "ho_ten": "Nguyễn Văn A",
      "email": "nguyen.van.a@example.com"
    }
  }
  ```
- **Response (400)**: `{ "message": "Email đã được sử dụng" }`

#### 1.2. Đăng ký cơ sở tình nguyện

- **URL**: `/api/auth/register/center`
- **Method**: `POST`
- **Require Auth**: Không
- **Content-Type**: `multipart/form-data` (vì cần upload file minh chứng)
- **Form Fields**:
  ```
  TENCOSOTINHNGUYEN: "Trung tâm Hiến máu ABC"
  EMAIL: "center@example.com"
  PASSWORD: "Password123"
  SDT: "0912345678"
  NGUOIPHUTRACH: "Nguyễn Văn B"
  IDPHUONG: "P001"
  DIACHI: "123 Đường XYZ"
  USERNAME: "center_abc"
  minhChung: [FILE] // File minh chứng (Giấy phép hoạt động, văn bản thành lập,...)
  ```
- **Response (201)**:
  ```json
  {
    "message": "Đăng ký thành công. Cơ sở tình nguyện của bạn đang chờ được phê duyệt.",
    "center": {
      "id": "CS12345678",
      "ten": "Trung tâm Hiến máu ABC",
      "email": "center@example.com",
      "tinh_trang": "CHUA_DUYET",
      "minh_chung": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/hienmau/proofs/filename.jpg"
    }
  }
  ```
- **Response (400)**: `{ "message": "Email hoặc tên đăng nhập đã được sử dụng" }` hoặc `{ "message": "File minh chứng không hợp lệ" }`

#### 1.3. Đăng nhập

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Require Auth**: Không
- **Body**:
  ```json
  {
    "email": "example@email.com",
    "password": "Password123",
    "loginType": "user"  // hoặc "center" cho cơ sở tình nguyện
  }
  ```
- **Response (200) - User**:
  ```json
  {
    "id": "ND12345678",
    "ho_ten": "Nguyễn Văn A",
    "email": "nguyen.van.a@example.com",
    "vai_tro": "ROLE_DONOR",
    "user_type": "user",
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Response (200) - Center**:
  ```json
  {
    "id": "CS12345678",
    "ten": "Trung tâm Hiến máu ABC",
    "email": "center@example.com",
    "vai_tro": "ROLE_VOLUNTEER_MANAGER",
    "user_type": "center",
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Response (401)**: `{ "message": "Người dùng không tồn tại" }` hoặc `{ "message": "Mật khẩu không chính xác" }`

#### 1.4. Làm mới token

- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Require Auth**: Không
- **Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Response (200)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Response (401)**: `{ "message": "Refresh token không hợp lệ hoặc đã hết hạn" }`

#### 1.5. Đăng xuất

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Require Auth**: Có
- **Response (200)**: `{ "message": "Đăng xuất thành công" }`

### 2. User APIs

#### 2.1. Lấy danh sách người dùng (Admin only)

- **URL**: `/api/users`
- **Method**: `GET`
- **Require Auth**: Có (ROLE_ADMIN)
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng kết quả mỗi trang (mặc định: 10)
  - `search`: Tìm kiếm theo tên hoặc email
- **Response (200)**:
  ```json
  {
    "users": [
      {
        "MANGUOIDUNG": "ND12345678",
        "HOTEN": "Nguyễn Văn A",
        "EMAIL": "nguyen.van.a@example.com",
        "SDT": "0912345678",
        "NGAYSINH": "1990-01-01",
        "MAVAITRO": "ROLE_DONOR"
      }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
  ```

#### 2.2. Lấy thông tin người dùng theo ID

- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Require Auth**: Có (Chính người dùng đó hoặc ROLE_ADMIN)
- **Response (200)**:
  ```json
  {
    "MANGUOIDUNG": "ND12345678",
    "HOTEN": "Nguyễn Văn A",
    "EMAIL": "nguyen.van.a@example.com",
    "SDT": "0912345678",
    "NGAYSINH": "1990-01-01",
    "GIOITINH": true,
    "MAVAITRO": "ROLE_DONOR",
    "MANHOMMAU": "A+",
    "phuong": {
      "IDPHUONG": "P001",
      "TENPHUONG": "Phường 1",
      "quan": {
        "IDQUAN": "Q001",
        "TENQUAN": "Quận 1",
        "thanhpho": {
          "IDTHANHPHO": "TP001",
          "TENTHANHPHO": "TP. Hồ Chí Minh"
        }
      }
    }
  }
  ```
- **Response (404)**: `{ "message": "Không tìm thấy người dùng" }`

#### 2.3. Cập nhật thông tin người dùng

- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Require Auth**: Có (Chính người dùng đó hoặc ROLE_ADMIN)
- **Body**:
  ```json
  {
    "HOTEN": "Nguyễn Văn A",
    "SDT": "0912345678",
    "IDPHUONG": "P001",
    "TENDUONG": "123 Đường ABC",
    "MANHOMMAU": "A+"
  }
  ```
- **Response (200)**:
  ```json
  {
    "message": "Cập nhật thông tin người dùng thành công",
    "user": {
      "id": "ND12345678",
      "ho_ten": "Nguyễn Văn A",
      "email": "nguyen.van.a@example.com"
    }
  }
  ```
- **Response (404)**: `{ "message": "Không tìm thấy người dùng" }`

### 3. Volunteer Center APIs

#### 3.1. Lấy danh sách cơ sở tình nguyện đã được phê duyệt

- **URL**: `/api/centers`
- **Method**: `GET`
- **Require Auth**: Không
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng kết quả mỗi trang (mặc định: 10)
  - `search`: Tìm kiếm theo tên
  - `cityId`: Lọc theo ID thành phố
  - `districtId`: Lọc theo ID quận
  - `wardId`: Lọc theo ID phường
- **Response (200)**:
  ```json
  {
    "centers": [
      {
        "IDCOSOTINHNGUYEN": "CS12345678",
        "TENCOSOTINHNGUYEN": "Đại học Y Dược TP.HCM",
        "MAVAITRO": "ROLE_VOLUNTEER_MANAGER",
        "SDT": "02838558411",
        "EMAIL": "hienmau@yds.edu.vn",
        "NGUOIPHUTRACH": "TS. Nguyễn Văn A",
        "DIACHI": "217 Hồng Bàng, Phường 11, Quận 5",
        "TINHTRANG": "DA_DUYET",
        "phuong": {
          "IDPHUONG": "P001",
          "TENPHUONG": "Phường 11",
          "quan": {
            "IDQUAN": "Q005",
            "TENQUAN": "Quận 5",
            "thanhpho": {
              "IDTHANHPHO": "TP001",
              "TENTHANHPHO": "TP. Hồ Chí Minh"
            }
          }
        }
      }
    ],
    "total": 10,
    "page": 1,
    "totalPages": 1
  }
  ```

#### 3.2. Lấy danh sách cơ sở tình nguyện đang chờ phê duyệt (Blood Director only)

- **URL**: `/api/centers/admin/pending`
- **Method**: `GET`
- **Require Auth**: Có (ROLE_BLOOD_DIRECTOR)
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng kết quả mỗi trang (mặc định: 10)
- **Response (200)**:
  ```json
  {
    "centers": [
      {
        "IDCOSOTINHNGUYEN": "CS87654321",
        "TENCOSOTINHNGUYEN": "Đại học Bách Khoa TP.HCM",
        "MAVAITRO": "ROLE_VOLUNTEER_MANAGER",
        "SDT": "02838654087",
        "EMAIL": "hienmau@hcmut.edu.vn",
        "NGUOIPHUTRACH": "ThS. Trần Văn B",
        "DIACHI": "268 Lý Thường Kiệt, Phường 14, Quận 10",
        "MINHCHUNG": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/hienmau/proofs/filename.jpg",
        "TINHTRANG": "CHUA_DUYET",
        "phuong": {
          "IDPHUONG": "P014",
          "TENPHUONG": "Phường 14",
          "quan": {
            "IDQUAN": "Q010",
            "TENQUAN": "Quận 10",
            "thanhpho": {
              "IDTHANHPHO": "TP001",
              "TENTHANHPHO": "TP. Hồ Chí Minh"
            }
          }
        }
      }
    ],
    "total": 5,
    "page": 1,
    "totalPages": 1
  }
  ```

#### 3.3. Lấy thông tin chi tiết cơ sở tình nguyện

- **URL**: `/api/centers/:id`
- **Method**: `GET`
- **Require Auth**: Không (Thông tin cơ bản), Có (Thông tin đầy đủ cho ROLE_BLOOD_DIRECTOR hoặc chính cơ sở đó)
- **Response (200)**:
  ```json
  {
    "IDCOSOTINHNGUYEN": "CS12345678",
    "TENCOSOTINHNGUYEN": "Đại học Y Dược TP.HCM",
    "MAVAITRO": "ROLE_VOLUNTEER_MANAGER",
    "SDT": "02838558411",
    "EMAIL": "hienmau@yds.edu.vn",
    "NGUOIPHUTRACH": "TS. Nguyễn Văn A",
    "DIACHI": "217 Hồng Bàng, Phường 11, Quận 5",
    "TINHTRANG": "DA_DUYET",
    "phuong": {
      "IDPHUONG": "P001",
      "TENPHUONG": "Phường 11",
      "quan": {
        "IDQUAN": "Q005",
        "TENQUAN": "Quận 5",
        "thanhpho": {
          "IDTHANHPHO": "TP001",
          "TENTHANHPHO": "TP. Hồ Chí Minh"
        }
      }
    }
  }
  ```
- **Response (404)**: `{ "message": "Không tìm thấy cơ sở tình nguyện" }`

#### 3.4. Xem minh chứng của cơ sở tình nguyện (Blood Director only)

- **URL**: `/api/centers/:id/proof`
- **Method**: `GET`
- **Require Auth**: Có (ROLE_BLOOD_DIRECTOR)
- **Response (200)**:
  ```json
  {
    "center_id": "CS87654321",
    "ten": "Đại học Bách Khoa TP.HCM",
    "minh_chung": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/hienmau/proofs/filename.jpg"
  }
  ```
- **Response (404)**: `{ "message": "Cơ sở tình nguyện chưa tải lên minh chứng" }`

#### 3.5. Phê duyệt cơ sở tình nguyện (Blood Director only)

- **URL**: `/api/centers/:id/approve`
- **Method**: `PUT`
- **Require Auth**: Có (ROLE_BLOOD_DIRECTOR)
- **Response (200)**:
  ```json
  {
    "message": "Cơ sở tình nguyện đã được phê duyệt thành công",
    "center": {
      "id": "CS87654321",
      "ten": "Đại học Bách Khoa TP.HCM",
      "tinh_trang": "DA_DUYET",
      "minh_chung": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/hienmau/proofs/filename.jpg"
    }
  }
  ```
- **Response (400)**: `{ "message": "Cơ sở tình nguyện chưa cung cấp minh chứng" }`
- **Response (404)**: `{ "message": "Không tìm thấy cơ sở tình nguyện" }`

#### 3.6. Từ chối cơ sở tình nguyện (Blood Director only)

- **URL**: `/api/centers/:id/reject`
- **Method**: `PUT`
- **Require Auth**: Có (ROLE_BLOOD_DIRECTOR)
- **Response (200)**:
  ```json
  {
    "message": "Cơ sở tình nguyện đã bị từ chối thành công",
    "center": {
      "id": "CS87654321",
      "ten": "Đại học Bách Khoa TP.HCM",
      "tinh_trang": "TU_CHOI"
    }
  }
  ```
- **Response (404)**: `{ "message": "Không tìm thấy cơ sở tình nguyện" }`

#### 3.7. Lấy thông tin profile của cơ sở tình nguyện hiện tại

- **URL**: `/api/centers/profile/me`
- **Method**: `GET`
- **Require Auth**: Có (ROLE_VOLUNTEER_MANAGER)
- **Response (200)**:
  ```json
  {
    "id": "CS12345678",
    "ten": "Đại học Y Dược TP.HCM",
    "email": "hienmau@yds.edu.vn",
    "sdt": "02838558411",
    "nguoi_phu_trach": "TS. Nguyễn Văn A",
    "dia_chi": "217 Hồng Bàng, Phường 11, Quận 5",
    "id_phuong": "P001"
  }
  ```

#### 3.8. Cập nhật thông tin cơ sở tình nguyện

- **URL**: `/api/centers/:id`
- **Method**: `PUT`
- **Require Auth**: Có (ROLE_VOLUNTEER_MANAGER của chính cơ sở đó)
- **Body**:
  ```json
  {
    "TENCOSOTINHNGUYEN": "Đại học Y Dược TP.HCM - Cơ sở 2",
    "SDT": "02838558422",
    "NGUOIPHUTRACH": "TS. Nguyễn Văn C",
    "IDPHUONG": "P001",
    "DIACHI": "217 Hồng Bàng, Phường 11, Quận 5"
  }
  ```
- **Response (200)**:
  ```json
  {
    "message": "Cập nhật thông tin cơ sở tình nguyện thành công",
    "center": {
      "id": "CS12345678",
      "ten": "Đại học Y Dược TP.HCM - Cơ sở 2",
      "email": "hienmau@yds.edu.vn",
      "sdt": "02838558422",
      "nguoi_phu_trach": "TS. Nguyễn Văn C"
    }
  }
  ```
- **Response (404)**: `{ "message": "Không tìm thấy cơ sở tình nguyện" }`

#### 3.9. Cập nhật minh chứng cho cơ sở tình nguyện

- **URL**: `/api/auth/center/:id/proof`
- **Method**: `PUT`
- **Require Auth**: Có (Token của cơ sở tình nguyện)
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  ```
  minhChung: [FILE] // File minh chứng mới
  ```
- **Response (200)**:
  ```json
  {
    "message": "Cập nhật minh chứng thành công",
    "center": {
      "id": "CS12345678",
      "ten": "Đại học Y Dược TP.HCM",
      "minh_chung": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/hienmau/proofs/new-filename.jpg"
    }
  }
  ```
- **Response (400)**: `{ "message": "Vui lòng tải lên file minh chứng" }`

### 4. Location APIs

#### 4.1. Lấy danh sách tất cả các thành phố

- **URL**: `/api/locations/cities`
- **Method**: `GET`
- **Require Auth**: Không
- **Response (200)**:
  ```json
  [
    {
      "IDTHANHPHO": "TP001",
      "TENTHANHPHO": "TP. Hồ Chí Minh"
    },
    {
      "IDTHANHPHO": "TP002",
      "TENTHANHPHO": "Hà Nội"
    }
  ]
  ```

#### 4.2. Lấy danh sách quận theo thành phố

- **URL**: `/api/locations/cities/:cityId/districts`
- **Method**: `GET`
- **Require Auth**: Không
- **Response (200)**:
  ```json
  [
    {
      "IDQUAN": "Q001",
      "TENQUAN": "Quận 1",
      "IDTHANHPHO": "TP001"
    },
    {
      "IDQUAN": "Q002",
      "TENQUAN": "Quận 2",
      "IDTHANHPHO": "TP001"
    }
  ]
  ```

#### 4.3. Lấy danh sách phường theo quận

- **URL**: `/api/locations/districts/:districtId/wards`
- **Method**: `GET`
- **Require Auth**: Không
- **Response (200)**:
  ```json
  [
    {
      "IDPHUONG": "P001",
      "TENPHUONG": "Phường Bến Nghé",
      "IDQUAN": "Q001"
    },
    {
      "IDPHUONG": "P002",
      "TENPHUONG": "Phường Bến Thành",
      "IDQUAN": "Q001"
    }
  ]
  ```

### 5. Blood Group APIs

#### 5.1. Lấy danh sách tất cả các nhóm máu

- **URL**: `/api/blood-groups`
- **Method**: `GET`
- **Require Auth**: Không
- **Response (200)**:
  ```json
  [
    {
      "MANHOMMAU": "A+",
      "MOTANHOMMAU": "Nhóm máu A dương",
      "DOPHOBIEN": 35.7,
      "GHICHU": "Có thể cho máu đến A+ và AB+. Có thể nhận máu từ A+, A-, O+ và O-"
    },
    {
      "MANHOMMAU": "A-",
      "MOTANHOMMAU": "Nhóm máu A âm",
      "DOPHOBIEN": 6.3,
      "GHICHU": "Có thể cho máu đến A+, A-, AB+ và AB-. Có thể nhận máu từ A- và O-"
    }
  ]
  ```

## Tài liệu bổ sung

### Mã lỗi thông dụng

- **400 Bad Request**: Yêu cầu không hợp lệ
- **401 Unauthorized**: Không có quyền truy cập (chưa đăng nhập)
- **403 Forbidden**: Không đủ quyền thực hiện hành động
- **404 Not Found**: Không tìm thấy tài nguyên
- **500 Internal Server Error**: Lỗi server

### Trạng thái cơ sở tình nguyện

- **CHUA_DUYET**: Cơ sở đang chờ được duyệt sau khi đăng ký
- **DA_DUYET**: Cơ sở đã được duyệt và có thể hoạt động
- **TU_CHOI**: Cơ sở đã bị từ chối hoặc bị khóa 