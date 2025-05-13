'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MedicalStaffService } from '../services';
import { UpdateFeedbackStatusData } from '../types';

/**
 * Hook quản lý chi tiết phản hồi
 * @param feedbackId ID của phản hồi
 * @returns Chi tiết phản hồi và hàm xử lý
 */
export function useFeedbackDetail(feedbackId: string) {
  const queryClient = useQueryClient();
  
  const {
    data: feedback,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['feedback-detail', feedbackId],
    queryFn: () => MedicalStaffService.getFeedbackById(feedbackId),
    enabled: !!feedbackId
  });
  
  // Xử lý cập nhật trạng thái phản hồi
  const handleUpdateStatus = useCallback(async (statusData: UpdateFeedbackStatusData) => {
    try {
      const result = await MedicalStaffService.updateFeedbackStatus(feedbackId, statusData);
      if (result) {
        // Invalidate queries để cập nhật dữ liệu
        queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
        queryClient.invalidateQueries({ queryKey: ['feedback-detail', feedbackId] });
      }
      return result;
    } catch (error) {
      console.error('[useFeedbackDetail] Error updating feedback status:', error);
      return false;
    }
  }, [feedbackId, queryClient]);
  
  return {
    feedback,
    isLoading,
    error,
    refetch,
    handleUpdateStatus
  };
} 