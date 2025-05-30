'use client';

import { useState, useEffect, useCallback } from 'react';
import { COSOTINHNGUYEN_WithLocation } from '@/types';
import { 
  getAllVolunteerCenters, 
  getVolunteerCentersByFilter,
  updateVolunteerCenterStatus,
  deleteVolunteerCenter
} from '../services';
import { VolunteerCenterFilter } from '../types';

/**
 * Hook quản lý danh sách cơ sở tình nguyện
 */
export function useAdminVolunteers(
  initialVolunteerCenters?: COSOTINHNGUYEN_WithLocation[]
) {
  // State quản lý danh sách cơ sở tình nguyện
  const [volunteerCenters, setVolunteerCenters] = useState<COSOTINHNGUYEN_WithLocation[]>(
    initialVolunteerCenters || []
  );
  
  // State quản lý bộ lọc
  const [filter, setFilter] = useState<VolunteerCenterFilter>({});
  
  // State loading
  const [isLoading, setIsLoading] = useState<boolean>(!initialVolunteerCenters);
  
  // Fetch cơ sở tình nguyện theo filter
  const fetchVolunteerCenters = useCallback(async () => {
    if (filter) {
      setIsLoading(true);
      try {
        const filteredCenters = await getVolunteerCentersByFilter(filter);
        setVolunteerCenters(filteredCenters);
      } catch (error) {
        console.error('Error fetching volunteer centers by filter:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [filter]);
  
  // Cập nhật trạng thái cơ sở tình nguyện
  const handleUpdateStatus = async (centerId: string, status: boolean) => {
    try {
      const response = await updateVolunteerCenterStatus(centerId, status);
      if (response.success) {
        // Cập nhật state
        setVolunteerCenters(prevCenters => prevCenters.map(center => 
          center.IDCoSoTinhNguyen === centerId ? { ...center, TinhTrang: status } : center
        ));
      }
      return response;
    } catch (error) {
      console.error('Error updating volunteer center status:', error);
      throw error;
    }
  };
  
  // Xóa cơ sở tình nguyện
  const handleDeleteCenter = async (centerId: string) => {
    try {
      const response = await deleteVolunteerCenter(centerId);
      if (response.success) {
        // Cập nhật state
        setVolunteerCenters(prevCenters => 
          prevCenters.filter(center => center.IDCoSoTinhNguyen !== centerId)
        );
      }
      return response;
    } catch (error) {
      console.error('Error deleting volunteer center:', error);
      throw error;
    }
  };
  
  // Fetch dữ liệu khi component mount hoặc filter thay đổi
  useEffect(() => {
    if (!initialVolunteerCenters || Object.keys(filter).length > 0) {
      fetchVolunteerCenters();
    }
  }, [fetchVolunteerCenters, filter, initialVolunteerCenters]);
  
  return {
    volunteerCenters,
    isLoading,
    filter,
    setFilter,
    updateStatus: handleUpdateStatus,
    deleteCenter: handleDeleteCenter
  };
} 