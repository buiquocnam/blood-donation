"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationRequestService } from '../services/organizationRequestService';
import { eventService } from '../services/eventService';
import type { DANGKITOCHUCHIENMAU_WithRelations } from '@/types';
import { useState } from "react";

// Quản lý các đăng ký từ các cơ sở tình nguyện
export function useOrganizationRequests() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<DANGKITOCHUCHIENMAU_WithRelations | null>(null);

  // Lấy danh sách tất cả các đăng ký
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['blood-bank', 'organization-requests'],
    queryFn: () => organizationRequestService.getRegistrationRequests(),
  });

  // Lấy danh sách các đăng ký đang chờ duyệt
  const {
    data: pendingRequests,
    isLoading: isPendingLoading,
    error: pendingError,
  } = useQuery({
    queryKey: ["organization-requests", "pending"],
    queryFn: async () => {
      return await organizationRequestService.getPendingRequests();
    },
  });

  // Phê duyệt một đăng ký
  const approveRequest = useMutation({
    mutationFn: organizationRequestService.approveRequest,
    onSuccess: () => {
      toast.success('Đăng ký đã được phê duyệt thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'organization-requests'] });
    },
    onError: (error) => {
      toast.error('Không thể phê duyệt đăng ký: ' + (error as Error).message);
    },
  });

  // Từ chối một đăng ký
  const rejectRequest = useMutation({
    mutationFn: (params: { id: string; reason: string }) => 
      organizationRequestService.rejectRequest(params.id, params.reason),
    onSuccess: () => {
      toast.success('Đăng ký đã bị từ chối');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'organization-requests'] });
    },
    onError: (error) => {
      toast.error('Không thể từ chối đăng ký: ' + (error as Error).message);
    },
  });

  // Tạo một sự kiện từ đăng ký đã được phê duyệt
  const createEvent = useMutation({
    mutationFn: (params: { registrationId: string; eventData: any }) => 
      organizationRequestService.createEvent(params.registrationId, params.eventData),
    onSuccess: () => {
      toast.success('Sự kiện hiến máu đã được tạo thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'organization-requests'] });
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'events'] });
    },
    onError: (error) => {
      toast.error('Không thể tạo sự kiện hiến máu: ' + (error as Error).message);
    },
  });

  // Lấy danh sách các đăng ký từ một thông báo cụ thể
  const getRequestsByNotification = (notificationId: string) => {
    return useQuery({
      queryKey: ['blood-bank', 'notifications', notificationId, 'requests'],
      queryFn: () => organizationRequestService.getRequestsByNotificationId(notificationId),
    });
  };

  return {
    requests,
    isLoading,
    error,
    pendingRequests,
    isPendingLoading,
    pendingError,
    selectedRequest,
    setSelectedRequest,
    approveRequest,
    rejectRequest,
    createEvent,
    getRequestsByNotification,
  };
} 