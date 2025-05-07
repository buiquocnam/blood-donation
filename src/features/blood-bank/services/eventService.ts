import { mockRegistrationRequests } from "../mock/data";
import type { DANGKITOCHUCHIENMAU_WithRelations, FormDuLieuSuKien, TrangThaiSuKien } from "../types";

/**
 * Service quản lý sự kiện hiến máu
 */
export const eventService = {
  /**
   * Lấy tất cả sự kiện hiến máu
   */
  async getEvents(): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    return Promise.resolve(mockRegistrationRequests);
  },

  /**
   * Lấy sự kiện theo trạng thái cụ thể
   */
  async getEventsByStatus(status: TrangThaiSuKien): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    return Promise.resolve(
      mockRegistrationRequests.filter(event => event.TrangThaiSuKien === status)
    );
  },

  /**
   * Lấy sự kiện theo ID
   */
  async getEventById(id: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockRegistrationRequests.find(e => e.IdSuKien === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }
    return Promise.resolve(event);
  },

  /**
   * Tạo sự kiện mới từ đăng ký đã được duyệt
   */
  async createEvent(registrationId: string, eventData: FormDuLieuSuKien): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const registration = mockRegistrationRequests.find(req => req.IdSuKien === registrationId);
    if (!registration) {
      return Promise.reject(new Error("Không tìm thấy đăng ký"));
    }

    // Thời gian của sự kiện sẽ được lấy từ ThongBao
    const newEvent = {
      IdSuKien: registrationId,
      IdThongBaoDK: registration.IdThongBaoDK,
      IDCoSoTinhNguyen: registration.IDCoSoTinhNguyen,
      NgayDangKi: registration.NgayDangKi,
      TinhTrangDK: "approved",
      SoLuongDK: eventData.SoLuongDK || 0,
      SoLuongDDK: eventData.SoLuongDDK || 0,
      TrangThaiSuKien: eventData.TrangThaiSuKien || "upcoming",
      NgayDang: new Date().toISOString(),
      NgaySua: new Date().toISOString(),
      HanDK: eventData.HanDK,
      CoSoTinhNguyen: registration.CoSoTinhNguyen,
      ThongBao: registration.ThongBao
    };

    return Promise.resolve(newEvent as DANGKITOCHUCHIENMAU_WithRelations);
  },

  /**
   * Cập nhật sự kiện hiện có
   */
  async updateEvent(id: string, eventData: Partial<FormDuLieuSuKien>): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockRegistrationRequests.find(e => e.IdSuKien === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }

    // Cập nhật sự kiện với các giá trị mới
    const updatedEventData = { ...event };
    
    if (eventData.SoLuongDK !== undefined) {
      updatedEventData.SoLuongDK = eventData.SoLuongDK;
    }
    
    if (eventData.SoLuongDDK !== undefined) {
      updatedEventData.SoLuongDDK = eventData.SoLuongDDK;
    }
    
    if (eventData.TrangThaiSuKien) {
      updatedEventData.TrangThaiSuKien = eventData.TrangThaiSuKien;
    }
    
    if (eventData.HanDK) {
      updatedEventData.HanDK = eventData.HanDK;
    }
    
    updatedEventData.NgaySua = new Date().toISOString();

    // Giả lập cập nhật
    console.log(`Đã cập nhật sự kiện ${id}`);

    return Promise.resolve(updatedEventData as DANGKITOCHUCHIENMAU_WithRelations);
  },

  /**
   * Hủy sự kiện
   */
  async cancelEvent(id: string, reason: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockRegistrationRequests.find(e => e.IdSuKien === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }

    if (event.TrangThaiSuKien === "completed") {
      return Promise.reject(new Error("Không thể hủy sự kiện đã hoàn thành"));
    }

    // Giả lập việc hủy sự kiện
    console.log(`Đã hủy sự kiện ${id} với lý do: ${reason}`);

    const cancelledEvent = {
      ...event,
      TrangThaiSuKien: "cancelled",
      NgaySua: new Date().toISOString()
    };

    return Promise.resolve(cancelledEvent as DANGKITOCHUCHIENMAU_WithRelations);
  },

  /**
   * Đánh dấu sự kiện đã hoàn thành
   */
  async completeEvent(id: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockRegistrationRequests.find(e => e.IdSuKien === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }

    const completedEvent = {
      ...event,
      TrangThaiSuKien: "completed",
      NgaySua: new Date().toISOString()
    };

    // Giả lập hoàn thành sự kiện
    console.log(`Đã hoàn thành sự kiện ${id}`);

    return Promise.resolve(completedEvent as DANGKITOCHUCHIENMAU_WithRelations);
  }
}; 