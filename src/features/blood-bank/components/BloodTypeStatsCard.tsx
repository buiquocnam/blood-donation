"use client"

import { useState } from 'react';
import { useBloodBankReport } from '../hooks/useBloodBankReport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-time-picker';
import { Download } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B8E23', '#9932CC'];

export function BloodTypeStatsCard() {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const { 
    bloodTypeStats, 
    isBloodTypeStatsLoading,
    getBloodTypeStatsByDateRange,
    exportReport 
  } = useBloodBankReport();

  const { data: filteredStats, isLoading: isFilteredStatsLoading } = 
    dateRange.start && dateRange.end 
      ? getBloodTypeStatsByDateRange(
          dateRange.start.toISOString(), 
          dateRange.end.toISOString()
        )
      : { data: undefined, isLoading: false };

  const stats = filteredStats || bloodTypeStats;
  const isLoading = isBloodTypeStatsLoading || isFilteredStatsLoading;

  const handleExport = (format: 'pdf' | 'excel') => {
    exportReport(
      format, 
      dateRange.start?.toISOString(), 
      dateRange.end?.toISOString()
    );
  };

  const renderChart = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-64">Đang tải dữ liệu...</div>;
    }

    if (!stats || stats.length === 0) {
      return <div className="flex items-center justify-center h-64">Không có dữ liệu thống kê</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={stats}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={120}
            fill="#8884d8"
            dataKey="SoLuong"
            nameKey="MoTaNhomMau"
            label={({ MoTaNhomMau, SoLuong, PhanTram }) => `${MoTaNhomMau}: ${SoLuong} (${PhanTram.toFixed(1)}%)`}
          >
            {stats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              return [`${value} đơn vị (${props.payload.PhanTram.toFixed(1)}%)`, name];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thống kê nhóm máu</CardTitle>
        <CardDescription>
          Phân bố nhóm máu đã hiến tính đến hiện tại
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value="chart">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
              <TabsTrigger value="filter">Lọc dữ liệu</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
              >
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
          </div>

          <TabsContent value="chart" className="mt-0">
            {renderChart()}
          </TabsContent>

          <TabsContent value="filter" className="mt-0">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">Từ ngày</div>
                  <DatePicker
                    selected={dateRange.start}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, start: date }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Đến ngày</div>
                  <DatePicker
                    selected={dateRange.end}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, end: date }))}
                    minDate={dateRange.start}
                  />
                </div>
              </div>
              <Button 
                onClick={() => setDateRange({})} 
                variant="outline"
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats?.map((bloodType, index) => (
            <div
              key={bloodType.MaNhomMau}
              className="rounded-lg p-3 flex flex-col"
              style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
            >
              <div className="text-lg font-medium">{bloodType.MoTaNhomMau}</div>
              <div className="text-2xl font-bold">{bloodType.SoLuong}</div>
              <div className="text-sm text-muted-foreground">{bloodType.PhanTram.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 