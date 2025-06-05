'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService,  } from '../services/registrationService';
import { 
  UpdateHealthStatusRequest,
  UpdateBloodDonationStatusRequest 
} from '../types';
import { TrangThaiDangKy, TrangThaiHienMau, TrangThaiSucKhoe, DANGKIHIENMAU_WithRelations } from '@/types';

interface UseRegistrationsOptions {
  filters?: {
    eventId?: string;
  };
}

export const useRegistrations = (options?: UseRegistrationsOptions) => {
  const queryClient = useQueryClient();
  const eventId = options?.filters?.eventId;

  // Query để lấy danh sách đăng ký
  const {
    data: registrations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['medical-staff', 'registrations', eventId],
    queryFn: () => registrationService.getByEventId(eventId),
    enabled: !!eventId
  });

  // Mutation cập nhật trạng thái đăng ký
  const updateStatusMutation = useMutation({
    mutationFn: ({ status, registrationId }: { status: TrangThaiDangKy; registrationId: string }) => 
      registrationService.updateStatus(status, registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-staff', 'registrations'] });
    }
  });


  // Mutation cập nhật trạng thái hiến máu
  const updateBloodDonationStatusMutation = useMutation({
    mutationFn: (request: UpdateBloodDonationStatusRequest) => 
      registrationService.updateBloodDonationStatus(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-staff', 'registrations'] });
    }
  });

  // Các hàm helper để gọi mutation
  const updateStatus = (id: string, status: TrangThaiDangKy) => {
    updateStatusMutation.mutate({ status, registrationId: id });
  };


  const updateBloodDonationStatus = (id: string, status: TrangThaiHienMau, note?: string) => {
    updateBloodDonationStatusMutation.mutate({ registrationId: id, status, note });
  };

  return {
    registrations: registrations?.data || [],
    pagination: registrations?.pagination,
    isLoading,
    error,
    updateStatus,
    updateBloodDonationStatus,
    isUpdating: 
      updateStatusMutation.isPending || 
      updateBloodDonationStatusMutation.isPending
  };
};