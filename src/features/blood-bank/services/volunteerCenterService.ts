import { mockCoSoTinhNguyen, mockCoSoTinhNguyenPending } from "@/mock";
import type { COSOTINHNGUYEN } from "@/types";

/**
 * Service quản lý cơ sở tình nguyện
 */
export const volunteerCenterService = {
  /**
   * Lấy danh sách tất cả cơ sở tình nguyện đã được duyệt
   */
  async getApprovedCenters(): Promise<COSOTINHNGUYEN[]> {
    return Promise.resolve(mockCoSoTinhNguyen);
  },

  /**
   * Lấy danh sách tất cả cơ sở tình nguyện đang chờ duyệt
   */
  async getPendingCenters(): Promise<COSOTINHNGUYEN[]> {
    return Promise.resolve(mockCoSoTinhNguyenPending);
  },

  /**
   * Lấy thông tin chi tiết cơ sở tình nguyện theo ID
   */
  async getCenterById(id: string): Promise<COSOTINHNGUYEN> {
    // Tìm kiếm trong cả hai danh sách: đã duyệt và chờ duyệt
    const allCenters = [...mockCoSoTinhNguyen, ...mockCoSoTinhNguyenPending];
    const center = allCenters.find(c => c.IDCoSoTinhNguyen === id);
    
    if (!center) {
      return Promise.reject(new Error("Không tìm thấy cơ sở tình nguyện"));
    }
    
    return Promise.resolve(center);
  },

  /**
   * Phê duyệt đăng ký cơ sở tình nguyện
   */
  async approveCenter(id: string): Promise<COSOTINHNGUYEN> {
    const center = mockCoSoTinhNguyenPending.find(c => c.IDCoSoTinhNguyen === id);
    
    if (!center) {
      return Promise.reject(new Error("Không tìm thấy cơ sở tình nguyện chờ duyệt"));
    }
    
    // Tạo bản sao của cơ sở và cập nhật trạng thái
    const approvedCenter = {
      ...center,
      TinhTrang: true,
      NgayTao: new Date().toISOString() // Cập nhật ngày tạo khi phê duyệt
    };
    
    // Trong thực tế, đây sẽ là API call
    console.log(`Đã phê duyệt cơ sở tình nguyện ${id}`);
    
    return Promise.resolve(approvedCenter);
  },

  /**
   * Từ chối đăng ký cơ sở tình nguyện
   */
  async rejectCenter(id: string, reason: string): Promise<void> {
    const centerIndex = mockCoSoTinhNguyenPending.findIndex(c => c.IDCoSoTinhNguyen === id);
    
    if (centerIndex === -1) {
      return Promise.reject(new Error("Không tìm thấy cơ sở tình nguyện chờ duyệt"));
    }
    
    // Trong thực tế, đây sẽ là API call để xóa hoặc cập nhật trạng thái
    console.log(`Đã từ chối cơ sở tình nguyện ${id} với lý do: ${reason}`);
    
    return Promise.resolve();
  },

  /**
   * Cập nhật thông tin cơ sở tình nguyện
   */
  async updateCenter(id: string, data: Partial<COSOTINHNGUYEN>): Promise<COSOTINHNGUYEN> {
    const center = mockCoSoTinhNguyen.find(c => c.IDCoSoTinhNguyen === id);
    
    if (!center) {
      return Promise.reject(new Error("Không tìm thấy cơ sở tình nguyện"));
    }
    
    // Cập nhật thông tin
    const updatedCenter = {
      ...center,
      ...data,
      NgayTao: center.NgayTao // Giữ nguyên ngày tạo
    };
    
    // Trong thực tế, đây sẽ là API call
    console.log(`Đã cập nhật thông tin cơ sở tình nguyện ${id}`);
    
    return Promise.resolve(updatedCenter);
  }
}; 