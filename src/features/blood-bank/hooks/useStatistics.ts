"use client"

import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { statisticsService } from '../services/statisticsService';
import type { BloodTypeStats, DonationStats, BloodBankReport } from '@/types';

/**
 * Hook for accessing blood bank statistics
 */
export function useStatistics() {
  // Lấy thống kê nhóm máu
  const {
    data: bloodTypeStats,
    isLoading: isBloodTypeStatsLoading,
    error: bloodTypeStatsError,
  } = useQuery<BloodTypeStats[]>({
    queryKey: ['blood-bank', 'statistics', 'blood-types'],
    queryFn: () => statisticsService.getBloodTypeStats(),
  });

  // Lấy thống kê hiến máu
  const {
    data: donationStats,
    isLoading: isDonationStatsLoading,
    error: donationStatsError,
  } = useQuery<DonationStats>({
    queryKey: ['blood-bank', 'statistics', 'donations'],
    queryFn: () => statisticsService.getDonationStats(),
  });

  // Lấy báo cáo tổng hợp
  const {
    data: report,
    isLoading: isReportLoading,
    error: reportError,
  } = useQuery<BloodBankReport>({
    queryKey: ['blood-bank', 'statistics', 'report'],
    queryFn: () => statisticsService.getBloodBankReport(),
  });

  // Xuất báo cáo dạng PDF
  const exportReportAsPDF = useMutation({
    mutationFn: (dateRange?: { startDate?: string, endDate?: string }) => 
      statisticsService.exportReport('pdf', dateRange?.startDate, dateRange?.endDate),
    onSuccess: (filename) => {
      toast.success(`Đã xuất báo cáo: ${filename}`);
    },
    onError: (error) => {
      toast.error('Không thể xuất báo cáo PDF: ' + (error as Error).message);
    },
  });

  // Xuất báo cáo dạng Excel
  const exportReportAsExcel = useMutation({
    mutationFn: (dateRange?: { startDate?: string, endDate?: string }) => 
      statisticsService.exportReport('excel', dateRange?.startDate, dateRange?.endDate),
    onSuccess: (filename) => {
      toast.success(`Đã xuất báo cáo: ${filename}`);
    },
    onError: (error) => {
      toast.error('Không thể xuất báo cáo Excel: ' + (error as Error).message);
    },
  });

  return {
    bloodTypeStats,
    isBloodTypeStatsLoading,
    bloodTypeStatsError,
    donationStats,
    isDonationStatsLoading,
    donationStatsError,
    report,
    isReportLoading,
    reportError,
    exportReportAsPDF,
    exportReportAsExcel,
  };
} 