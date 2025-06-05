export interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  totalDonations: number;
  totalFeedbacks: number;
  pendingFeedbacks: number;
}

export interface DashboardStatsProps {
  stats: DashboardStats;
}

export interface RegistrationChartData {
  date: string;
  total: number;
  approved: number;
  rejected: number;
}

export interface DonationChartData {
  month: string;
  total: number;
}

export interface DashboardChartsProps {
  registrationData: RegistrationChartData[];
  donationData: DonationChartData[];
} 