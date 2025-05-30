'use client';

import { useQuery } from '@tanstack/react-query';
import { MedicalStaffService } from '../services';
import { NGUOIDUNG } from '@/types';

/**
 * Hook lấy thông tin chi tiết người hiến máu theo ID
 * @param userId ID của người hiến máu
 * @returns Thông tin người hiến máu và trạng thái query
 */
export function useDonorInfo(userId: string | null) {
  const {
    data: donorData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['donor-info', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const data = await MedicalStaffService.getDonorById(userId);
        return data;
      } catch (error) {
        console.error(`[useDonorInfo] Error fetching donor info for ${userId}:`, error);
        throw error;
      }
    },
    enabled: !!userId
  });

  return {
    donorData,
    isLoading,
    isError,
    error,
    refetch
  };
} 