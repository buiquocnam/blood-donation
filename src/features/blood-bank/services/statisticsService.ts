import { mockBloodTypeStats, mockDonationStats, mockBloodBankReportNew } from "../mock/data";
import type { BloodTypeStats, DonationStats, BloodBankReport } from "@/types";

/**
 * Service cho thống kê ngân hàng máu
 */
export const statisticsService = {
  /**
   * Lấy thống kê nhóm máu
   */
  async getBloodTypeStats(): Promise<BloodTypeStats[]> {
    return Promise.resolve(mockBloodTypeStats);
  },

  /**
   * Lấy thống kê hiến máu
   */
  async getDonationStats(): Promise<DonationStats> {
    return Promise.resolve(mockDonationStats);
  },

  /**
   * Lấy báo cáo tổng hợp ngân hàng máu
   */
  async getBloodBankReport(): Promise<BloodBankReport> {
    return Promise.resolve(mockBloodBankReportNew);
  },

  /**
   * Xuất báo cáo
   */
  async exportReport(format: 'pdf' | 'excel', startDate?: string, endDate?: string): Promise<string> {
    console.log(`Exporting report in ${format} format from ${startDate || 'all time'} to ${endDate || 'present'}`);
    
    // Giả lập xuất báo cáo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filename = `blood_bank_report_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    return Promise.resolve(filename);
  }
}; 