"use client"

import { useState } from 'react';
import { useBloodBankReport } from '../hooks/useBloodBankReport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-time-picker';
import { Download, Loader2, CalendarRange } from 'lucide-react';
import { format, isAfter } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B8E23', '#9932CC'];

export function BloodTypeStatsCard() {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');
  
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
  
  const isDateRangeValid = dateRange.start && dateRange.end && 
    isAfter(dateRange.end, dateRange.start);

  const clearFilters = () => {
    setDateRange({});
    setActiveTab('chart');
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setIsExporting(true);
      await exportReport(
        format, 
        dateRange.start?.toISOString(), 
        dateRange.end?.toISOString()
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <span>Đang tải dữ liệu...</span>
        </div>
      );
    }

    if (!stats || stats.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <CalendarRange className="h-12 w-12 mb-2" />
          <span>Không có dữ liệu thống kê</span>
        </div>
      );
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

  // Hiển thị thanh trạng thái khi đang lọc theo ngày
  const renderDateRangeIndicator = () => {
    if (dateRange.start && dateRange.end) {
      return (
        <div className="bg-secondary/30 text-sm rounded-lg p-2 flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarRange className="h-4 w-4 mr-2" />
            <span>
              Lọc từ {format(dateRange.start, 'dd/MM/yyyy')} đến {format(dateRange.end, 'dd/MM/yyyy')}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 pb-2">
        <CardTitle>Thống kê nhóm máu</CardTitle>
        <CardDescription>
          Phân bố nhóm máu đã hiến tính đến hiện tại
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {renderDateRangeIndicator()}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
              <TabsTrigger value="filter">Lọc dữ liệu</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={isExporting || isLoading}
              >
                {isExporting ? 
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
                  <Download className="h-4 w-4 mr-1" />
                }
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                disabled={isExporting || isLoading}
              >
                {isExporting ? 
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
                  <Download className="h-4 w-4 mr-1" />
                }
                Excel
              </Button>
            </div>
          </div>

          <TabsContent value="chart" className="mt-0">
            {renderChart()}
          </TabsContent>

          <TabsContent value="filter" className="mt-0">
            <div className="flex flex-col space-y-4 p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={!dateRange.start ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button 
                  onClick={clearFilters} 
                  variant="outline"
                  className="w-full"
                >
                  Xóa bộ lọc
                </Button>
                <Button 
                  onClick={() => setActiveTab('chart')}
                  className="w-full"
                  disabled={!isDateRangeValid}
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            // Loading skeleton for blood type cards
            Array(8).fill(0).map((_, index) => (
              <div 
                key={index}
                className="rounded-lg p-3 flex flex-col shadow-sm border animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-10"></div>
              </div>
            ))
          ) : (
            stats?.map((bloodType, index) => (
              <div
                key={bloodType.MaNhomMau}
                className="rounded-lg p-3 flex flex-col shadow-sm border transition-all hover:shadow-md"
                style={{ 
                  borderColor: COLORS[index % COLORS.length], 
                  backgroundColor: `${COLORS[index % COLORS.length]}10` 
                }}
              >
                <div className="text-lg font-medium">{bloodType.MaNhomMau}</div>
                <div className="text-sm text-muted-foreground">{bloodType.MoTaNhomMau}</div>
                <div className="text-2xl font-bold mt-1">{bloodType.SoLuong}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <div 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  {bloodType.PhanTram.toFixed(1)}%
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 