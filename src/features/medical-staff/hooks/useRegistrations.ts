'use client';

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MedicalStaffService } from '../services';
import { DANGKIHIENMAU, NGUOIDUNG } from '@/types';

/**
 * Hook quản lý danh sách đăng ký hiến máu cho một sự kiện
 * @param eventId ID của sự kiện
 * @returns Danh sách đăng ký, trạng thái, lọc và hàm xử lý duyệt
 */
export function useRegistrations(eventId: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [userCache, setUserCache] = useState<Record<string, NGUOIDUNG>>({});
  
  const queryClient = useQueryClient();
  
  const {
    data: registrations = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => MedicalStaffService.getRegistrationsByEvent(eventId),
    enabled: !!eventId
  });
  
  // Lấy thông tin người dùng với cache
  const getUserInfo = useCallback(async (userId: string) => {
    // Kiểm tra cache trước
    if (userCache[userId]) {
      return userCache[userId];
    }
     // Gọi API để lấy thông tin người dùng - service đã tự fallback về mock data khi cần
     const userData = await MedicalStaffService.getDonorById(userId);
    
     // Cập nhật cache
     setUserCache(prev => ({
       ...prev,
       [userId]: userData
     }));
     
     return userData;
  }, [userCache]);
  
  // Lọc đăng ký theo từ khóa tìm kiếm
  const filteredRegistrations = registrations.filter((reg: DANGKIHIENMAU) => {
    if (!searchTerm.trim()) return true;
    
    // Chỉ lọc theo ID người hiến máu và ID đăng ký
    // Việc lọc theo thông tin chi tiết người dùng sẽ được xử lý bởi phía client
    return reg.IdNguoiHienMau.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reg.MaDKiHienMau.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Xử lý mở dialog duyệt đơn
  const handleOpenApproveDialog = useCallback((registrationId: string) => {
    setSelectedRegistration(registrationId);
    setApproveDialogOpen(true);
  }, []);
  
  // Xử lý duyệt đơn đăng ký
  const handleApprove = useCallback(async (registrationId: string, status: string, note?: string) => {
    try {
      const result = await MedicalStaffService.approveRegistration(registrationId, status, note);
      if (result) {
        // Invalidate cả queries registration detail và registrations list
        queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
        queryClient.invalidateQueries({ queryKey: ['registration-detail', registrationId] });
        setApproveDialogOpen(false);
      }
      return result;
    } catch (error) {
      console.error('[useRegistrations] Error approving registration:', error);
      return false;
    }
  }, [eventId, queryClient]);
  
  return {
    registrations,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filteredRegistrations,
    refetch,
    approveDialogOpen,
    setApproveDialogOpen,
    selectedRegistration,
    setSelectedRegistration,
    handleOpenApproveDialog,
    handleApprove,
    updateStatusDialogOpen,
    setUpdateStatusDialogOpen,
    getUserInfo
  };
} 