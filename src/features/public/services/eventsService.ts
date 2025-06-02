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
   * Get public events with optional filters
   * @param options Filter options including status, search, date range, pagination
   * @returns Paginated events response
   */
  async getPublicEvents(options: {
    status?: TrangThaiSuKien;
    page?: number; 
    limit?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
  } = {}): Promise<EventsResponse> {
    const {
      status,
      page = 1,
      limit = 10,
      search = '',
      fromDate,
      toDate
    } = options;

    const response = await api.get(endpoints.EVENT.LIST, {
      params: {
        status,
        page,
        limit,
        search,
        fromDate,
        toDate
      }
    });

    return response.data.result;
  },

  /**
   * Get a public event by ID
   */
  async getEvenById(id: string): Promise<EventsResponse | undefined> {
    try {
      const response = await api.get(endpoints.EVENT.DETAIL(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return undefined;
    }
  },


}; 