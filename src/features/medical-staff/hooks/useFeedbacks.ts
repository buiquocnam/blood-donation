'use client';

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MedicalStaffService } from '../services';
import { PhanHoiWithUserInfo, TrangThaiPhanHoi, UpdateFeedbackStatusData } from '../types';

/**
 * Hook quản lý danh sách phản hồi của người hiến máu
 * @returns Danh sách phản hồi, trạng thái, lọc và hàm xử lý
 */
export function useFeedbacks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  const {
    data: feedbacks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: () => MedicalStaffService.getFeedbacks(),
  });
  
  // Lọc phản hồi theo từ khóa tìm kiếm
  const filteredFeedbacks = feedbacks.filter((feedback: PhanHoiWithUserInfo) => {
    if (!searchTerm.trim()) return true;
    
    // Lọc theo ID phản hồi, ID đăng ký, tên người hiến máu
    return feedback.MaPhanHoi.toLowerCase().includes(searchTerm.toLowerCase()) ||
           feedback.MaDKiKienMau.toLowerCase().includes(searchTerm.toLowerCase()) ||
           feedback.NguoiHienMau?.HoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           feedback.TinhTrangMoTa.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Xử lý mở dialog cập nhật trạng thái
  const handleOpenUpdateDialog = useCallback((feedbackId: string) => {
    setSelectedFeedback(feedbackId);
    setUpdateDialogOpen(true);
  }, []);
  
  // Xử lý cập nhật trạng thái phản hồi
  const handleUpdateFeedbackStatus = useCallback(async (
    feedbackId: string, 
    statusData: UpdateFeedbackStatusData
  ) => {
    try {
      const result = await MedicalStaffService.updateFeedbackStatus(feedbackId, statusData);
      if (result) {
        // Invalidate queries để cập nhật dữ liệu
        queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
        queryClient.invalidateQueries({ queryKey: ['feedback-detail', feedbackId] });
        setUpdateDialogOpen(false);
      }
      return result;
    } catch (error) {
      console.error('[useFeedbacks] Error updating feedback status:', error);
      return false;
    }
  }, [queryClient]);
  
  return {
    feedbacks,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filteredFeedbacks,
    refetch,
    updateDialogOpen,
    setUpdateDialogOpen,
    selectedFeedback,
    setSelectedFeedback,
    handleOpenUpdateDialog,
    handleUpdateFeedbackStatus
  };
} 