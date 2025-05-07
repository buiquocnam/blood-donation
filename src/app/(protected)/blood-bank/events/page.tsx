"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, MapPinIcon, UsersIcon, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { eventService } from '@/features/blood-bank/services/eventService';
import { RegistrationApprovalList } from '@/features/blood-bank/components/RegistrationApprovalList';
import type { DANGKITOCHUCHIENMAU_WithRelations } from '@/types';

const ITEMS_PER_PAGE = 6;

export default function EventsPage() {
  // States
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch events data
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['blood-bank', 'events'],
    queryFn: () => eventService.getEvents(),
  });

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  // Filter and search events
  const filteredEvents = events.filter((event: DANGKITOCHUCHIENMAU_WithRelations) => {
    let matchesTab = true;
    
    // Filter by tab
    if (currentTab === 'pending') {
      matchesTab = event.TinhTrangDK === 'pending';
    } else if (currentTab === 'approved') {
      matchesTab = event.TinhTrangDK === 'approved';
    }
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      (event.CoSoTinhNguyen?.TenCoSoTinhNguyen || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.IdSuKien || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Get status badge component
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700">Sắp diễn ra</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-700">Đang diễn ra</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">Đã kết thúc</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>;
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sự kiện hiến máu</h1>
        <p className="text-muted-foreground">
          Quản lý các sự kiện hiến máu và đăng ký tổ chức hiến máu.
        </p>
      </div>

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">Tất cả sự kiện</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
            <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm theo tên cơ sở..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="pending" className="mt-0">
          <RegistrationApprovalList />
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
                <div>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : paginatedEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEvents.map((event: DANGKITOCHUCHIENMAU_WithRelations) => (
                  <Card key={event.IdSuKien} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold">
                          Sự kiện {event.IdSuKien}
                        </CardTitle>
                        {getStatusBadge(event.TrangThaiSuKien)}
                      </div>
                      <CardDescription>
                        {event.CoSoTinhNguyen?.TenCoSoTinhNguyen || 'Chưa xác định'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {event.ThongBao?.TgBatDauSK 
                            ? format(new Date(event.ThongBao.TgBatDauSK), 'dd/MM/yyyy HH:mm', { locale: vi })
                            : 'Không xác định'} - 
                          {event.ThongBao?.TgKetThucSK
                            ? format(new Date(event.ThongBao.TgKetThucSK), 'dd/MM/yyyy HH:mm', { locale: vi })
                            : 'Không xác định'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {event.CoSoTinhNguyen?.DiaChi || 'Chưa xác định địa điểm'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          Đã đăng ký: {event.SoLuongDK || 0}, Đã hiến máu: {event.SoLuongDDK || 0}
                        </span>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button size="sm" variant="outline">Chi tiết</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-1">Không tìm thấy sự kiện nào</p>
              <p className="text-sm text-gray-400">
                Không có sự kiện nào phù hợp với tiêu chí tìm kiếm của bạn.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
                <div>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : paginatedEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEvents.map((event: DANGKITOCHUCHIENMAU_WithRelations) => (
                  <Card key={event.IdSuKien} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold">
                          Sự kiện {event.IdSuKien}
                        </CardTitle>
                        {getStatusBadge(event.TrangThaiSuKien)}
                      </div>
                      <CardDescription>
                        {event.CoSoTinhNguyen?.TenCoSoTinhNguyen || 'Chưa xác định'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {event.ThongBao?.TgBatDauSK 
                            ? format(new Date(event.ThongBao.TgBatDauSK), 'dd/MM/yyyy HH:mm', { locale: vi })
                            : 'Không xác định'} - 
                          {event.ThongBao?.TgKetThucSK
                            ? format(new Date(event.ThongBao.TgKetThucSK), 'dd/MM/yyyy HH:mm', { locale: vi })
                            : 'Không xác định'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {event.CoSoTinhNguyen?.DiaChi || 'Chưa xác định địa điểm'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          Đã đăng ký: {event.SoLuongDK || 0}, Đã hiến máu: {event.SoLuongDDK || 0}
                        </span>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button size="sm" variant="outline">Chi tiết</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-1">Không tìm thấy sự kiện nào</p>
              <p className="text-sm text-gray-400">
                Không có sự kiện nào phù hợp với tiêu chí tìm kiếm của bạn.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
