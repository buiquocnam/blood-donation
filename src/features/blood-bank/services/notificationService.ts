import { mockThongBaoDKToChuc } from "@/mock";
import type { THONGBAODKTOCHUC, FormDuLieuThongBao } from "@/types";

/**
 * Service for handling blood donation notifications
 */
export const notificationService = {
  /**
   * Get all notifications created by the blood bank
   */
  async getNotifications(): Promise<THONGBAODKTOCHUC[]> {
    // Sử dụng dữ liệu mẫu thay vì gọi API
    return Promise.resolve(mockThongBaoDKToChuc);
  },

  /**
   * Get a specific notification by ID
   */
  async getNotificationById(id: string): Promise<THONGBAODKTOCHUC> {
    const notification = mockThongBaoDKToChuc.find(n => n.IdThongBaoDK === id);
    if (!notification) {
      return Promise.reject(new Error("Không tìm thấy thông báo"));
    }
    return Promise.resolve(notification);
  },

  /**
   * Create a new notification for volunteer centers
   */
  async createNotification(notification: FormDuLieuThongBao): Promise<THONGBAODKTOCHUC> {
    // Giả lập việc tạo thông báo mới
    const newNotification: THONGBAODKTOCHUC = {
      IdThongBaoDK: `tb${mockThongBaoDKToChuc.length + 1}`,
      IDNguoiTao: "user1", // Giả sử user hiện tại
      ...notification,
      NgayDang: new Date().toISOString(),
      NgaySua: new Date().toISOString(),
      HanDK: notification.HanDK || new Date().toISOString(),
      TgBatDauDK: notification.TgBatDauDK || new Date().toISOString(),
      TgKetThucDK: notification.TgKetThucDK || new Date().toISOString(),
      TgBatDauSK: notification.TgBatDauSK || new Date().toISOString(),
      TgKetThucSK: notification.TgKetThucSK || new Date().toISOString()
    };
    
    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(newNotification);
  },

  /**
   * Update an existing notification
   */
  async updateNotification(id: string, notification: Partial<FormDuLieuThongBao>): Promise<THONGBAODKTOCHUC> {
    const existingNotification = mockThongBaoDKToChuc.find(n => n.IdThongBaoDK === id);
    if (!existingNotification) {
      return Promise.reject(new Error("Không tìm thấy thông báo"));
    }

    // Giả lập việc cập nhật thông báo
    const updatedNotification: THONGBAODKTOCHUC = {
      ...existingNotification,
      ...notification,
      NgaySua: new Date().toISOString(),
      HanDK: notification.HanDK || existingNotification.HanDK,
      TgBatDauDK: notification.TgBatDauDK || existingNotification.TgBatDauDK,
      TgKetThucDK: notification.TgKetThucDK || existingNotification.TgKetThucDK,
      TgBatDauSK: notification.TgBatDauSK || existingNotification.TgBatDauSK,
      TgKetThucSK: notification.TgKetThucSK || existingNotification.TgKetThucSK
    };
    
    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(updatedNotification);
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    const notificationIndex = mockThongBaoDKToChuc.findIndex(n => n.IdThongBaoDK === id);
    if (notificationIndex === -1) {
      return Promise.reject(new Error("Không tìm thấy thông báo"));
    }
    
    // Trong thực tế, đây sẽ là API call
    return Promise.resolve();
  }
}; 