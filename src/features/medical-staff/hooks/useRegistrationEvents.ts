'use client';

import { useQuery } from '@tanstack/react-query';
import { MedicalStaffService } from '../services';
import { DANGKITOCHUCHIENMAU } from '@/types';

/**
 * Hook để lấy danh sách sự kiện hiến máu
 * @returns Danh sách sự kiện, trạng thái loading và error
 */
export function useRegistrationEvents() {
  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery<DANGKITOCHUCHIENMAU[]>({
    queryKey: ['blood-donation-events'],
    queryFn: () => MedicalStaffService.getBloodDonationEvents(),
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  // Sắp xếp sự kiện từ mới nhất đến cũ nhất theo ngày đăng ký
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.NgayDangKi).getTime() - new Date(a.NgayDangKi).getTime()
  );

  return {
    events: sortedEvents,
    isLoading,
    error,
    refetch
  };
} 