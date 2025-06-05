import { apiClient } from '@/shared/services/api';
import { EVENT_ENDPOINTS } from '@/shared/services/api/endpoints';
import { DANGKITOCHUCHIENMAU_RESPONSE } from '@/types';

export interface EventOptions {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
}

export const eventService = {
  /**
   * Lấy danh sách sự kiện với phân trang và filter
   * @param options - Các tùy chọn filter và phân trang
   */
  async getAll(options: EventOptions = {}) {
    return apiClient.getList<DANGKITOCHUCHIENMAU_RESPONSE>(EVENT_ENDPOINTS.LIST, options);
  },

  async getById(id: string) {
    return apiClient.get<DANGKITOCHUCHIENMAU_RESPONSE>(EVENT_ENDPOINTS.DETAIL(id));
  },

  async getUpcoming(limit = 5) {
    return apiClient.getList<DANGKITOCHUCHIENMAU_RESPONSE>(`${EVENT_ENDPOINTS.LIST}/upcoming`, {
      limit
    });
  },

  async getFeatured() {
    return apiClient.getList<DANGKITOCHUCHIENMAU_RESPONSE>(`${EVENT_ENDPOINTS.LIST}/featured`);
  },

  async search(query: string) {
    return apiClient.get<DANGKITOCHUCHIENMAU_RESPONSE[]>(`${EVENT_ENDPOINTS.LIST}/search`, {
      q: query
    });
  }
};