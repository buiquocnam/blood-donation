"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronDown, Loader2, PieChart, BarChart3 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStatistics } from '@/features/blood-bank/hooks/useStatistics';
import { BloodTypeStatsCard } from '@/features/blood-bank/components/BloodTypeStatsCard.client';

// Placeholder components (replace with actual implementations)
const BloodTypeChart = ({ data }: { data: any[] }) => (
  <div className="rounded-lg border p-6">
    <h3 className="text-lg font-medium mb-4">Biểu đồ phân bố nhóm máu</h3>
    <div className="flex justify-center py-8">
      <PieChart size={64} />
    </div>
  </div>
);

const DonationChart = ({ data }: { data: any[] }) => (
  <div className="rounded-lg border p-6">
    <h3 className="text-lg font-medium mb-4">Biểu đồ hiến máu theo tháng</h3>
    <div className="flex justify-center py-8">
      <BarChart3 size={64} />
    </div>
  </div>
);

const EventSummary = ({ data }: { data: any }) => (
  <div className="rounded-lg border p-6">
    <h3 className="text-lg font-medium mb-4">Tổng hợp sự kiện</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg bg-slate-50">
        <div className="text-2xl font-bold">{data.totalEvents}</div>
        <div className="text-sm text-muted-foreground">Tổng số sự kiện</div>
      </div>
      <div className="p-4 rounded-lg bg-blue-50">
        <div className="text-2xl font-bold text-blue-600">{data.upcomingEvents}</div>
        <div className="text-sm text-muted-foreground">Sắp diễn ra</div>
      </div>
      <div className="p-4 rounded-lg bg-amber-50">
        <div className="text-2xl font-bold text-amber-600">{data.ongoingEvents}</div>
        <div className="text-sm text-muted-foreground">Đang diễn ra</div>
      </div>
      <div className="p-4 rounded-lg bg-green-50">
        <div className="text-2xl font-bold text-green-600">{data.completedEvents}</div>
        <div className="text-sm text-muted-foreground">Hoàn thành</div>
      </div>
    </div>
  </div>
);

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    bloodTypeStats,
    isBloodTypeStatsLoading,
    donationStats,
    isDonationStatsLoading,
    report,
    isReportLoading,
    exportReportAsPDF,
    exportReportAsExcel
  } = useStatistics();

  const handleExportPDF = () => {
    exportReportAsPDF.mutate({});
  };

  const handleExportExcel = () => {
    exportReportAsExcel.mutate({});
  };

  const isLoading = isBloodTypeStatsLoading || isDonationStatsLoading || isReportLoading;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thống kê báo cáo</h1>
          <p className="text-muted-foreground">
            Tổng hợp thông tin hiến máu, phân bố nhóm máu và tình hình sự kiện
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" disabled={exportReportAsPDF.isPending || exportReportAsExcel.isPending}>
              {(exportReportAsPDF.isPending || exportReportAsExcel.isPending) ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Xuất báo cáo
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPDF} disabled={exportReportAsPDF.isPending}>
              Xuất dạng PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel} disabled={exportReportAsExcel.isPending}>
              Xuất dạng Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="bloodTypes">Nhóm máu</TabsTrigger>
          <TabsTrigger value="donations">Hiến máu</TabsTrigger>
          <TabsTrigger value="events">Sự kiện</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <div>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Tổng hợp hiến máu</CardTitle>
                  <CardDescription>Số lượng đăng ký và hiến máu thành công</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-3xl font-bold">
                        {donationStats?.tongSoDangKy || 0}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">lượt đăng ký</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-green-600">
                        {donationStats?.soLuongThanhCong || 0}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">lượt hiến thành công</span>
                    </div>
                    <div className="pt-2">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{ 
                            width: `${donationStats?.soLuongThanhCong && donationStats?.tongSoDangKy 
                              ? (donationStats.soLuongThanhCong / donationStats.tongSoDangKy) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tỷ lệ thành công: {donationStats?.soLuongThanhCong && donationStats?.tongSoDangKy 
                          ? Math.round((donationStats.soLuongThanhCong / donationStats.tongSoDangKy) * 100) 
                          : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Sự kiện hiến máu</CardTitle>
                  <CardDescription>Tổng hợp số liệu sự kiện</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-3xl font-bold">
                        {report?.eventStats.totalEvents || 0}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">sự kiện</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-xl font-bold text-blue-600">
                          {report?.eventStats.upcomingEvents || 0}
                        </span>
                        <p className="text-xs text-muted-foreground">Sắp diễn ra</p>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-amber-600">
                          {report?.eventStats.ongoingEvents || 0}
                        </span>
                        <p className="text-xs text-muted-foreground">Đang diễn ra</p>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-green-600">
                          {report?.eventStats.completedEvents || 0}
                        </span>
                        <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Nhóm máu phổ biến</CardTitle>
                  <CardDescription>Các nhóm máu được hiến nhiều nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bloodTypeStats?.slice(0, 3).map((bloodType) => (
                      <div key={bloodType.MaNhomMau} className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-bold">{bloodType.MaNhomMau}</div>
                          <div className="text-sm text-muted-foreground">{bloodType.MoTaNhomMau}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{bloodType.SoLuong} đơn vị</div>
                          <div className="text-sm text-muted-foreground">{bloodType.PhanTram.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bloodTypes">
          {isBloodTypeStatsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <div>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : (
            <BloodTypeStatsCard />
          )}
        </TabsContent>

        <TabsContent value="donations">
          {isDonationStatsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <div>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : (
            <DonationChart data={donationStats?.thongKeTheoThang || []} />
          )}
        </TabsContent>

        <TabsContent value="events">
          {isReportLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <div>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : (
            <EventSummary data={report?.eventStats || { 
              totalEvents: 0, 
              upcomingEvents: 0, 
              ongoingEvents: 0,
              completedEvents: 0 
            }} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 