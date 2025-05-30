'use client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MedicalStaffService } from '../services';
import { TrangThaiDangKy } from '@/types';

interface ApproveRegistrationParams {
  registrationId: string;
  status: string;
  note?: string;
}

/**
 * Hook xử lý duyệt đơn đăng ký hiến máu
 * @param eventId ID của sự kiện chứa đơn đăng ký
 * @returns Các function và trạng thái để xử lý duyệt đơn
 */
export function useApproveRegistration(eventId: string) {
  const queryClient = useQueryClient();
  
  // Sử dụng useMutation từ react-query để xử lý việc gọi API
  const {
    mutate: approveRegistration,
    isPending: isLoading,
    isError,
    error,
    reset
  } = useMutation({
    mutationFn: async ({ registrationId, status, note }: ApproveRegistrationParams) => {
      if (!registrationId) {
        throw new Error('ID đơn đăng ký không hợp lệ');
      }
      
      const result = await MedicalStaffService.approveRegistration(registrationId, status, note);
      
      if (!result) {
        throw new Error('Không thể duyệt đơn đăng ký');
      }
      
      return { registrationId, status };
    },
    onSuccess: ({ status }) => {
      // Hiển thị thông báo thành công
      toast.success(
        `Đơn đăng ký ${status === TrangThaiDangKy.DA_DUYET ? 'đã được duyệt' : 'đã bị từ chối'}`
      );
      
      // Cập nhật lại dữ liệu
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
    },
    onError: (err) => {
      console.error('Lỗi khi duyệt đơn:', err);
      toast.error('Đã xảy ra lỗi trong quá trình duyệt đơn');
    }
  });

  /**
   * Function duyệt đơn đăng ký đơn giản hóa 
   */
  const handleApprove = (registrationId: string, status: string, note?: string) => {
    approveRegistration({ registrationId, status, note });
  };
  
  return {
    approveRegistration: handleApprove,
    isApproving: isLoading,
    error,
    isError,
    reset
  };
} 