import { useState, useCallback } from 'react';
import { DashboardStats, RegistrationChartData, DonationChartData } from '../types';
import { dashboardService } from '../services/dashboardService';
import { toast } from 'sonner';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationChartData[]>([]);
  const [donationData, setDonationData] = useState<DonationChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsData, registrationChartData, donationChartData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRegistrationChart(),
        dashboardService.getDonationChart()
      ]);

      setStats(statsData);
      setRegistrationData(registrationChartData);
      setDonationData(donationChartData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast.error('Không thể tải dữ liệu thống kê');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    registrationData,
    donationData,
    isLoading,
    error,
    fetchDashboardData
  };
}; 