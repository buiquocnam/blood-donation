"use client"

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reportService } from '../services/reportService';
import { BloodTypeStats, DonationStats, BloodBankReport } from '@/types';

/**
 * Hook for managing blood bank reports and statistics
 */
export function useBloodBankReport() {
  // Get full report
  const { data: fullReport, isLoading: isFullReportLoading, error: fullReportError } = useQuery<BloodBankReport>({
    queryKey: ['blood-bank', 'reports', 'full'],
    queryFn: () => reportService.getFullReport(),
  });

  // Lấy thống kê nhóm máu
  const { data: bloodTypeStats, isLoading: isBloodTypeStatsLoading } = useQuery<BloodTypeStats[]>({
    queryKey: ['blood-bank', 'reports', 'blood-types'],
    queryFn: () => reportService.getBloodTypeStats(),
  });

  // Lấy thống kê hiến máu
  const { data: donationStats, isLoading: isDonationStatsLoading } = useQuery<DonationStats>({
    queryKey: ['blood-bank', 'reports', 'donations'],
    queryFn: () => reportService.getDonationStats(),
  });

  // Lấy thống kê nhóm máu theo khoảng thời gian
  const getBloodTypeStatsByDateRange = (startDate: string, endDate: string) => {
    return useQuery<BloodTypeStats[]>({
      queryKey: ['blood-bank', 'reports', 'blood-types', { startDate, endDate }],
      queryFn: () => reportService.getBloodTypeStatsByDateRange(startDate, endDate),
    });
  };

  // Lấy thống kê hiến máu theo khoảng thời gian
  const getDonationStatsByDateRange = (startDate: string, endDate: string) => {
    return useQuery<DonationStats>({
      queryKey: ['blood-bank', 'reports', 'donations', { startDate, endDate }],
      queryFn: () => reportService.getDonationStatsByDateRange(startDate, endDate),
    });
  };

  // Xuất báo cáo
  const exportReport = async (format: 'pdf' | 'excel', startDate?: string, endDate?: string): Promise<string> => {
    try {
      const filename = await reportService.exportReport(format, startDate, endDate);
      toast.success(`Báo cáo đã được xuất thành công: ${filename}`);
      return filename;
    } catch (error) {
      toast.error('Không thể xuất báo cáo: ' + (error as Error).message);
      throw error;
    }
  };

  return {
    fullReport,
    isFullReportLoading,
    fullReportError,
    bloodTypeStats,
    isBloodTypeStatsLoading,
    donationStats,
    isDonationStatsLoading,
    getBloodTypeStatsByDateRange,
    getDonationStatsByDateRange,
    exportReport
  };
} 