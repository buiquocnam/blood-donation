import { mockBloodBankReport } from "@/mock/reports";
import type { BloodTypeStats, DonationStats, BloodBankReport } from "@/types";

/**
 * Service cho thống kê ngân hàng máu
 */
export const statisticsService = {
  /**
   * Lấy thống kê nhóm máu
   */
  async getBloodTypeStats(): Promise<BloodTypeStats[]> {
    return Promise.resolve(mockBloodBankReport.bloodTypeStats);
  },

  /**
   * Lấy thống kê hiến máu
   */
  async getDonationStats(): Promise<DonationStats> {
    return Promise.resolve(mockBloodBankReport.donationStats);
  },

  /**
   * Lấy báo cáo tổng hợp ngân hàng máu
   */
  async getBloodBankReport(): Promise<BloodBankReport> {
    return Promise.resolve(mockBloodBankReport);
  },

  /**
   * Xuất báo cáo
   * @param format - Định dạng xuất báo cáo ('pdf' hoặc 'excel')
   * @param startDate - Ngày bắt đầu (tùy chọn)
   * @param endDate - Ngày kết thúc (tùy chọn)
   * @returns Tên file đã xuất
   */
  async exportReport(format: 'pdf' | 'excel', startDate?: string, endDate?: string): Promise<string> {
    console.log(`Exporting report in ${format} format from ${startDate || 'all time'} to ${endDate || 'present'}`);
    
    // Giả lập xuất báo cáo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const dateFormatted = new Date().toISOString().split('T')[0];
    const dateRange = startDate && endDate 
      ? `_${startDate.split('T')[0]}_to_${endDate.split('T')[0]}` 
      : '';
    
    const filename = `blood_bank_report${dateRange}_${dateFormatted}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    return Promise.resolve(filename);
  }
}; 