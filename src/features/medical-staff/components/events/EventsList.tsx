'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, FilterIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EventCard } from '@/features/public/components';
import { usePublicEvents } from '@/features/public/hooks';
import { formatDate } from '@/lib/utils';
import { TrangThaiSuKien } from '@/types';
/**
 * Component hiển thị danh sách sự kiện hiến máu
 */
export function EventsList() {
  const router = useRouter();
  const { events, isLoading, error } = usePublicEvents();
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Xử lý chuyển hướng đến trang chi tiết sự kiện
  const handleViewEvent = (event: any) => {
    router.push(`/medical-staff/registrations/${event.IdSuKien}`);
  };

  // Lọc sự kiện theo từ khóa tìm kiếm và trạng thái
  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      search.trim() === '' || 
      event.IdSuKien.toLowerCase().includes(search.toLowerCase()) || 
      (event.IDCoSoTinhNguyen && event.IDCoSoTinhNguyen.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = 
      selectedStatuses.length === 0 || 
      selectedStatuses.includes(event.TrangThaiSuKien);
    
    return matchesSearch && matchesStatus;
  });

  // Lấy danh sách các trạng thái duy nhất từ sự kiện
  const uniqueStatuses = Array.from(new Set(events.map(event => event.TrangThaiSuKien)));

  // Ánh xạ trạng thái sang tên hiển thị tiếng Việt
  const getStatusName = (status: string) => {
    switch(status) {
      case TrangThaiSuKien.SAP_DIEN_RA:
        return "Sắp diễn ra";
      case TrangThaiSuKien.DANG_DIEN_RA:
        return "Đang diễn ra";
      case TrangThaiSuKien.DA_HOAN_THANH:
        return "Đã hoàn thành";
      case TrangThaiSuKien.DA_HUY:
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-red-500">
        <p className="text-lg font-medium">Đã xảy ra lỗi khi tải danh sách sự kiện hiến máu</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sự kiện hiến máu</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sự kiện..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Lọc theo trạng thái">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {uniqueStatuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatuses([...selectedStatuses, status]);
                    } else {
                      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                    }
                  }}
                >
                  {getStatusName(status)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CalendarIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Không tìm thấy sự kiện</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Không có sự kiện nào phù hợp với điều kiện tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div key={event.IdSuKien} className="cursor-pointer">
              <EventCard 
                event={event} 
                variant="compact" 
                role="staff" 
                onStaffAction={handleViewEvent}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 