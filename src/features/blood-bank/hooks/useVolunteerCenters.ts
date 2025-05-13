'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { volunteerCenterService } from '../services/volunteerCenterService';
import type { COSOTINHNGUYEN } from '@/types';

/**
 * Hook quản lý cơ sở tình nguyện
 */
export function useVolunteerCenters() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy danh sách cơ sở tình nguyện đã duyệt
  const {
    data: approvedCenters = [],
    isLoading: isLoadingApproved,
    error: approvedError,
    refetch: refetchApproved
  } = useQuery<COSOTINHNGUYEN[]>({
    queryKey: ['blood-bank', 'volunteer-centers', 'approved'],
    queryFn: () => volunteerCenterService.getApprovedCenters()
  });

  // Lấy danh sách cơ sở tình nguyện chờ duyệt
  const {
    data: pendingCenters = [],
    isLoading: isLoadingPending,
    error: pendingError,
    refetch: refetchPending
  } = useQuery<COSOTINHNGUYEN[]>({
    queryKey: ['blood-bank', 'volunteer-centers', 'pending'],
    queryFn: () => volunteerCenterService.getPendingCenters()
  });

  // Mutation để phê duyệt cơ sở tình nguyện
  const approveMutation = useMutation({
    mutationFn: (centerId: string) => volunteerCenterService.approveCenter(centerId),
    onSuccess: (data) => {
      toast.success(`Phê duyệt cơ sở tình nguyện thành công: ${data.TenCoSoTinhNguyen}`);
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'volunteer-centers'] });
    },
    onError: (error) => {
      toast.error(`Lỗi khi phê duyệt: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi'}`);
    }
  });

  // Mutation để từ chối cơ sở tình nguyện
  const rejectMutation = useMutation({
    mutationFn: ({ centerId, reason }: { centerId: string; reason: string }) => 
      volunteerCenterService.rejectCenter(centerId, reason),
    onSuccess: () => {
      toast.success(`Đã từ chối cơ sở tình nguyện`);
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'volunteer-centers'] });
    },
    onError: (error) => {
      toast.error(`Lỗi khi từ chối: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi'}`);
    }
  });

  // Mutation để cập nhật thông tin cơ sở
  const updateMutation = useMutation({
    mutationFn: ({ centerId, data }: { centerId: string; data: Partial<COSOTINHNGUYEN> }) => 
      volunteerCenterService.updateCenter(centerId, data),
    onSuccess: (data) => {
      toast.success(`Đã cập nhật thông tin cơ sở: ${data.TenCoSoTinhNguyen}`);
      queryClient.invalidateQueries({ queryKey: ['blood-bank', 'volunteer-centers'] });
    },
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi'}`);
    }
  });

  // Tìm kiếm cơ sở tình nguyện
  const filterCenters = (centers: COSOTINHNGUYEN[]) => {
    if (!searchTerm) return centers;
    
    return centers.filter(center => 
      center.TenCoSoTinhNguyen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.SDT.includes(searchTerm) ||
      center.DiaChi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Các cơ sở tình nguyện đã lọc
  const filteredApprovedCenters = filterCenters(approvedCenters);
  const filteredPendingCenters = filterCenters(pendingCenters);

  // Làm mới dữ liệu
  const refreshData = () => {
    refetchApproved();
    refetchPending();
  };

  // Tiện ích để phê duyệt và từ chối
  const approveCenter = (centerId: string) => {
    approveMutation.mutate(centerId);
  };

  const rejectCenter = (centerId: string, reason: string) => {
    rejectMutation.mutate({ centerId, reason });
  };

  const updateCenter = (centerId: string, data: Partial<COSOTINHNGUYEN>) => {
    updateMutation.mutate({ centerId, data });
  };

  return {
    approvedCenters: filteredApprovedCenters,
    pendingCenters: filteredPendingCenters,
    isLoadingApproved,
    isLoadingPending,
    approvedError,
    pendingError,
    searchTerm,
    setSearchTerm,
    refreshData,
    approveCenter,
    rejectCenter,
    updateCenter,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isUpdating: updateMutation.isPending
  };
} 