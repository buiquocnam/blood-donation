"use client";

import { useState, useEffect } from "react";
import { NotificationForm, NotificationList } from "@/features/blood-bank";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  XIcon,
  Bell,
  CalendarRange,
  Users,
  Megaphone,
  AlertCircle,
  Building2
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterStatus } from "@/features/blood-bank/components/NotificationList";

export default function NotificationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const tabs: FilterStatus[] = ['all', 'active', 'expired'];

  const handleTabChange = (value: string) => {
    console.log("NotificationsPage - Tab changed to:", value);
    setActiveTab(value);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Quản lý Thông báo</h1>
          </div>
          <p className="text-muted-foreground">
            Tạo và quản lý các thông báo kêu gọi hiến máu đến các cơ sở tình nguyện
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className={`shrink-0 ${showForm ? "bg-red-500 hover:bg-red-600" : "bg-primary"}`}
        >
          {showForm ? (
            <>
              <XIcon className="h-4 w-4 mr-2" />
              Đóng biểu mẫu
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Tạo thông báo mới
            </>
          )}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-8">
          {showForm && (
            <Card className="overflow-hidden border-primary/10 shadow-lg">
              <div className="bg-primary h-1 w-full" />
              <CardHeader className="bg-primary/5 border-b px-6 py-5">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-primary text-xl">
                      Tạo thông báo kêu gọi hiến máu
                    </CardTitle>
                    <CardDescription>
                      Thông báo sẽ được gửi đến tất cả các trường và cơ sở đã đăng ký
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <NotificationForm onSuccess={() => setShowForm(false)} />
              </CardContent>
            </Card>
          )}

          <div>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  Danh sách thông báo
                </h2>
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                  <TabsTrigger value="expired">Đã hết hạn</TabsTrigger>
                </TabsList>
              </div>

              {tabs.map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <Card>
                    {activeTab === tab && (
                      <CardContent className="p-0">
                        <NotificationList
                          {...(tab !== 'all' && { filterStatus: tab })}
                        />
                      </CardContent>
                    )}
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Lịch hiến máu tới đây</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                <div className="flex items-center p-3 rounded-lg border bg-muted/50">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">Trường ĐH Sư phạm Kỹ thuật</p>
                    <p className="text-xs text-muted-foreground">
                      25/09/2023 - 50 người đăng ký
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 rounded-lg border bg-muted/50">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">Trường ĐH Khoa học Tự nhiên</p>
                    <p className="text-xs text-muted-foreground">
                      15/10/2023 - 75 người đăng ký
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a href="/blood-bank/events">Xem tất cả</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Thống kê đăng ký</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <div className="text-sm text-muted-foreground">Tổng số thông báo</div>
                  <div className="text-2xl font-bold">12</div>
                </div>
                <Bell className="h-8 w-8 text-muted" />
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <div className="text-sm text-muted-foreground">Đăng ký chờ duyệt</div>
                  <div className="text-2xl font-bold">3</div>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a href="/blood-bank/statistics">Xem chi tiết</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
