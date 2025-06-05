import { useQuery } from '@tanstack/react-query';
import { eventService, EventOptions } from '../services/eventService';

export const useEvents = (page = 1, limit = 10, filters?: EventOptions) => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['events', page, limit, filters],
    queryFn: () => eventService.getAll({ page, limit, ...filters })
  });

  return {
    events: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch
  };
};

export const useEvent = (id: string) => {
  const {
    data: event,
    isLoading,
    error
  } = useQuery({
    queryKey: ['events', id],
    queryFn: () => eventService.getById(id),
    enabled: !!id
  });

  return {
    event,
    isLoading,
    error
  };
};

export const useUpcomingEvents = (limit = 5) => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['events', 'upcoming', limit],
    queryFn: () => eventService.getUpcoming(limit)
  });

  return {
    events: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error
  };
};

export const useFeaturedEvents = () => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: () => eventService.getFeatured()
  });

  return {
    events: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error
  };
}; 