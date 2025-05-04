"use client"

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reportService } from '../services/reportService';

/**
 * Hook for managing blood bank reports and statistics
 */
export function useBloodBankReport() {
  // Get full report
  const { data: fullReport, isLoading: isFullReportLoading, error: fullReportError } = useQuery({
    queryKey: ['blood-bank', 'reports', 'full'],
    queryFn: () => reportService.getFullReport(),
  });

  // Get blood type statistics
  const { data: bloodTypeStats, isLoading: isBloodTypeStatsLoading } = useQuery({
    queryKey: ['blood-bank', 'reports', 'blood-types'],
    queryFn: () => reportService.getBloodTypeStats(),
  });

  // Get donation statistics
  const { data: donationStats, isLoading: isDonationStatsLoading } = useQuery({
    queryKey: ['blood-bank', 'reports', 'donations'],
    queryFn: () => reportService.getDonationStats(),
  });

  // Get blood type statistics by date range
  const getBloodTypeStatsByDateRange = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['blood-bank', 'reports', 'blood-types', { startDate, endDate }],
      queryFn: () => reportService.getBloodTypeStatsByDateRange(startDate, endDate),
    });
  };

  // Get donation statistics by date range
  const getDonationStatsByDateRange = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['blood-bank', 'reports', 'donations', { startDate, endDate }],
      queryFn: () => reportService.getDonationStatsByDateRange(startDate, endDate),
    });
  };

  // Export report
  const exportReport = async (format: 'pdf' | 'csv' | 'excel', startDate?: string, endDate?: string) => {
    try {
      const blob = await reportService.exportReport(format, startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blood-bank-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Báo cáo đã được xuất thành công dưới dạng ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Không thể xuất báo cáo: ' + (error as Error).message);
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