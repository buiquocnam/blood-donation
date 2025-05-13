import { mockBloodBankReport } from "@/mock/reports";
import type { BloodBankReport, BloodTypeStats, DonationStats } from "@/types";

/**
 * Service for generating and handling blood bank reports
 */
export const reportService = {
  /**
   * Get complete report for the blood bank
   */
  async getFullReport(): Promise<BloodBankReport> {
    return Promise.resolve(mockBloodBankReport);
  },

  /**
   * Get blood type statistics
   */
  async getBloodTypeStats(): Promise<BloodTypeStats[]> {
    return Promise.resolve(mockBloodBankReport.bloodTypeStats);
  },

  /**
   * Get blood type statistics filtered by date range
   */
  async getBloodTypeStatsByDateRange(startDate: string, endDate: string): Promise<BloodTypeStats[]> {
    console.log(`Filtering blood type stats from ${startDate} to ${endDate}`);
    // Ở đây chỉ trả về dữ liệu mẫu, trong thực tế sẽ lọc dữ liệu theo ngày
    return Promise.resolve(mockBloodBankReport.bloodTypeStats);
  },

  /**
   * Get donation statistics
   */
  async getDonationStats(): Promise<DonationStats> {
    return Promise.resolve(mockBloodBankReport.donationStats);
  },

  /**
   * Get donation statistics filtered by date range
   */
  async getDonationStatsByDateRange(startDate: string, endDate: string): Promise<DonationStats> {
    console.log(`Filtering donation stats from ${startDate} to ${endDate}`);
    // Ở đây chỉ trả về dữ liệu mẫu, trong thực tế sẽ lọc dữ liệu theo ngày
    return Promise.resolve(mockBloodBankReport.donationStats);
  },

  /**
   * Export report in various formats
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