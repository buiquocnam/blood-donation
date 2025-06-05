'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardChartsProps } from '../types';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardCharts = ({
  registrationData,
  donationData
}: DashboardChartsProps) => {
  const registrationChartData: ChartData<'line'> = {
    labels: registrationData.map(item => item.date),
    datasets: [
      {
        label: 'Tổng đăng ký',
        data: registrationData.map(item => item.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Đã duyệt',
        data: registrationData.map(item => item.approved),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Từ chối',
        data: registrationData.map(item => item.rejected),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      }
    ]
  };

  const donationChartData: ChartData<'bar'> = {
    labels: donationData.map(item => item.month),
    datasets: [
      {
        label: 'Số lượt hiến máu',
        data: donationData.map(item => item.total),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê đăng ký theo ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={registrationChartData} options={chartOptions} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Thống kê hiến máu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={donationChartData} options={chartOptions} />
        </CardContent>
      </Card>
    </div>
  );
}; 