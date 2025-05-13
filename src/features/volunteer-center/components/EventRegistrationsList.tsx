'use client';

import { Input } from '@/components/ui/input';
import { EventRegistrationCard } from './EventRegistrationCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilteredEventRegistrations, useCancelEventRegistration } from '../hooks';
import { useAnnouncements } from '../hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { DANGKITOCHUCHIENMAU, THONGBAODKTOCHUC } from '@/types';
import { TrangThaiDangKy, TrangThaiSuKien } from '@/types/common';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface EventRegistrationsListProps {
  centerId: string;
}

export function EventRegistrationsList({ centerId }: EventRegistrationsListProps) {
  const { registrations, isLoading, filters, setFilters } = useFilteredEventRegistrations(centerId);
  const { data: announcements } = useAnnouncements();
  const { mutate: cancelRegistration, isPending } = useCancelEventRegistration();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Handler for search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };

  // Handler for status selection
  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value === "all" ? null : (value as TrangThaiDangKy),
    });
  };

  // Handler for event status selection
  const handleEventStatusChange = (value: string) => {
    setFilters({
      ...filters,
      eventStatus: value === "all" ? null : (value as TrangThaiSuKien),
    });
  };

  // Handler for date range change - simplified
  const handleResetDateRange = () => {
    setFilters({
      ...filters,
      dateRange: {
        from: null,
        to: null,
      },
    });
  };

  // Handler for cancel button click
  const handleCancelClick = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  // Handler for confirming cancellation
  const handleConfirmCancel = () => {
    if (selectedEventId) {
      cancelRegistration({ 
        eventId: selectedEventId,
        centerId
      }, {
        onSuccess: () => {
          setSelectedEventId(null);
        }
      });
    }
  };

  // Helper to find the announcement for a registration
  const getAnnouncementForRegistration = (registration: DANGKITOCHUCHIENMAU): THONGBAODKTOCHUC | undefined => {
    return announcements?.find(a => a.IdThongBaoDK === registration.IdThongBaoDK);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Tìm kiếm đăng ký..."
          value={filters.searchTerm}
          onChange={handleSearch}
        />
        <Select
          value={filters.status ? filters.status : "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái đăng ký" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={TrangThaiDangKy.CHO_DUYET}>Chờ duyệt</SelectItem>
            <SelectItem value={TrangThaiDangKy.DA_DUYET}>Đã duyệt</SelectItem>
            <SelectItem value={TrangThaiDangKy.TU_CHOI}>Từ chối</SelectItem>
            <SelectItem value="canceled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.eventStatus ? filters.eventStatus : "all"}
          onValueChange={handleEventStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái sự kiện" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={TrangThaiSuKien.SAP_DIEN_RA}>Sắp diễn ra</SelectItem>
            <SelectItem value={TrangThaiSuKien.DANG_DIEN_RA}>Đang diễn ra</SelectItem>
            <SelectItem value={TrangThaiSuKien.DA_HOAN_THANH}>Đã hoàn thành</SelectItem>
            <SelectItem value={TrangThaiSuKien.DA_HUY}>Đã hủy</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">Tính năng lọc theo ngày đang được cập nhật</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[220px] w-full" />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="flex justify-center p-8 text-center">
          <p className="text-muted-foreground">Không tìm thấy lịch sử đăng ký nào phù hợp với tiêu chí tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {registrations.map((registration) => (
            <EventRegistrationCard
              key={registration.IdSuKien}
              registration={registration}
              announcement={getAnnouncementForRegistration(registration)}
              onCancel={handleCancelClick}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={!!selectedEventId} 
        onOpenChange={(open) => !open && setSelectedEventId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy đăng ký</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy đăng ký tổ chức hiến máu này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} disabled={isPending}>
              {isPending ? 'Đang xử lý...' : 'Xác nhận hủy'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 