import { mockBloodTypeStats, mockDonationStats } from "../mock/data";
import type { BloodBankReport, BloodTypeStats, DonationStats } from "../types";

/**
 * Service for generating and handling blood bank reports
 */
export const reportService = {
  /**
   * Get complete report for the blood bank
   */
  async getFullReport(): Promise<BloodBankReport> {
    return Promise.resolve({
      bloodTypeStats: mockBloodTypeStats,
      donationStats: mockDonationStats,
      eventStats: {
        totalEvents: 12,
        upcomingEvents: 5,
        ongoingEvents: 2,
        completedEvents: 5
      }
    });
  },

  /**
   * Get blood type statistics
   */
  async getBloodTypeStats(): Promise<BloodTypeStats[]> {
    return Promise.resolve(mockBloodTypeStats);
  },

  /**
   * Get blood type statistics filtered by date range
   */
  async getBloodTypeStatsByDateRange(startDate: string, endDate: string): Promise<BloodTypeStats[]> {
    console.log(`Filtering blood type stats from ${startDate} to ${endDate}`);
    // Ở đây chỉ trả về dữ liệu mẫu, trong thực tế sẽ lọc dữ liệu theo ngày
    return Promise.resolve(mockBloodTypeStats);
  },

  /**
   * Get donation statistics
   */
  async getDonationStats(): Promise<DonationStats> {
    return Promise.resolve(mockDonationStats);
  },

  /**
   * Get donation statistics filtered by date range
   */
  async getDonationStatsByDateRange(startDate: string, endDate: string): Promise<DonationStats> {
    console.log(`Filtering donation stats from ${startDate} to ${endDate}`);
    // Ở đây chỉ trả về dữ liệu mẫu, trong thực tế sẽ lọc dữ liệu theo ngày
    return Promise.resolve(mockDonationStats);
  },

  /**
   * Export report in various formats
   */
  async exportReport(format: 'pdf' | 'csv' | 'excel', startDate?: string, endDate?: string): Promise<Blob> {
    console.log(`Exporting report in ${format} format from ${startDate || 'all time'} to ${endDate || 'present'}`);
    
    // Giả lập tạo file blob, trong thực tế sẽ gọi API để tạo file
    const content = JSON.stringify({
      bloodTypeStats: mockBloodTypeStats,
      donationStats: mockDonationStats,
      exportedAt: new Date().toISOString(),
      dateRange: {
        from: startDate,
        to: endDate
      }
    });
    
    let mimeType = 'application/octet-stream';
    if (format === 'pdf') mimeType = 'application/pdf';
    if (format === 'csv') mimeType = 'text/csv';
    if (format === 'excel') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    return Promise.resolve(new Blob([content], { type: mimeType }));
  }
}; 