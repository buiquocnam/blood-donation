"use client"

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../services/eventsService';
import { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien } from '@/types';
import { DANGKITOCHUCHIENMAU } from '@/types';
/**
 * Hook để sử dụng sự kiện hiến máu public
 */
export function usePublicEvents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TrangThaiSuKien | null>(null);

  // Lấy tất cả sự kiện public
  const {
    data: allEvents,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ['public', 'events'],
    queryFn: () => eventsService.getPublicEvents(),
  });

  // Lấy sự kiện theo ID
  const getEventById = (id: string) => {
    return useQuery({
      queryKey: ['public', 'events', id],
      queryFn: () => eventsService.getEventById(id),
      enabled: !!id,
    });
  };

  // Lấy sự kiện theo trạng thái
  const {
    data: filteredEvents,
    isLoading: isFilteredEventsLoading,
    error: filteredEventsError,
  } = useQuery({
    queryKey: ['public', 'events', 'filtered', { status: statusFilter, search: searchQuery }],
    queryFn: async () => {
      if (statusFilter && !searchQuery) {
        return eventsService.getEventsByStatus(statusFilter);
      }
      
      if (searchQuery && !statusFilter) {
        return eventsService.searchEvents(searchQuery);
      }
      
      if (statusFilter && searchQuery) {
        const searchResults = await eventsService.searchEvents(searchQuery);
        return searchResults.filter(event => event.TrangThaiSuKien === statusFilter);
      }
      
      return eventsService.getPublicEvents();
    },
    enabled: !!(statusFilter || searchQuery),
  });

  // Lấy tổng quan về sự kiện
  const {
    data: eventsSummary,
    isLoading: isEventsSummaryLoading,
    error: eventsSummaryError,
  } = useQuery({
    queryKey: ['public', 'events', 'summary'],
    queryFn: () => eventsService.getEventsSummary(),
  });

  // Các hàm tiện ích
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
  };

  return {
    // Dữ liệu
    allEvents,
    filteredEvents: filteredEvents || allEvents,
    eventsSummary,
    
    // Trạng thái
    isEventsLoading,
    isFilteredEventsLoading,
    isEventsSummaryLoading,
    
    // Lỗi
    eventsError,
    filteredEventsError,
    eventsSummaryError,
    
    // Filters
    searchQuery,
    statusFilter,
    
    // Actions
    setSearchQuery,
    setStatusFilter,
    resetFilters,
    getEventById,
  };
} 