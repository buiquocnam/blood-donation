"use client"

import { useState } from 'react';
import Link from 'next/link';
import { NotificationForm } from './NotificationForm';
import { RegistrationApprovalList } from './RegistrationApprovalList';
import { BloodTypeStatsCard } from './BloodTypeStatsCard.client';
import { useOrganizationRequests } from '../hooks/useOrganizationRequests';
import { useEvents } from '../hooks/useEvents';
import { useBloodBankReport } from '../hooks/useBloodBankReport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Bell, 
  CalendarCheck, 
  Users, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  BarChart4,
  Droplet,
  Calendar
} from 'lucide-react';
import { InlineLoading, Loading } from '@/components/ui/loading';
import { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien } from '@/types';

export function BloodBankDashboard() {
  const [activeTab, setActiveTab] = useState<string>('notifications');
  const { pendingRequests, isLoading: isRequestsLoading } = useOrganizationRequests();
  const { events, isLoading: isEventsLoading } = useEvents();
  const { bloodTypeStats, isBloodTypeStatsLoading } = useBloodBankReport();

  const isLoading = isRequestsLoading || isEventsLoading || isBloodTypeStatsLoading;

  // Cast to the correct type that includes TrangThaiSuKien
  const eventsWithRelations = events as DANGKITOCHUCHIENMAU_WithRelations[] | undefined;

  // Tính toán số lượng sự kiện theo trạng thái
  const upcomingEvents = eventsWithRelations?.filter(e => e.TrangThaiSuKien === TrangThaiSuKien.SAP_DIEN_RA) || [];
  const ongoingEvents = eventsWithRelations?.filter(e => e.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA) || [];
  const completedEvents = eventsWithRelations?.filter(e => e.TrangThaiSuKien === TrangThaiSuKien.DA_HOAN_THANH) || [];
  
  // Tính toán số lượng đăng ký đang chờ duyệt
  const pendingRequestsCount = pendingRequests?.length || 0;

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Ngân hàng Máu</h1>
          <p className="text-muted-foreground mt-1">Xem thống kê và quản lý các hoạt động hiến máu</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Lịch sự kiện
          </Button>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Tạo thông báo mới
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard 
          title="Đăng ký chờ duyệt" 
          value={pendingRequestsCount.toString()} 
          description="Yêu cầu từ các cơ sở" 
          icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
          trend="+5% so với tuần trước"
          linkHref="/blood-bank/events"
          linkText="Xem tất cả"
          loading={isRequestsLoading}
          color="amber"
        />
        
        <StatCard 
          title="Sự kiện sắp tới" 
          value={upcomingEvents.length.toString()} 
          description="Trong 30 ngày tới" 
          icon={<Clock className="h-4 w-4 text-blue-500" />}
          trend="+10% so với tháng trước"
          linkHref="/blood-bank/events"
          linkText="Xem lịch"
          loading={isEventsLoading}
          color="blue"
        />
        
        <StatCard 
          title="Sự kiện đang diễn ra" 
          value={ongoingEvents.length.toString()} 
          description="Đang tiến hành" 
          icon={<CalendarCheck className="h-4 w-4 text-green-500" />}
          linkHref="/blood-bank/events"
          linkText="Xem chi tiết"
          loading={isEventsLoading}
          color="green"
        />
        
        <StatCard 
          title="Tình nguyện viên" 
          value="1,203" 
          description="Người hiến máu tích cực" 
          icon={<Users className="h-4 w-4 text-purple-500" />}
          trend="+20% so với tháng trước"
          linkHref="/blood-bank/statistics"
          linkText="Xem thống kê"
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="notifications" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="notifications">Thông báo & Kêu gọi</TabsTrigger>
                <TabsTrigger value="approvals">Duyệt đăng ký</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="notifications" className="mt-0">
              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <div>
                      <CardTitle>Tạo thông báo hiến máu</CardTitle>
                      <CardDescription>
                        Gửi thông báo kêu gọi các cơ sở tình nguyện đăng ký tổ chức hiến máu
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <NotificationForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approvals" className="mt-0">
              <Card className="border-t-4 border-t-amber-500">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    <div>
                      <CardTitle>Phê duyệt đăng ký tổ chức</CardTitle>
                      <CardDescription>
                        Xét duyệt các đăng ký từ các cơ sở tình nguyện
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {isRequestsLoading ? (
                    <div className="p-6 border rounded-lg">
                      <InlineLoading text="Đang tải danh sách đăng ký..." />
                    </div>
                  ) : pendingRequestsCount === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-muted" />
                      <p>Không có yêu cầu đăng ký nào cần xét duyệt</p>
                    </div>
                  ) : (
                    <RegistrationApprovalList />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="border-t-4 border-t-red-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Droplet className="h-5 w-5 text-red-500" />
                <div>
                  <CardTitle>Thống kê nhóm máu</CardTitle>
                  <CardDescription>
                    Phân bố các nhóm máu hiện có
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isBloodTypeStatsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loading variant="spinner" text="Đang tải dữ liệu..." />
                </div>
              ) : (
                <BloodTypeStatsCard />
              )}
            </CardContent>
            <CardFooter>
              <Link href="/blood-bank/statistics" passHref>
                <Button variant="outline" className="w-full">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Xem báo cáo chi tiết
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-t-4 border-t-indigo-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                <CardTitle>Sự kiện gần đây</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isEventsLoading ? (
                <Loading variant="skeleton" count={3} />
              ) : eventsWithRelations && eventsWithRelations.length > 0 ? (
                <div className="space-y-4">
                  {eventsWithRelations.slice(0, 3).map((event) => (
                    <div key={event.IdSuKien} className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                      <div className={`w-2 h-8 rounded-full mr-3 ${
                        event.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA ? 'bg-green-500' : 
                        event.TrangThaiSuKien === TrangThaiSuKien.SAP_DIEN_RA ? 'bg-blue-500' : 
                        'bg-gray-500'}`} 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {event.CoSoTinhNguyen?.TenCoSoTinhNguyen || 'Cơ sở chưa xác định'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.ThongBao?.TgBatDauSK 
                            ? new Date(event.ThongBao.TgBatDauSK).toLocaleDateString('vi-VN')
                            : 'Chưa có thời gian'
                          }
                        </p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded bg-muted">
                        {event.TrangThaiSuKien === TrangThaiSuKien.SAP_DIEN_RA ? 'Sắp diễn ra' : 
                         event.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA ? 'Đang diễn ra' : 
                         event.TrangThaiSuKien === TrangThaiSuKien.DA_HOAN_THANH ? 'Đã hoàn thành' : 'Đã hủy'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Chưa có sự kiện nào</p>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/blood-bank/events" passHref>
                <Button variant="outline" className="w-full">
                  Xem tất cả sự kiện
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  linkHref: string;
  linkText: string;
  loading?: boolean;
  color?: 'red' | 'blue' | 'green' | 'purple' | 'amber' | 'indigo';
}

function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  linkHref, 
  linkText, 
  loading = false,
  color = 'blue'
}: StatCardProps) {
  const colorMap = {
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    amber: 'bg-amber-50 border-amber-200',
    indigo: 'bg-indigo-50 border-indigo-200',
  };
  
  return (
    <Card className={`overflow-hidden`}>
      <div className={`h-1 w-full ${color === 'red' ? 'bg-red-500' : 
                                   color === 'blue' ? 'bg-blue-500' : 
                                   color === 'green' ? 'bg-green-500' : 
                                   color === 'purple' ? 'bg-purple-500' : 
                                   color === 'amber' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loading variant="skeleton" count={2} />
        ) : (
          <>
            <div className="text-3xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-xs text-green-500 font-medium">{trend}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={linkHref} passHref>
          <Button variant="link" className="h-8 px-0 text-xs">
            {linkText}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 