import { mockBloodEvents, mockRegistrationRequests } from "../mock/data";
import type { BloodEvent, EventFormData } from "../types";

/**
 * Service for managing blood donation events
 */
export const eventService = {
  /**
   * Get all blood donation events
   */
  async getEvents(): Promise<BloodEvent[]> {
    return Promise.resolve(mockBloodEvents);
  },

  /**
   * Get events with a specific status
   */
  async getEventsByStatus(status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'): Promise<BloodEvent[]> {
    return Promise.resolve(
      mockBloodEvents.filter(event => event.TrangThaiSuKien === status)
    );
  },

  /**
   * Get a specific event by ID
   */
  async getEventById(id: string): Promise<BloodEvent> {
    const event = mockBloodEvents.find(e => e.IdSuKienHienMau === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }
    return Promise.resolve(event);
  },

  /**
   * Create a new event from an approved registration
   */
  async createEvent(registrationId: string, eventData: EventFormData): Promise<BloodEvent> {
    const registration = mockRegistrationRequests.find(req => req.IdDangKiTC === registrationId);
    if (!registration) {
      return Promise.reject(new Error("Không tìm thấy đăng ký"));
    }

    const newEvent: BloodEvent = {
      IdSuKienHienMau: `sk${mockBloodEvents.length + 1}`,
      IdDangKiTC: registrationId,
      SoLuongDK: 0,
      SoLuongDDK: 0,
      TgBatDauSK: eventData.TgBatDauSK,
      TgKetThucSK: eventData.TgKetThucSK,
      HanDK: eventData.HanDK,
      NgayDang: new Date().toISOString(),
      NgaySua: new Date().toISOString(),
      TrangThaiSuKien: "upcoming" as const,
      DangKiTC: registration
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(newEvent);
  },

  /**
   * Update an existing event
   */
  async updateEvent(id: string, eventData: Partial<EventFormData>): Promise<BloodEvent> {
    const event = mockBloodEvents.find(e => e.IdSuKienHienMau === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }

    const updatedEvent: BloodEvent = {
      ...event,
      ...eventData,
      NgaySua: new Date().toISOString()
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(updatedEvent);
  },

  /**
   * Cancel an event
   */
  async cancelEvent(id: string, reason: string): Promise<BloodEvent> {
    const event = mockBloodEvents.find(e => e.IdSuKienHienMau === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }

    // Trong triển khai thực tế, sẽ lưu lý do hủy trong DB
    console.log(`Cancelled event ${id} with reason: ${reason}`);

    const cancelledEvent: BloodEvent = {
      ...event,
      TrangThaiSuKien: "cancelled" as const,
      NgaySua: new Date().toISOString()
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(cancelledEvent);
  },

  /**
   * Mark an event as complete
   */
  async completeEvent(id: string): Promise<BloodEvent> {
    const event = mockBloodEvents.find(e => e.IdSuKienHienMau === id);
    if (!event) {
      return Promise.reject(new Error("Không tìm thấy sự kiện"));
    }

    const completedEvent: BloodEvent = {
      ...event,
      TrangThaiSuKien: "completed" as const,
      NgaySua: new Date().toISOString()
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(completedEvent);
  }
}; 