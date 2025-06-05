import axios from '@/lib/axios';
import { DashboardStats, RegistrationChartData, DonationChartData } from '../types';
import { TrangThaiDangKy } from '@/types';

// Mock data cho thống kê
const mockStats: DashboardStats = {
  totalRegistrations: 150,
  pendingRegistrations: 25,
  approvedRegistrations: 100,
  rejectedRegistrations: 25,
  totalDonations: 85,
  totalFeedbacks: 45,
  pendingFeedbacks: 10,
};

// Mock data cho biểu đồ đăng ký
const mockRegistrationChart: RegistrationChartData[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const total = Math.floor(Math.random() * 10) + 5; // 5-15 đăng ký mỗi ngày
  const approved = Math.floor(Math.random() * (total - 2)) + 1; // 1 đến total-2 được duyệt
  const rejected = Math.floor(Math.random() * (total - approved)); // 0 đến số còn lại bị từ chối
  
  return {
    date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
    total,
    approved,
    rejected,
  };
}).reverse();

// Mock data cho biểu đồ hiến máu
const mockDonationChart: DonationChartData[] = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  
  return {
    month: new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(date),
    total: Math.floor(Math.random() * 20) + 10, // 10-30 lượt hiến máu mỗi tháng
  };
}).reverse();

export const dashboardService = {
  // Lấy thống kê tổng quan
  getStats: async (): Promise<DashboardStats> => {
    // const { data } = await axios.get('/medical-staff/dashboard/stats');
    // return data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStats), 1000);
    });
  },

  // Lấy dữ liệu biểu đồ đăng ký theo ngày
  getRegistrationChart: async (): Promise<RegistrationChartData[]> => {
    // const { data } = await axios.get('/medical-staff/dashboard/registrations-chart');
    // return data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRegistrationChart), 1000);
    });
  },

  // Lấy dữ liệu biểu đồ hiến máu theo tháng
  getDonationChart: async (): Promise<DonationChartData[]> => {
    // const { data } = await axios.get('/medical-staff/dashboard/donations-chart');
    // return data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDonationChart), 1000);
    });
  }
}; 