import { mockNotifications } from "../mock/data";
import type { Notification, NotificationFormData } from "../types";

/**
 * Service for handling blood donation notifications
 */
export const notificationService = {
  /**
   * Get all notifications created by the blood bank
   */
  async getNotifications(): Promise<Notification[]> {
    // Sử dụng dữ liệu mẫu thay vì gọi API
    return Promise.resolve(mockNotifications);
  },

  /**
   * Get a specific notification by ID
   */
  async getNotificationById(id: string): Promise<Notification> {
    const notification = mockNotifications.find(n => n.IdThongBaoDK === id);
    if (!notification) {
      return Promise.reject(new Error("Không tìm thấy thông báo"));
    }
    return Promise.resolve(notification);
  },

  /**
   * Create a new notification for volunteer centers
   */
  async createNotification(notification: NotificationFormData): Promise<Notification> {
    // Giả lập việc tạo thông báo mới
    const newNotification: Notification = {
      IdThongBaoDK: `tb${mockNotifications.length + 1}`,
      IdNguoiTao: "user1", // Giả sử user hiện tại
      ...notification,
      NgayDang: new Date().toISOString(),
      NgaySua: new Date().toISOString()
    };
    
    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(newNotification);
  },

  /**
   * Update an existing notification
   */
  async updateNotification(id: string, notification: Partial<NotificationFormData>): Promise<Notification> {
    const existingNotification = mockNotifications.find(n => n.IdThongBaoDK === id);
    if (!existingNotification) {
      return Promise.reject(new Error("Không tìm thấy thông báo"));
    }

    // Giả lập việc cập nhật thông báo
    const updatedNotification: Notification = {
      ...existingNotification,
      ...notification,
      NgaySua: new Date().toISOString()
    };
    
    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(updatedNotification);
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    const notificationIndex = mockNotifications.findIndex(n => n.IdThongBaoDK === id);
    if (notificationIndex === -1) {
      return Promise.reject(new Error("Không tìm thấy thông báo"));
    }
    
    // Trong thực tế, đây sẽ là API call
    return Promise.resolve();
  }
}; 