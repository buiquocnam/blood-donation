import { api } from '@/lib/api';
import { endpoints } from '@/lib/api';
import { TrangThaiSuKien, TrangThaiDangKy, DANGKITOCHUCHIENMAU_WithRelations } from '@/types';
import { EventsResponse } from '@/features/public/types';
/**
 * Kiểu dữ liệu cho response API có phân trang
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Service for handling public events
 */
export const eventsService = {
  /**
   * Get all public events
   * Chỉ trả về các sự kiện đã được duyệt (TinhTrangDK = "approved")
   * @param page Số trang
   * @param limit Số lượng mỗi trang
   */
  async getPublicEvents(page: number = 1, limit: number = 10): Promise<EventsResponse> {
    const response = await api.get(endpoints.EVENT.LIST, {
      params: { page, limit }
    });
    return response.data.result;
  },

  /**
   * Get public events by status
   * @param status Trạng thái sự kiện (upcoming, ongoing, completed)
   * @param page Số trang
   * @param limit Số lượng mỗi trang
   */
  async getEventsByStatus(
    status: TrangThaiSuKien, 
    page: number = 1, 
    limit: number = 10
  ): Promise<EventsResponse> {
    const response = await api.get(endpoints.EVENT.LIST, {
      params: {
        status,
        is_approved: true,
        page,
        limit
      }
    });
    return response.data;
  },

  /**
   * Get a public event by ID
   */
  async getEventById(id: string): Promise<EventsResponse | undefined> {
    try {
      const response = await api.get(endpoints.EVENT.DETAIL(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return undefined;
    }
  },

  /**
   * Search public events by text
   * @param query Từ khóa tìm kiếm
   * @param page Số trang
   * @param limit Số lượng mỗi trang
   */
  async searchEvents(
    query: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<EventsResponse> {
    const response = await api.get(endpoints.EVENT.LIST, {
      params: {
        search: query,
        is_approved: true,
        page,
        limit
      }
    });
    return response.data;
  }
}; 