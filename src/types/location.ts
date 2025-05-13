// Bảng THANHPHO (Thành phố)
export interface THANHPHO {
  IdThanhPho: string; // IDTHANHPHO in DB
  TenThanhPho: string; // TENTHANHPHO in DB
}

// Bảng QUAN (Quận)
export interface QUAN {
  IdQuan: string; // IDQUAN in DB
  IdThanhPho: string; // IDTHANHPHO in DB
  TenQuan: string; // TENQUAN in DB
}

// Bảng PHUONG (Phường)
export interface PHUONG {
  IdPhuong: string; // IDPHUONG in DB
  IdQuan: string; // IDQUAN in DB
  TenPhuong: string; // TENPHUONG in DB
}

// Kiểu mở rộng liên quan đến vị trí
export interface QUAN_WithCity extends QUAN {
  ThanhPho?: THANHPHO;
}

export interface PHUONG_WithQuan extends PHUONG {
  Quan?: QUAN_WithCity;
}

export interface AddressDetail {
  thanhPho: THANHPHO;
  quan: QUAN;
  phuong: PHUONG;
  diaChi: string;
} 