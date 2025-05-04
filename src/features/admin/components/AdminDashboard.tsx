"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdminDashboard() {
  // Dữ liệu giả lập
  const stats = {
    users: 5,
    donors: 3,
    medicalStaff: 1,
    doctors: 1,
    volunteerCenters: 0,
    bloodBankDirectors: 0,
    events: 3,
    donations: 0,
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              +0 từ tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Người hiến máu</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.donors}</div>
            <p className="text-xs text-muted-foreground">
              +0 từ tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sự kiện</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <p className="text-xs text-muted-foreground">
              +0 từ tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lượt hiến máu</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.donations}</div>
            <p className="text-xs text-muted-foreground">
              +0 từ tháng trước
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Người dùng mới đăng ký</CardTitle>
            <CardDescription>
              Những người dùng mới đăng ký trong tuần qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-md">
                  <div className="font-medium">Nguyễn Văn A</div>
                  <div className="text-sm text-muted-foreground">
                    Email: nguyenvana@example.com
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vai trò: Người hiến máu
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="font-medium">Trần Thị B</div>
                  <div className="text-sm text-muted-foreground">
                    Email: tranthib@example.com
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vai trò: Người hiến máu
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/users">Xem tất cả người dùng</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>
              Các sự kiện hiến máu sắp diễn ra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="font-medium">Hiến máu tình nguyện tại Đại học Bách Khoa</div>
                  <div className="text-sm text-muted-foreground">
                    20/08/2023 | 08:00 - 17:00
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="font-medium">Ngày hội hiến máu - Giọt hồng yêu thương</div>
                  <div className="text-sm text-muted-foreground">
                    15/09/2023 | 07:30 - 16:30
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/events">Quản lý sự kiện</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Tài nguyên hệ thống</CardTitle>
            <CardDescription>
              Quản lý các tài nguyên và cài đặt hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Link href="/admin/users">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-sm">Người dùng</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Link href="/admin/events">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">Sự kiện</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Link href="/admin/settings">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm">Cài đặt</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Thông báo hệ thống</CardTitle>
            <CardDescription>
              Các thông báo gần đây từ hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                Không có thông báo nào.
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Tạo thông báo mới
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 