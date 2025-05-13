"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarDays, ChevronRight, DropletIcon, Loader2, ClockIcon, CheckCircle, FileText } from "lucide-react";
import { useDonationHistory, useDonorStatistics } from "@/features/donor/hooks";
import { DonationHistoryTable, DonationStats } from "@/features/donor/components";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { TrangThaiHienMau, TrangThaiDangKy } from "@/types/common";
import { LichSuHienMau } from "@/features/donor/types";
import { Badge } from "@/components/ui/badge";

export default function DonorDashboard() {
  const { user } = useAuthStore();
  const { data: history = [], isLoading: isLoadingHistory } = useDonationHistory();
  const { data: statistics = null, isLoading: isLoadingStats } = useDonorStatistics();

  useEffect(() => {
    // Set the active tab for the layout
    const url = new URL(window.location.href);
    if (url.hash === '#history') {
      // Scroll to history section if the URL has the history hash
      const historySection = document.getElementById('history-section');
      if (historySection) {
        historySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <h3 className="mt-2 text-lg font-medium">Đang tải dữ liệu người dùng...</h3>
          <p className="text-sm text-muted-foreground mt-1">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Lọc lịch sử hiến máu để hiển thị
  const pendingRegistrations = history.filter(item => 
    item.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET
  );
  
  const completedDonations = history.filter(item => 
    item.TrangThaiDonDK === TrangThaiDangKy.DA_DUYET && 
    (item.TrangThaiHienMau === TrangThaiHienMau.DA_HOAN_THANH || 
     item.TrangThaiHienMau === TrangThaiHienMau.TU_CHOI)
  );

  // Display only the most recent items in each category
  const recentRegistrations = pendingRegistrations.slice(0, 3);
  const recentDonations = completedDonations.slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h2>
      <p className="text-muted-foreground">Xem thông tin hiến máu và quản lý tài khoản của bạn</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt hiến máu</CardTitle>
            <DropletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                statistics?.tongLuotHien || "0"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              lượt hiến máu đã hoàn thành
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượng máu đã hiến</CardTitle>
            <DropletIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `${statistics?.tongLuongMauHien || "0"} ml`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              tổng lượng máu đã hiến
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lần hiến gần nhất</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                statistics?.ngayHienGanNhat || "Chưa có"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics?.ngayHienGanNhat ? "ngày hiến máu gần nhất" : "bạn chưa hiến máu lần nào"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đăng ký chờ xử lý</CardTitle>
            <ClockIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingHistory ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                pendingRegistrations.length || "0"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              đăng ký đang chờ xử lý
            </p>
          </CardContent>
        </Card>
          </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Đơn đăng ký của bạn</CardTitle>
              <CardDescription>Tất cả đơn đăng ký hiến máu của bạn</CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText className="h-3 w-3" /> Đăng ký
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentRegistrations.length > 0 ? (
              <div className="space-y-3">
                {recentRegistrations.map((registration, index) => (
                  <div key={registration.MaDKiHienMau} className={`flex items-center justify-between p-3 rounded-md ${index !== recentRegistrations.length - 1 ? 'border-b' : ''}`}>
                    <div>
                      <p className="font-medium">{registration.SuKien?.ThongBao?.TieuDe || 'Sự kiện không xác định'}</p>
                      <p className="text-sm text-muted-foreground">Mã đăng ký: {registration.MaDKiHienMau}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/donor/donations/${registration.MaDKiHienMau}`}>
                        Chi tiết
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Bạn không có đơn đăng ký nào</p>
              </div>
            )}
          </CardContent>
          {recentRegistrations.length > 0 && (
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/donor/history/registrations" className="flex items-center justify-center">
                  Xem tất cả đơn đăng ký
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Lịch sử hiến máu</CardTitle>
              <CardDescription>Các đơn đăng ký đã được duyệt</CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Đã duyệt
            </Badge>
                  </CardHeader>
                  <CardContent>
            {isLoadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
                    </div>
            ) : recentDonations.length > 0 ? (
              <div className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <div key={donation.MaDKiHienMau} className={`flex items-center justify-between p-3 rounded-md ${index !== recentDonations.length - 1 ? 'border-b' : ''}`}>
                    <div>
                      <p className="font-medium">{donation.SuKien?.ThongBao?.TieuDe || 'Sự kiện không xác định'}</p>
                      <p className="text-sm text-muted-foreground">Ngày hiến: {donation.ngayHienFormatted || new Date(donation.NgayDangKi).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/donor/donations/${donation.MaDKiHienMau}`}>
                        Chi tiết
                      </Link>
                    </Button>
                  </div>
                ))}
          </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Bạn chưa có đơn nào được duyệt</p>
              </div>
            )}
          </CardContent>
          {recentDonations.length > 0 && (
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/donor/history/donations" className="flex items-center justify-center">
                  Xem tất cả đơn đã duyệt
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      <Card id="history-section">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Hoạt động hiến máu gần đây</CardTitle>
              <CardDescription>Tất cả hoạt động hiến máu mới nhất của bạn</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/donor/history/registrations">Lịch sử đăng ký</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/donor/history/donations">Lịch sử hiến máu</Link>
            </Button>
          </div>
        </div>
        </CardHeader>
        <CardContent>
        <DonationHistoryTable 
            history={history.slice(0, 5)} 
          isLoading={isLoadingHistory}
            emptyMessage="Bạn chưa có hoạt động hiến máu nào"
        />
        </CardContent>
      </Card>
    </div>
  );
} 