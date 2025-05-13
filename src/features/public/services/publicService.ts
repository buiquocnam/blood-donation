import { mockNhomMau, mockBloodBankReport, mockDanhMucDVMau } from '@/mock';
import type { NHOMMAU, BloodTypeStats, DANHMUCDVMAU } from '@/types';

/**
 * Service cho các thông tin public
 */
export const publicService = {
  /**
   * Lấy thông tin các nhóm máu
   */
  async getBloodTypes(): Promise<NHOMMAU[]> {
    return Promise.resolve(mockNhomMau);
  },

  /**
   * Lấy thông tin thống kê nhóm máu
   */
  async getBloodTypeStats(): Promise<BloodTypeStats[]> {
    return Promise.resolve(mockBloodBankReport.bloodTypeStats);
  },

  /**
   * Lấy thông tin nhóm máu theo mã
   */
  async getBloodTypeByCode(code: string): Promise<NHOMMAU | undefined> {
    const bloodType = mockNhomMau.find(bt => bt.MaNhomMau === code);
    return Promise.resolve(bloodType);
  },

  /**
   * Lấy thông tin nhóm máu đang cần
   * Mặc định sẽ lấy 3 nhóm máu có tỷ lệ thấp nhất
   */
  async getNeededBloodTypes(limit: number = 3): Promise<BloodTypeStats[]> {
    // Sort by percentage ascending (lowest percentage first)
    const sortedStats = [...mockBloodBankReport.bloodTypeStats].sort((a, b) => a.PhanTram - b.PhanTram);
    return Promise.resolve(sortedStats.slice(0, limit));
  },

  async getDMDVMau(): Promise<DANHMUCDVMAU[]> {
    return Promise.resolve(mockDanhMucDVMau);
  },
}; 