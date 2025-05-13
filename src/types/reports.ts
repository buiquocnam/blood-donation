// Kiểu thống kê
export interface ThongKeNhomMau {
  MaNhomMau: string;
  MoTaNhomMau: string;
  SoLuong: number;
  PhanTram: number;
}

export interface ThongKeHienMau {
  tongSoDangKy: number;
  soLuongThanhCong: number;
  thongKeTheoThang: Array<{
    thang: string;
    soLuong: number;
  }>;
}

export interface BaoCaoNganHangMau {
  thongKeNhomMau: ThongKeNhomMau[];
  thongKeHienMau: ThongKeHienMau;
  thongKeSuKien: {
    tongSoSuKien: number;
    suKienSapDienRa: number;
    suKienDaHoanThanh: number;
  };
}

// Các kiểu dữ liệu thống kê 
export interface BloodTypeStats {
  MaNhomMau: string;
  MoTaNhomMau: string;
  SoLuong: number;
  PhanTram: number;
}

export interface DonationStats {
  tongSoDangKy: number;
  soLuongThanhCong: number;
  thongKeTheoThang: Array<{
    thang: string;
    soLuong: number;
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