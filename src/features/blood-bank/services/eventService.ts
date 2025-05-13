import { mockDangKiToChucHienMau } from "@/mock";
import type { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien } from "@/types";

/**
 * Service quản lý sự kiện hiến máu
 */
export const eventService = {
  /**
   * Lấy tất cả sự kiện hiến máu
   */
  async getEvents(): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    return Promise.resolve(mockDangKiToChucHienMau);
  },

  /**
   * Lấy sự kiện theo trạng thái cụ thể
   */
  async getEventsByStatus(status: TrangThaiSuKien): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    return Promise.resolve(
      mockDangKiToChucHienMau.filter(event => event.TrangThaiSuKien === status)
    );
  },

  /**
   * Lấy sự kiện theo ID
   */
  async getEventById(id: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockDangKiToChucHienMau.find(e => e.IdSuKien === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }
    return Promise.resolve(event);
  },

  /**
   * Tạo sự kiện mới từ đăng ký đã được duyệt
   */
  async createEvent(registrationId: string, eventData: any): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const registration = mockDangKiToChucHienMau.find(req => req.IdSuKien === registrationId);
    if (!registration) {
      return Promise.reject(new Error("Không tìm thấy đăng ký"));
    }

    const newEvent: DANGKITOCHUCHIENMAU_WithRelations = {
      ...registration,
      TinhTrangDK: "approved" as any,
      SoLuongDK: eventData.SoLuongDK || 0,
      SoLuongDDK: eventData.SoLuongDDK || 0,
      TrangThaiSuKien: eventData.TrangThaiSuKien || "upcoming" as TrangThaiSuKien,
      NgaySua: new Date().toISOString(),
      HanDK: eventData.HanDK || new Date().toISOString()
    };

    return Promise.resolve(newEvent);
  },

  /**
   * Cập nhật sự kiện hiện có
   */
  async updateEvent(id: string, eventData: any): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockDangKiToChucHienMau.find(e => e.IdSuKien === id);
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

    return Promise.resolve(updatedEventData);
  },

  /**
   * Hủy sự kiện
   */
  async cancelEvent(id: string, reason: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockDangKiToChucHienMau.find(e => e.IdSuKien === id);
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
      TrangThaiSuKien: "cancelled" as TrangThaiSuKien,
      NgaySua: new Date().toISOString()
    };

    return Promise.resolve(cancelledEvent);
  },

  /**
   * Đánh dấu sự kiện đã hoàn thành
   */
  async completeEvent(id: string): Promise<DANGKITOCHUCHIENMAU_WithRelations> {
    const event = mockDangKiToChucHienMau.find(e => e.IdSuKien === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }

    const completedEvent = {
      ...event,
      TrangThaiSuKien: "completed" as TrangThaiSuKien,
      NgaySua: new Date().toISOString()
    };

    // Giả lập hoàn thành sự kiện
    console.log(`Đã hoàn thành sự kiện ${id}`);

    return Promise.resolve(completedEvent);
  }
}; 