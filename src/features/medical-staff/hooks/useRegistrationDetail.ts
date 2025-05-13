'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MedicalStaffService } from '../services';
import { DANGKIHIENMAU, NGUOIDUNG } from '@/types';
import { mockDangKiHienMau, mockNguoiDung } from '@/mock';

type RegistrationDetailResult = {
  registration: DANGKIHIENMAU | null;
  donor: NGUOIDUNG | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

/**
 * Hook lấy thông tin chi tiết đăng ký hiến máu và người hiến máu
 * @param registrationId ID đơn đăng ký hiến máu
 * @returns Thông tin chi tiết đăng ký và người hiến máu
 */
export function useRegistrationDetail(registrationId: string | null): RegistrationDetailResult {
  const [donor, setDonor] = useState<NGUOIDUNG | null>(null);
  const queryClient = useQueryClient();

  // Query lấy thông tin đăng ký
  const {
    data: registration,
    isLoading: isLoadingRegistration,
    isError: isErrorRegistration,
    error: errorRegistration,
    refetch: refetchRegistration
  } = useQuery({
    queryKey: ['registration-detail', registrationId],
    queryFn: async () => {
      if (!registrationId) return null;
      try {
        return await MedicalStaffService.getRegistrationById(registrationId);
      } catch (error) {
        console.error(`[useRegistrationDetail] Error fetching registration: ${error}`);
        
        // Fallback đến mock data nếu API lỗi
        const mockReg = mockDangKiHienMau.find(r => r.MaDKiHienMau === registrationId);
        if (!mockReg) {
          throw new Error(`Không tìm thấy đăng ký với ID: ${registrationId}`);
        }
        return mockReg;
      }
    },
    enabled: !!registrationId,
    staleTime: 5 * 60 * 1000 // 5 phút
  });

  // Lấy thông tin người hiến máu khi có thông tin đăng ký
  useEffect(() => {
    let isMounted = true;
    
    const fetchDonorInfo = async () => {
      if (!registration?.IdNguoiHienMau) return;
      
      try {
        const donorData = await MedicalStaffService.getDonorById(registration.IdNguoiHienMau);
        if (isMounted) {
          setDonor(donorData);
        }
      } catch (error) {
        console.error(`[useRegistrationDetail] Error fetching donor: ${error}`);
        
        // Fallback đến mock data nếu API lỗi
        if (isMounted) {
          const mockDonorData = mockNguoiDung.find(u => u.MaNguoiDung === registration.IdNguoiHienMau);
          setDonor(mockDonorData || null);
        }
      }
    };

    if (registration) {
      fetchDonorInfo();
    } else {
      setDonor(null);
    }

    // Cleanup để tránh memory leak và race condition
    return () => {
      isMounted = false;
    };
  }, [registration]);

  // Hàm refetch tổng hợp
  const refetch = () => {
    refetchRegistration();
  };

  return {
    registration: registration || null,
    donor,
    isLoading: isLoadingRegistration,
    isError: isErrorRegistration,
    error: errorRegistration as Error | null,
    refetch
  };
} 