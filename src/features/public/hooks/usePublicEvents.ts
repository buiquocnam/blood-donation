"use client"

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsService, PaginatedResponse } from '../services/eventsService';
import { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien } from '@/types';

/**
 * Hook để sử dụng sự kiện hiến máu public với phân trang
 */
export function usePublicEvents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TrangThaiSuKien | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Lấy tất cả sự kiện public và filtered events
  const {
    data: eventsData,
    isLoading,
    error,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['public', 'events', { page, limit, status: statusFilter, search: searchQuery }],
    queryFn: () => eventsService.getPublicEvents({
      status: statusFilter || undefined,
      search: searchQuery || undefined,
      page,
      limit
    }),
  });

  /**
   * Hook để lấy sự kiện theo ID
   * @param id ID của sự kiện
   */
  const useEventDetails = (id: string) => {
    return useQuery({
      queryKey: ['public', 'events', 'details', id],
      queryFn: () => eventsService.getEvenById(id),
      enabled: !!id,
    });
  };

  // Extract pagination and events
  const pagination = (eventsData)?.pagination;
  const events = (eventsData)?.data || [];

  // Các hàm tiện ích
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setPage(1);
  };

  const refetchAll = () => {
    refetchEvents();
  };

  /**
   * Chuyển đến trang tiếp theo
   */
  const nextPage = () => {
    if (pagination?.hasNext) {
      setPage(old => old + 1);
    }
  };

  /**
   * Chuyển đến trang trước
   */
  const previousPage = () => {
    if (pagination?.hasPrevious) {
      setPage(old => old - 1);
    }
  };

  /**
   * Chuyển đến trang cụ thể
   */
  const goToPage = (pageNumber: number) => {
    const totalPages = pagination?.totalPages || 1;
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  /**
   * Thay đổi số lượng mỗi trang
   */
  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset về trang đầu khi thay đổi số lượng mỗi trang
  };

  return {
    // Dữ liệu
    events,
    pagination,
    
    // Trạng thái
    isLoading,
    error,
    
    // Filters và phân trang
    searchQuery,
    statusFilter,
    page,
    limit,
    
    // Actions
    setSearchQuery,
    setStatusFilter,
    resetFilters,
    refetchAll,
    nextPage,
    previousPage,
    goToPage,
    changeLimit,
    
    // Custom hooks
    useEventDetails,
  };
} 