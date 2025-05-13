"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationService } from '../services/notificationService';
import type { FormDuLieuThongBao } from '@/types';

/**
 * Hook quản lý các thông báo hiến máu
 */
export function useNotifications() {
  const queryClient = useQueryClient();

  // Lấy tất cả thông báo
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['blood-bank', 'notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  // Tạo một thông báo mới
  const createNotification = useMutation({
    mutationFn: (data: FormDuLieuThongBao) => notificationService.createNotification(data),
    onSuccess: () => {
      toast.success('Thông báo đã được tạo thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'notifications'] });
    },
    onError: (error) => {
      toast.error('Không thể tạo thông báo: ' + (error as Error).message);
    },
  });

  // Cập nhật một thông báo đã tồn tại
  const updateNotification = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormDuLieuThongBao> }) => 
      notificationService.updateNotification(id, data),
    onSuccess: () => {
      toast.success('Thông báo đã được cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'notifications'] });
    },
    onError: (error) => {
      toast.error('Không thể cập nhật thông báo: ' + (error as Error).message);
    },
  });

  // Xóa một thông báo
  const deleteNotification = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      toast.success('Thông báo đã được xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'notifications'] });
    },
    onError: (error) => {
      toast.error('Không thể xóa thông báo: ' + (error as Error).message);
    },
  });

  return {
    notifications,
    isLoading,
    error,
    createNotification,
    updateNotification,
    deleteNotification,
  };
} 