'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStatsProps } from '../types';
import {
  Users,
  ClipboardCheck,
  ClipboardX,
  Clock,
  Droplet,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  description
}: {
  title: string;
  value: number;
  icon: any;
  description?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng đăng ký"
        value={stats.totalRegistrations}
        icon={Users}
      />
      <StatCard
        title="Chờ duyệt"
        value={stats.pendingRegistrations}
        icon={Clock}
      />
      <StatCard
        title="Đã duyệt"
        value={stats.approvedRegistrations}
        icon={ClipboardCheck}
      />
      <StatCard
        title="Từ chối"
        value={stats.rejectedRegistrations}
        icon={ClipboardX}
      />
      <StatCard
        title="Đã hiến máu"
        value={stats.totalDonations}
        icon={Droplet}
      />
      <StatCard
        title="Tổng phản hồi"
        value={stats.totalFeedbacks}
        icon={MessageSquare}
      />
      <StatCard
        title="Chưa trả lời"
        value={stats.pendingFeedbacks}
        icon={AlertCircle}
      />
    </div>
  );
}; 