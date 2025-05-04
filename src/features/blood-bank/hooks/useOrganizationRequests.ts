"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationRequestService } from '../services/organizationRequestService';
import { eventService } from '../services/eventService';
import type { EventFormData } from '../types';

// Quản lý các đăng ký từ các cơ sở tình nguyện
export function useOrganizationRequests() {
  const queryClient = useQueryClient();

  // Lấy danh sách tất cả các đăng ký
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['blood-bank', 'organization-requests'],
    queryFn: () => organizationRequestService.getRegistrationRequests(),
  });

  // Lấy danh sách các đăng ký đang chờ duyệt
  const { data: pendingRequests, isLoading: isPendingLoading } = useQuery({
    queryKey: ['blood-bank', 'organization-requests', 'pending'],
    queryFn: () => organizationRequestService.getPendingRequests(),
  });

  // Phê duyệt một đăng ký
  const approveRequest = useMutation({
    mutationFn: (id: string) => organizationRequestService.approveRequest(id),
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
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      organizationRequestService.rejectRequest(id, reason),
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
    mutationFn: ({ registrationId, eventData }: { registrationId: string; eventData: EventFormData }) => 
      eventService.createEvent(registrationId, eventData),
    onSuccess: () => {
      toast.success('Sự kiện hiến máu đã được tạo thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'organization-requests'] });
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
    approveRequest,
    rejectRequest,
    createEvent,
    getRequestsByNotification,
  };
} 