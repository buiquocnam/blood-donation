import { mockDangKiToChucHienMau } from "@/mock";
import type { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiDangKy, TrangThaiSuKien } from "@/types";

/**
 * Dịch vụ quản lý yêu cầu đăng ký tổ chức
 */
export const organizationRequestService = {
  /**
   * Lấy tất cả yêu cầu đăng ký
   */
  async getRegistrationRequests(): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    return Promise.resolve(mockDangKiToChucHienMau);
  },

  /**
   * Lấy tất cả yêu cầu đăng ký chờ duyệt
   */
  async getPendingRequests(): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    return Promise.resolve(mockDangKiToChucHienMau.filter(req => req.TinhTrangDK === "pending"));
  },

  /**
   * Lấy yêu cầu đăng ký theo ID thông báo
   */
  async getRequestsByNotificationId(notificationId: string): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    return Promise.resolve(
      mockDangKiToChucHienMau.filter(req => req.IdThongBaoDK === notificationId)
    );
  },

  /**
   * Phê duyệt yêu cầu đăng ký
   */
  async approveRequest(id: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const request = mockDangKiToChucHienMau.find(req => req.IdSuKien === id);
    if (!request) {
      return Promise.reject(new Error("Không tìm thấy yêu cầu đăng ký"));
    }

    const updatedRequest: DANGKITOCHUCHIENMAU_WithRelations = {
      ...request,
      TinhTrangDK: 'approved' as TrangThaiDangKy
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(updatedRequest);
  },

  /**
   * Từ chối yêu cầu đăng ký
   */
  async rejectRequest(id: string, reason: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const request = mockDangKiToChucHienMau.find(req => req.IdSuKien === id);
    if (!request) {
      return Promise.reject(new Error("Không tìm thấy yêu cầu đăng ký"));
    }

    const updatedRequest: DANGKITOCHUCHIENMAU_WithRelations = {
      ...request,
      TinhTrangDK: 'rejected' as TrangThaiDangKy
    };

    // Trong thực tế, đây sẽ là API call và lưu lý do từ chối
    return Promise.resolve(updatedRequest);
  },
  
  /**
   * Tạo sự kiện từ yêu cầu đăng ký
   */
  async createEvent(registrationId: string, eventData: any): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const request = mockDangKiToChucHienMau.find(req => req.IdSuKien === registrationId);
    if (!request) {
      return Promise.reject(new Error("Không tìm thấy yêu cầu đăng ký"));
    }

    if (request.TinhTrangDK !== 'approved') {
      return Promise.reject(new Error("Yêu cầu đăng ký chưa được phê duyệt"));
    }

    // Thời gian sự kiện sẽ được lấy từ thông báo
    // Sử dụng TgBatDauSK và TgKetThucSK từ ThongBao

    //Tạo sự kiện mới
    const newEvent: DANGKITOCHUCHIENMAU_WithRelations = {
      ...request,
      TrangThaiSuKien: "upcoming" as TrangThaiSuKien,
      NgaySua: new Date().toISOString(),
      HanDK: eventData.HanDK || new Date().toISOString(),
      SoLuongDK: eventData.SoLuongDK || 0,
      SoLuongDDK: eventData.SoLuongDDK || 0
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(newEvent);
  }
}; 