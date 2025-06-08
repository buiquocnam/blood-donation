import { apiClient } from '@/shared/services/api';
import { EVENT_ENDPOINTS } from '@/shared/services/api/endpoints';
import { LOCATION_ENDPOINTS } from '@/shared/services/api/endpoints';
import { THANHPHO, PHUONG_WithQuan, QUAN_WithCity } from '@/types';

export const locationService = {
  /**
   * Lấy danh sách tỉnh/thành phố
   */
  async getCities() {
    return apiClient.get<THANHPHO[]>(LOCATION_ENDPOINTS.CITIES);
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh/thành phố
   * @param cityId - ID của tỉnh/thành phố
   */
  async getDistricts(cityId: string) {
    return apiClient.get<QUAN_WithCity[]>(LOCATION_ENDPOINTS.DISTRICTS(cityId));
  },

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   * @param districtId - ID của quận/huyện
   */
  async getWards(districtId: string) {
    return apiClient.get<PHUONG_WithQuan[]>(LOCATION_ENDPOINTS.WARDS(districtId));
  }
};
