"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { eventService } from '../services/eventService';
import type { EventFormData } from '../types';

/**
 * Hook for managing blood donation events
 */
export function useEvents() {
  const queryClient = useQueryClient();

  // Get all events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['blood-bank', 'events'],
    queryFn: () => eventService.getEvents(),
  });

  // Get events by status
  const getEventsByStatus = (status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled') => {
    return useQuery({
      queryKey: ['blood-bank', 'events', status],
      queryFn: () => eventService.getEventsByStatus(status),
    });
  };

  // Get specific event by ID
  const getEventById = (id: string) => {
    return useQuery({
      queryKey: ['blood-bank', 'events', id],
      queryFn: () => eventService.getEventById(id),
      enabled: !!id,
    });
  };

  // Update event details
  const updateEvent = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EventFormData> }) => 
      eventService.updateEvent(id, data),
    onSuccess: () => {
      toast.success('Sự kiện đã được cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'events'] });
    },
    onError: (error) => {
      toast.error('Không thể cập nhật sự kiện: ' + (error as Error).message);
    },
  });

  // Cancel an event
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

  // Mark event as complete
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