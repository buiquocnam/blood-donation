import { DANGKIHIENMAU, DANGKIHIENMAU_WithRelations, DANGKITOCHUCHIENMAU_WithRelations, PHANHOI } from "@/types/events";
import { DANHMUCDVMAU } from "@/types/events";
import { GIAYCHUNGNHAN } from "@/types/events";
import { TrangThaiDangKy, TrangThaiHienMau, TrangThaiSuKien } from "@/types/common";
import api from "@/lib/api/client";
import { FormDangKyHienMau, FormPhanHoiHienMau, LichSuHienMau, ThongKeNguoiHien, ChiTietDangKyHienMau } from "../types";

// Mock data để phát triển, sẽ được thay thế khi API hoàn thành
import { mockDangKiHienMau } from "@/mock/events";
import { mockGiayChungNhan } from "@/mock/events";
import { mockDanhMucDVMau } from "@/mock/announcements";
import { mockDangKiToChucHienMau } from "@/mock/events";
import { mockCoSoTinhNguyen } from "@/mock/volunteers";
import { mockThongBaoDKToChuc } from "@/mock/announcements";
import { COSOTINHNGUYEN, DANGKITOCHUCHIENMAU, THONGBAODKTOCHUC } from "@/types";

/**
 * Service xử lý các chức năng dành cho người hiến máu
 */
export class DonorService {
  private static ENDPOINTS = {
    EVENTS: "/api/donor/events",
    REGISTRATIONS: "/api/donor/registrations",
    REGISTER: "/api/donor/register",
    CANCEL: "/api/donor/cancel",
    FEEDBACK: "/api/donor/feedback",
    CERTIFICATES: "/api/donor/certificates",
    STATISTICS: "/api/donor/statistics",
  };

  /**
   * Lấy danh sách các sự kiện hiến máu
   */
  public static async getAvailableEvents(): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    try { 
      const response = await api.get(this.ENDPOINTS.EVENTS);
      return response.data;
    } catch (error) {
      console.error("[DonorService] getAvailableEvents error:", error);
      
      // Mock data trong quá trình phát triển
      const filteredEvents = mockDangKiToChucHienMau
        .filter(event => 
          event.TinhTrangDK === TrangThaiDangKy.DA_DUYET && 
          (event.TrangThaiSuKien === TrangThaiSuKien.SAP_DIEN_RA || 
           event.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA)
        );
      
      // Thêm dữ liệu quan hệ cho các sự kiện
      return filteredEvents.map(event => this.enrichEventWithRelations(event));
    }
  }

  // Hàm trợ giúp để thêm dữ liệu quan hệ cho sự kiện
  private static enrichEventWithRelations(event: DANGKITOCHUCHIENMAU): DANGKITOCHUCHIENMAU_WithRelations {
    // Thêm thông tin cơ sở tình nguyện
    const coSoTinhNguyen = mockCoSoTinhNguyen.find(
      cs => cs.IDCoSoTinhNguyen === event.IDCoSoTinhNguyen
    );
    
    // Thêm thông tin thông báo
    const thongBao = mockThongBaoDKToChuc.find(
      tb => tb.IdThongBaoDK === event.IdThongBaoDK
    );
    
    return {
      ...event,
      CoSoTinhNguyen: coSoTinhNguyen,
      ThongBao: thongBao
    };
  }

  /**
   * Lấy danh sách các đăng ký hiến máu của người dùng hiện tại
   */
  public static async getDonorRegistrations(userId: string): Promise<LichSuHienMau[]> {
    try {
      const response = await api.get(`${this.ENDPOINTS.REGISTRATIONS}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("[DonorService] getDonorRegistrations error:", error);
      
      // Mock data trong quá trình phát triển
      const mockRegistrations = mockDangKiHienMau
        .filter(reg => reg.IdNguoiHienMau === userId)
        .map(reg => {
          return {
            ...reg,
            ngayHienFormatted: new Date(reg.NgayDangKi).toLocaleDateString('vi-VN'),
            mauTrangThai: reg.TrangThaiHienMau === TrangThaiHienMau.DA_HOAN_THANH 
              ? 'bg-green-500' 
              : (reg.TrangThaiHienMau === TrangThaiHienMau.CHO_HIEN ? 'bg-yellow-500' : 'bg-red-500')
          } as LichSuHienMau;
        })
        .sort((a, b) => new Date(b.NgayDangKi).getTime() - new Date(a.NgayDangKi).getTime()); // Sắp xếp theo thời gian mới nhất đến cũ nhất
      
      return mockRegistrations;
    }
  }

  /**
   * Lấy chi tiết một đăng ký hiến máu
   */
  public static async getRegistrationDetail(registrationId: string): Promise<ChiTietDangKyHienMau> {
    try {
      const response = await api.get(`${this.ENDPOINTS.REGISTRATIONS}/${registrationId}`);
      return response.data;
    } catch (error) {
      console.error("[DonorService] getRegistrationDetail error:", error);
      
      // Mock data trong quá trình phát triển
      const registration = mockDangKiHienMau.find(reg => reg.MaDKiHienMau === registrationId);
      if (!registration) {
        throw new Error("Không tìm thấy đăng ký hiến máu");
      }
      
      const event = mockDangKiToChucHienMau.find(evt => evt.IdSuKien === registration.IdSuKienHienMau);
      if (!event) {
        throw new Error("Không tìm thấy sự kiện hiến máu");
      }
      
      return {
        dangKyHienMau: registration as DANGKIHIENMAU_WithRelations,
        suKienHienMau: event as DANGKITOCHUCHIENMAU_WithRelations,
        coTheHuy: registration.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET,
        coTheGuiPhanHoi: registration.TrangThaiHienMau === TrangThaiHienMau.DA_HOAN_THANH
      };
    }
  }

  /**
   * Đăng ký hiến máu
   */
  public static async registerDonation(data: FormDangKyHienMau): Promise<DANGKIHIENMAU> {
    try {
      const response = await api.post(this.ENDPOINTS.REGISTER, data);
      return response.data;
    } catch (error) {
      console.error("[DonorService] registerDonation error:", error);
      
      // Mock đăng ký thành công trong quá trình phát triển
      const mockRegistration: DANGKIHIENMAU = {
        MaDKiHienMau: `DK${Date.now().toString().slice(-6)}`,
        IdNguoiHienMau: "ND001", // Giả sử người dùng hiện tại
        IdSuKienHienMau: data.idSuKienHienMau,
        IdDanhMucDVHienMau: data.idDanhMucDVHienMau,
        TrangThaiHienMau: TrangThaiHienMau.CHO_HIEN,
        TrangThaiDonDK: TrangThaiDangKy.CHO_DUYET,
        NgayDangKi: new Date().toISOString(),
        NgaySua: new Date().toISOString(),
        ChieuCao: data.chieuCao || 0,
        CanNang: data.canNang || 0,
        NhietDo: 0,
        NhipTim: 0,
        HuyetAp: "",
        DaTungHienMau: data.daTungHienMau,
        TienSuBenh: data.tienSuBenh || "",
        MacBenhHienTai: data.macBenhHienTai || "",
        ThongTin12ThangQua: data.thongTin12ThangQua || "",
        ThongTin6ThangQua: data.thongTin6ThangQua || "",
        ThongTin1ThangQua: data.thongTin1ThangQua || "",
        ThongTin14NgayQua: data.thongTin14NgayQua || "",
        Thuoc7Ngay: data.thuoc7Ngay || "",
        ThongTinPhuNu12ThangQua: data.thongTinPhuNu12ThangQua || "",
        TTSKKhamSangLoc: "",
        TTSKSauHien: "",
        GhiChu: data.ghiChu || "",
        IdNVDuyet: "",
        IdBacSi: ""
      };
      
      return mockRegistration;
    }
  }

  /**
   * Hủy đăng ký hiến máu
   */
  public static async cancelRegistration(registrationId: string): Promise<boolean> {
    try {
      await api.delete(`${this.ENDPOINTS.CANCEL}/${registrationId}`);
      return true;
    } catch (error) {
      console.error("[DonorService] cancelRegistration error:", error);
      // Giả lập hủy đăng ký thành công trong quá trình phát triển
      return true;
    }
  }

  /**
   * Gửi phản hồi sau khi hiến máu
   */
  public static async submitFeedback(data: FormPhanHoiHienMau): Promise<PHANHOI> {
    try {
      const response = await api.post(this.ENDPOINTS.FEEDBACK, data);
      return response.data;
    } catch (error) {
      console.error("[DonorService] submitFeedback error:", error);
      
      // Mock phản hồi thành công trong quá trình phát triển
      const mockFeedback: PHANHOI = {
        MaPhanHoi: `PH${Date.now().toString().slice(-6)}`,
        MaDKiKienMau: data.maDKiHienMau,
        TinhTrangMoTa: data.tinhTrangMoTa,
        NgayPhanHoi: new Date().toISOString()
      };
      
      return mockFeedback;
    }
  }

  /**
   * Lấy danh sách đơn vị hiến máu
   */
  public static async getBloodDonationUnits(): Promise<DANHMUCDVMAU[]> {
    try {
      const response = await api.get("/api/blood-units");
      return response.data;
    } catch (error) {
      console.error("[DonorService] getBloodDonationUnits error:", error);
      // Mock data trong quá trình phát triển
      return mockDanhMucDVMau;
    }
  }

  /**
   * Lấy giấy chứng nhận hiến máu
   */
  public static async getDonationCertificates(userId: string): Promise<GIAYCHUNGNHAN[]> {
    try {
      const response = await api.get(`${this.ENDPOINTS.CERTIFICATES}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("[DonorService] getDonationCertificates error:", error);
      
      // Mock data trong quá trình phát triển
      return mockGiayChungNhan.filter(cert => cert.MaNguoiDung === userId);
    }
  }

  /**
   * Lấy thống kê hiến máu của người dùng
   */
  public static async getDonorStatistics(userId: string): Promise<ThongKeNguoiHien> {
    try {
      const response = await api.get(`${this.ENDPOINTS.STATISTICS}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("[DonorService] getDonorStatistics error:", error);
      
      // Mock data trong quá trình phát triển
      const registrations = mockDangKiHienMau.filter(reg => reg.IdNguoiHienMau === userId);
      const approvedRegistrations = registrations.filter(
        reg => reg.TrangThaiHienMau === TrangThaiHienMau.DA_HOAN_THANH
      );
      const pendingRegistrations = registrations.filter(
        reg => reg.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET
      );
      
      const certificates = mockGiayChungNhan.filter(cert => cert.MaNguoiDung === userId);
      
      // Sắp xếp theo ngày để lấy ngày hiến gần nhất
      const sortedRegistrations = [...approvedRegistrations].sort(
        (a, b) => new Date(b.NgayDangKi).getTime() - new Date(a.NgayDangKi).getTime()
      );
      
      return {
        tongLuotHien: registrations.length,
        tongLuotDaDuyet: approvedRegistrations.length,
        tongLuotChoDuyet: pendingRegistrations.length,
        ngayHienGanNhat: sortedRegistrations[0]?.NgayDangKi,
        tongLuongMauHien: approvedRegistrations.reduce((total, reg) => {
          const donationUnit = mockDanhMucDVMau.find(
            unit => unit.IdDanhMucDVHienMau === reg.IdDanhMucDVHienMau
          );
          return total + (donationUnit?.SoLuongMau || 0);
        }, 0),
        soGiayChungNhan: certificates.length
      };
    }
  }
} 