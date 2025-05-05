"use client"

import { useState } from 'react';
import Link from 'next/link';
import { NotificationForm } from './NotificationForm';
import { RegistrationApprovalList } from './RegistrationApprovalList';
import { BloodTypeStatsCard } from './BloodTypeStatsCard.client';
import { useOrganizationRequests } from '../hooks/useOrganizationRequests';
import { useEvents } from '../hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bell, CalendarCheck, Users, ChevronRight } from 'lucide-react';
import { InlineLoading, Loading } from '@/components/ui/loading';

export function BloodBankDashboard() {
  const [activeTab, setActiveTab] = useState<string>('notifications');
  const { pendingRequests, isLoading: isRequestsLoading } = useOrganizationRequests();
  const { events, isLoading: isEventsLoading } = useEvents();

  const isLoading = isRequestsLoading || isEventsLoading;

  // Tính toán số lượng sự kiện sắp tới (events với trạng thái 'upcoming')
  const upcomingEvents = events?.filter(e => e.TrangThaiSuKien === 'upcoming') || [];
  
  // Tính toán số lượng đăng ký đang chờ duyệt
  const pendingRequestsCount = pendingRequests?.length || 0;

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý Ngân hàng Máu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đăng ký chờ duyệt
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isRequestsLoading ? (
              <Loading variant="skeleton" count={2} />
            ) : (
              <>
                <div className="text-2xl font-bold">{pendingRequestsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Yêu cầu từ các cơ sở tình nguyện
                </p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/blood-bank/events" passHref>
              <Button variant="link" className="h-8 px-0 text-xs">
                Xem chi tiết
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sự kiện sắp tới
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEventsLoading ? (
              <Loading variant="skeleton" count={2} />
            ) : (
              <>
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                <p className="text-xs text-muted-foreground">
                  Trong vòng 30 ngày tới
                </p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/blood-bank/events" passHref>
              <Button variant="link" className="h-8 px-0 text-xs">
                Xem chi tiết
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tình nguyện viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,203</div>
            <p className="text-xs text-muted-foreground">
              +20% so với tháng trước
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/blood-bank/statistics" passHref>
              <Button variant="link" className="h-8 px-0 text-xs">
                Xem thống kê
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="notifications" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
              <TabsTrigger value="approvals">Duyệt đăng ký</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Tạo thông báo hiến máu</CardTitle>
                  <CardDescription>
                    Tạo thông báo mới để thông báo cho các cơ sở tình nguyện
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approvals">
              {isRequestsLoading ? (
                <div className="p-6 border rounded-lg">
                  <InlineLoading text="Đang tải danh sách đăng ký..." />
                </div>
              ) : (
                <RegistrationApprovalList />
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhóm máu</CardTitle>
              <CardDescription>
                Phân bố các nhóm máu hiện có
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
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
                  Xem chi tiết thống kê
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 