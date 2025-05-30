'use client';

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MedicalStaffService } from '../services';
import { DonationRegistrationResponse } from '../types';
import { UpdateDonationStatusData } from '../types';

/**
 * Hook quản lý danh sách người đã hiến máu cho một sự kiện
 * @param eventId ID của sự kiện
 * @returns Danh sách hiến máu, trạng thái, và hàm xử lý cập nhật
 */
export function useDonations(eventId: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Lấy danh sách hiến máu
  const {
    data: donations = [],
    isLoading,
    error,
    refetch
    } = useQuery<DonationRegistrationResponse[]>({
    queryKey: ['donations', eventId],
    queryFn: () => MedicalStaffService.getDonationsByEvent(eventId),
    enabled: !!eventId
  });
  
  // Lọc hiến máu theo từ khóa tìm kiếm
  const filteredDonations = donations.filter((donation) => {
    if (!searchTerm.trim()) return true;
    
    return donation.MaDKiHienMau.toLowerCase().includes(searchTerm.toLowerCase()) ||
           donation.IdNguoiHienMau.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (donation.NGUOIHIENMAU.HoTen && donation.NGUOIHIENMAU.HoTen.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  // Xử lý mở dialog cập nhật trạng thái hiến máu
  const handleOpenUpdateDialog = useCallback((donationId: string) => {
    setSelectedDonation(donationId);
    setUpdateStatusDialogOpen(true);
  }, []);
  
  // Xử lý cập nhật trạng thái hiến máu
  const handleUpdateDonationStatus = useCallback(async (donationId: string, data: UpdateDonationStatusData) => {
    try {
      const result = await MedicalStaffService.updateDonationStatus(donationId, data);
      if (result) {
        // Invalidate cả queries donations và registrations
        queryClient.invalidateQueries({ queryKey: ['donations', eventId] });
        queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
        queryClient.invalidateQueries({ queryKey: ['registration-detail', donationId] });
        setUpdateStatusDialogOpen(false);
      }
      return result;
    } catch (error) {
      console.error('[useDonations] Error updating donation status:', error);
      return false;
    }
  }, [eventId, queryClient]);
  
  return {
    donations,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filteredDonations,
    refetch,
    selectedDonation,
    setSelectedDonation,
    updateStatusDialogOpen,
    setUpdateStatusDialogOpen,
    handleOpenUpdateDialog,
    handleUpdateDonationStatus
  };
} 