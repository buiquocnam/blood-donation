import { api } from '@/lib/api';
import { LOCATION_ENDPOINTS } from '@/lib/api/endpoints';
import { THANHPHO, QUAN, PHUONG, AddressDetail } from '@/types/location';

/**
 * Service để xử lý các API liên quan đến địa điểm
 */
export const locationService = {
  /**
   * Lấy danh sách tất cả thành phố
   * @returns Danh sách thành phố
   */
  async getCities(): Promise<THANHPHO[]> {
    try {
      const response = await api.get(LOCATION_ENDPOINTS.CITIES);
      // Kiểm tra cấu trúc response để truy cập đúng dữ liệu
      const result = response.data?.result || response.data || [];
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  /**
   * Lấy danh sách quận theo thành phố
   * @param cityId ID của thành phố
   * @returns Danh sách quận thuộc thành phố
   */
  async getDistrictsByCity(cityId: string): Promise<QUAN[]> {
    try {
      const response = await api.get(LOCATION_ENDPOINTS.DISTRICTS(cityId));
      return response.data.result;
    } catch (error) {
      console.error(`Error fetching districts for city ${cityId}:`, error);
      return [];
    }
  },

  /**
   * Lấy danh sách phường theo quận
   * @param districtId ID của quận
   * @returns Danh sách phường thuộc quận
   */
  async getWardsByDistrict(districtId: string): Promise<PHUONG[]> {
    try {
      const response = await api.get(LOCATION_ENDPOINTS.WARDS(districtId));
      return response.data.result;
    } catch (error) {
      console.error(`Error fetching wards for district ${districtId}:`, error);
      return [];
    }
  },

  /**
   * Lấy thông tin đầy đủ của địa chỉ dựa trên ID phường
   * @param wardId ID của phường
   * @returns Thông tin đầy đủ của địa chỉ
   */
  async getFullAddress(wardId: string): Promise<AddressDetail | null> {
    try {
      const response = await api.get(LOCATION_ENDPOINTS.FULL_ADDRESS(wardId));
      return response.data.result;
    } catch (error) {
      console.error(`Error fetching full address for ward ${wardId}:`, error);
      return null;
    }
  }
}; 