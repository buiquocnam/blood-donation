"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { eventService } from '../services/eventService';
import type { DANGKITOCHUCHIENMAU, FormDuLieuSuKien, TrangThaiSuKien } from '../types';

// Quản lý các sự kiện hiến máu
export function useEvents() {
  const queryClient = useQueryClient();

  // Lấy tất cả các sự kiện
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['blood-bank', 'events'],
    queryFn: () => eventService.getEvents(),
  });

  // Lấy sự kiện theo trạng thái
  const getEventsByStatus = (status: TrangThaiSuKien) => {
    return useQuery({
      queryKey: ['blood-bank', 'events', status],
      queryFn: () => eventService.getEventsByStatus(status),
    });
  };

  // Lấy sự kiện cụ thể theo ID
  const getEventById = (id: string) => {
    return useQuery({
      queryKey: ['blood-bank', 'events', id],
      queryFn: () => eventService.getEventById(id),
      enabled: !!id,
    });
  };

  // Cập nhật chi tiết sự kiện
  const updateEvent = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormDuLieuSuKien> }) => 
      eventService.updateEvent(id, data),
    onSuccess: () => {
      toast.success('Sự kiện đã được cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'events'] });
    },
    onError: (error) => {
      toast.error('Không thể cập nhật sự kiện: ' + (error as Error).message);
    },
  });

  // Hủy sự kiện
  const cancelEvent = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      eventService.cancelEvent(id, reason),
    onSuccess: () => {
      toast.success('Sự kiện đã bị hủy');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'events'] });
    },
    onError: (error) => {
      toast.error('Không thể hủy sự kiện: ' + (error as Error).message);
    },
  });

  // Đánh dấu sự kiện là hoàn thành
  const completeEvent = useMutation({
    mutationFn: (id: string) => eventService.completeEvent(id),
    onSuccess: () => {
      toast.success('Sự kiện đã được đánh dấu là hoàn thành');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'events'] });
    },
    onError: (error) => {
      toast.error('Không thể hoàn thành sự kiện: ' + (error as Error).message);
    },
  });

  return {
    events,
    isLoading,
    error,
    getEventsByStatus,
    getEventById,
    updateEvent,
    cancelEvent,
    completeEvent,
  };
} 