'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { COSOTINHNGUYEN_WithLocation } from '@/types';
import { 
  getAllVolunteerCenters, 
  getVolunteerCentersByFilter, 
  updateVolunteerCenterStatus as apiUpdateVolunteerCenterStatus,
  deleteVolunteerCenter as apiDeleteVolunteerCenter
} from '../services';
import { VolunteerCenterFilter } from '../types';

/**
 * Hook quản lý danh sách cơ sở tình nguyện trong giao diện Admin
 */
export function useAdminVolunteers() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<VolunteerCenterFilter>({});

  // Query để lấy danh sách cơ sở tình nguyện theo bộ lọc
  const {
    data: volunteerCenters = [],
    isLoading,
    error,
    refetch
  } = useQuery<COSOTINHNGUYEN_WithLocation[]>({
    queryKey: ['admin', 'volunteer-centers', filter],
    queryFn: () => getVolunteerCentersByFilter(filter)
  });

  // Mutation để cập nhật trạng thái cơ sở tình nguyện
  const updateStatusMutation = useMutation({
    mutationFn: ({ centerId, status }: { centerId: string; status: boolean }) => 
      apiUpdateVolunteerCenterStatus(centerId, status),
    onSuccess: () => {
      // Làm mới dữ liệu sau khi cập nhật
      queryClient.invalidateQueries({ queryKey: ['admin', 'volunteer-centers'] });
    }
  });

  // Mutation để xóa cơ sở tình nguyện
  const deleteCenterMutation = useMutation({
    mutationFn: (centerId: string) => apiDeleteVolunteerCenter(centerId),
    onSuccess: () => {
      // Làm mới dữ liệu sau khi xóa
      queryClient.invalidateQueries({ queryKey: ['admin', 'volunteer-centers'] });
    }
  });

  // Hàm tiện ích để sử dụng trực tiếp
  const updateStatus = (centerId: string, status: boolean) => {
    updateStatusMutation.mutate({ centerId, status });
  };

  return {
    volunteerCenters,
    isLoading,
    error,
    filter,
    setFilter,
    refetch,
    updateStatus,
    deleteCenter: deleteCenterMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteCenterMutation.isPending
  };
} 