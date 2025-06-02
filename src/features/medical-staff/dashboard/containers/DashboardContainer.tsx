'use client';

import { useEffect } from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardCharts } from '../components/DashboardCharts';
import { useDashboard } from '../hooks/useDashboard';
import { Loader2 } from 'lucide-react';

export const DashboardContainer = () => {
  const {
    stats,
    registrationData,
    donationData,
    isLoading,
    error,
    fetchDashboardData
  } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Có lỗi xảy ra khi tải dữ liệu
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} />
      <DashboardCharts
        registrationData={registrationData}
        donationData={donationData}
      />
    </div>
  );
}; 