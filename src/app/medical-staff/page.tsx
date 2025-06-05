import { DashboardContainer } from '@/features/medical-staff/dashboard/containers/DashboardContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tổng quan | Blood Donation',
  description: 'Trang tổng quan cho nhân viên y tế',
};

export default function MedicalStaffDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground">
          Xem thống kê và báo cáo về hoạt động hiến máu
        </p>
      </div>
      <DashboardContainer />
    </div>
  );
} 