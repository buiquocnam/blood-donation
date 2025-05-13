"use client";

import { DonorService } from "../services/donor-service";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { DANGKITOCHUCHIENMAU_WithRelations, DANHMUCDVMAU, GIAYCHUNGNHAN } from "@/types/events";
import { ChiTietDangKyHienMau, FormDangKyHienMau, FormPhanHoiHienMau, LichSuHienMau, ThongKeNguoiHien } from "../types";
import { isNguoiDung } from "@/utils/typeGuards";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook lấy danh sách sự kiện hiến máu
 */
export function useDonationEvents() {
  return useQuery({
    queryKey: ['donor', 'events'],
    queryFn: async () => {
      try {
        const events = await DonorService.getAvailableEvents();
        return events;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sự kiện:', error);
        toast.error('Không thể tải danh sách sự kiện hiến máu');
        throw error;
      }
    },
    select: (events: DANGKITOCHUCHIENMAU_WithRelations[]) => events || [],
  });
}

/**
 * Hook lấy danh sách đơn vị hiến máu
 */
export function useBloodDonationUnits() {
  return useQuery({
    queryKey: ['donor', 'blood-units'],
    queryFn: async () => {
      try {
        const units = await DonorService.getBloodDonationUnits();
        return units;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn vị hiến máu:', error);
        toast.error('Không thể tải danh sách đơn vị hiến máu');
        throw error;
      }
    },
    select: (units: DANHMUCDVMAU[]) => units || [],
  });
}

/**
 * Hook lấy lịch sử đăng ký hiến máu của người dùng
 */
export function useDonationHistory() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['donor', 'history', isNguoiDung(user) ? user.MaNguoiDung : null],
    queryFn: async () => {
      if (!user) {
        toast.error('Bạn cần đăng nhập để xem lịch sử hiến máu');
        throw new Error("Bạn cần đăng nhập để xem lịch sử hiến máu");
      }
      
      if (!isNguoiDung(user)) {
        toast.error('Chỉ người hiến máu mới có thể xem lịch sử hiến máu');
        throw new Error("Chỉ người hiến máu mới có thể xem lịch sử hiến máu");
      }
      
      try {
        const history = await DonorService.getDonorRegistrations(user.MaNguoiDung);
        return history;
      } catch (error) {
        // Xử lý lỗi 404 (endpoint chưa tồn tại) trong môi trường phát triển
        if (process.env.NODE_ENV === 'development') {
          console.warn('Lỗi khi lấy lịch sử hiến máu:', error);
        }
        toast.error('Không thể tải lịch sử hiến máu');
        throw error;
      }
    },
    enabled: !!user && isNguoiDung(user),
    select: (history: LichSuHienMau[]) => history || [],
  });
}

/**
 * Hook lấy chi tiết một đăng ký hiến máu
 */
export function useDonationDetail(registrationId: string) {
  return useQuery({
    queryKey: ['donor', 'detail', registrationId],
    queryFn: async () => {
      if (!registrationId) {
        toast.error('ID đăng ký không hợp lệ');
        throw new Error("ID đăng ký không hợp lệ");
      }
      
      try {
        const detail = await DonorService.getRegistrationDetail(registrationId);
        return detail;
      } catch (error) {
        toast.error("Không thể tải chi tiết đăng ký hiến máu");
        console.error(error);
        throw error;
      }
    },
    enabled: !!registrationId,
  });
}

/**
 * Hook đăng ký hiến máu
 */
export function useRegisterDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormDangKyHienMau) => {
      try {
        const result = await DonorService.registerDonation(formData);
        return result;
      } catch (error) {
        toast.error("Đăng ký hiến máu thất bại");
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Đăng ký hiến máu thành công");
      queryClient.invalidateQueries({ queryKey: ['donor', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['donor', 'events'] });
    }
  });
}

/**
 * Hook hủy đăng ký hiến máu
 */
export function useCancelDonation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationId: string) => {
      try {
        const result = await DonorService.cancelRegistration(registrationId);
        return result;
      } catch (error) {
        toast.error("Hủy đăng ký hiến máu thất bại");
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Hủy đăng ký hiến máu thành công");
      queryClient.invalidateQueries({ queryKey: ['donor', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['donor', 'events'] });
      
      // Gọi callback bổ sung nếu được cung cấp
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    }
  });
}

/**
 * Hook gửi phản hồi sau khi hiến máu
 */
export function useSubmitFeedback(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackData: FormPhanHoiHienMau) => {
      try {
        const result = await DonorService.submitFeedback(feedbackData);
        return result;
      } catch (error) {
        toast.error("Gửi phản hồi thất bại");
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Gửi phản hồi thành công");
      queryClient.invalidateQueries({ queryKey: ['donor', 'history'] });
      
      // Gọi callback bổ sung nếu được cung cấp
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    }
  });
}

/**
 * Hook lấy giấy chứng nhận hiến máu
 */
export function useDonationCertificates() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['donor', 'certificates', isNguoiDung(user) ? user.MaNguoiDung : null],
    queryFn: async () => {
      if (!user) {
        toast.error('Bạn cần đăng nhập để xem giấy chứng nhận');
        throw new Error("Bạn cần đăng nhập để xem giấy chứng nhận");
      }
      
      if (!isNguoiDung(user)) {
        toast.error('Chỉ người hiến máu mới có thể xem giấy chứng nhận');
        throw new Error("Chỉ người hiến máu mới có thể xem giấy chứng nhận");
      }
      
      try {
        const certificates = await DonorService.getDonationCertificates(user.MaNguoiDung);
        return certificates;
      } catch (error) {
        // Xử lý lỗi 404 (endpoint chưa tồn tại) trong môi trường phát triển
        if (process.env.NODE_ENV === 'development') {
          console.warn('Lỗi khi lấy giấy chứng nhận hiến máu:', error);
        }
        toast.error('Không thể tải giấy chứng nhận hiến máu');
        throw error;
      }
    },
    enabled: !!user && isNguoiDung(user),
    select: (certificates: GIAYCHUNGNHAN[]) => certificates || [],
  });
}

/**
 * Hook lấy thống kê hiến máu của người dùng
 */
export function useDonorStatistics() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['donor', 'statistics', isNguoiDung(user) ? user.MaNguoiDung : null],
    queryFn: async () => {
      if (!user) {
        toast.error('Bạn cần đăng nhập để xem thống kê');
        throw new Error("Bạn cần đăng nhập để xem thống kê");
      }
      
      if (!isNguoiDung(user)) {
        toast.error('Chỉ người hiến máu mới có thể xem thống kê');
        throw new Error("Chỉ người hiến máu mới có thể xem thống kê");
      }
      
      try {
        const statistics = await DonorService.getDonorStatistics(user.MaNguoiDung);
        return statistics;
      } catch (error) {
        // Xử lý lỗi 404 (endpoint chưa tồn tại) trong môi trường phát triển
        if (process.env.NODE_ENV === 'development') {
          console.warn('Lỗi khi lấy thống kê hiến máu:', error);
        }
        toast.error('Không thể tải thống kê hiến máu');
        throw error;
      }
    },
    enabled: !!user && isNguoiDung(user),
  });
} 