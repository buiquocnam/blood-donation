import { mockRegistrationRequests } from "../mock/data";
import type { RegistrationRequest } from "../types";

/**
 * Service for managing organization registration requests
 */
export const organizationRequestService = {
  /**
   * Get all registration requests
   */
  async getRegistrationRequests(): Promise<RegistrationRequest[]> {
    return Promise.resolve(mockRegistrationRequests);
  },

  /**
   * Get pending registration requests
   */
  async getPendingRequests(): Promise<RegistrationRequest[]> {
    return Promise.resolve(
      mockRegistrationRequests.filter(req => req.TinhTrangDK === "pending")
    );
  },

  /**
   * Get registration requests for a specific notification
   */
  async getRequestsByNotificationId(notificationId: string): Promise<RegistrationRequest[]> {
    return Promise.resolve(
      mockRegistrationRequests.filter(req => req.IDThongBaoDK === notificationId)
    );
  },

  /**
   * Approve a registration request
   */
  async approveRequest(id: string): Promise<RegistrationRequest> {
    const request = mockRegistrationRequests.find(req => req.IdDangKiTC === id);
    if (!request) {
      return Promise.reject(new Error("Không tìm thấy yêu cầu đăng ký"));
    }

    const updatedRequest: RegistrationRequest = {
      ...request,
      TinhTrangDK: "approved" as const
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(updatedRequest);
  },

  /**
   * Reject a registration request
   */
  async rejectRequest(id: string, reason: string): Promise<RegistrationRequest> {
    const request = mockRegistrationRequests.find(req => req.IdDangKiTC === id);
    if (!request) {
      return Promise.reject(new Error("Không tìm thấy yêu cầu đăng ký"));
    }

    // Trong triển khai thực tế, sẽ lưu lý do từ chối trong DB
    console.log(`Rejected request ${id} with reason: ${reason}`);

    const updatedRequest: RegistrationRequest = {
      ...request,
      TinhTrangDK: "rejected" as const
    };

    // Trong thực tế, đây sẽ là API call
    return Promise.resolve(updatedRequest);
  }
}; 