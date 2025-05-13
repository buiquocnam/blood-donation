"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThongKeNguoiHien } from "../types";
import { Droplet, Award, Calendar, Clock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DonationStatsProps {
  statistics: ThongKeNguoiHien | null;
  isLoading?: boolean;
}

export function DonationStats({ statistics, isLoading }: DonationStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-1/2 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Nếu chưa có thống kê
  if (!statistics) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
            Chưa có thống kê
          </CardTitle>
          <CardDescription>
            Chưa có dữ liệu thống kê hiến máu cho tài khoản này
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Format ngày hiến gần nhất
  const formattedLastDonationDate = statistics.ngayHienGanNhat 
    ? new Date(statistics.ngayHienGanNhat).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Chưa có";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Droplet className="mr-2 h-5 w-5 text-red-500" />
            Tổng lượt hiến máu
          </CardTitle>
          <CardDescription>Số lần bạn đã đăng ký hiến máu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{statistics.tongLuotHien}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Trong đó {statistics.tongLuotDaDuyet} lần đã được duyệt
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            Ngày hiến gần nhất
          </CardTitle>
          <CardDescription>Lần cuối bạn hiến máu thành công</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedLastDonationDate}</div>
          {statistics.ngayHienGanNhat && (
            <p className="text-sm text-muted-foreground mt-1">
              Bạn có thể hiến máu lại sau 3 tháng kể từ ngày này
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5 text-yellow-500" />
            Lượng máu đã hiến
          </CardTitle>
          <CardDescription>Tổng lượng máu bạn đã hiến</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {statistics.tongLuongMauHien ? `${statistics.tongLuongMauHien} ml` : "0 ml"}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {statistics.soGiayChungNhan} giấy chứng nhận đã được cấp
          </p>
        </CardContent>
      </Card>

      {statistics.tongLuotChoDuyet > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-500" />
              Đăng ký đang chờ duyệt
            </CardTitle>
            <CardDescription>Các đăng ký của bạn đang được xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.tongLuotChoDuyet} đăng ký</div>
            <p className="text-sm text-muted-foreground mt-1">
              Vui lòng kiểm tra thường xuyên để cập nhật trạng thái đăng ký của bạn
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 