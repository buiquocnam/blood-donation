'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminUsers } from '../hooks';
import { useAdminVolunteers } from '../hooks';
import { UserIcon, Building2 } from 'lucide-react';

/**
 * Component hiển thị thống kê tổng quan cho admin
 */
export function DashboardStats() {
  const { users } = useAdminUsers();
  const { volunteerCenters } = useAdminVolunteers();

  // Lọc người dùng thông thường (vai trò là ROLE_DONOR)
  const normalUsers = users.filter(user => user.MaVaiTro === 'ROLE_DONOR');

  const stats = [
    {
      title: 'Tổng người dùng',
      value: users.length,
      description: 'Tổng số tài khoản trên hệ thống',
      icon: <UserIcon className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Người hiến máu',
      value: normalUsers.length,
      description: 'Số lượng tài khoản người hiến máu',
      icon: <UserIcon className="h-5 w-5 text-green-600" />,
      color: 'bg-green-50'
    },
    {
      title: 'Cơ sở tình nguyện',
      value: volunteerCenters.length,
      description: 'Số lượng cơ sở tình nguyện đăng ký',
      icon: <Building2 className="h-5 w-5 text-purple-600" />,
      color: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color} p-2 rounded-full`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 