import { apiClient } from '@/shared/services/api';
import { PUBLIC_ENDPOINTS } from '@/shared/services/api/endpoints';
import type { NHOMMAU } from '@/types';

/**
 * Service cho các thông tin public
 */
export const bloodService = {
  /**
   * Lấy thông tin các nhóm máu
   */
  async getBloodTypes(): Promise<NHOMMAU[]> {
    return apiClient.get<NHOMMAU[]>(PUBLIC_ENDPOINTS.BLOOD_TYPES.LIST);
  },

}; 