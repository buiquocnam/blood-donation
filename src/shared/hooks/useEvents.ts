import { useQuery } from '@tanstack/react-query';
import { eventService, EventOptions } from '../services/eventService';
import { useState } from 'react';

export const useEvents = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['events', page, limit, searchQuery, statusFilter],
    queryFn: () => eventService.getAll({ 
      page, 
      limit, 
      search: searchQuery,
      status: statusFilter 
    })
  });

  const goToPage = (newPage: number) => setPage(newPage);
  const changeLimit = (newLimit: number) => setLimit(newLimit);

  return {
    events: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    // Pagination methods
    goToPage,
    changeLimit,
    // Filter methods
    setSearchQuery,
    setStatusFilter
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