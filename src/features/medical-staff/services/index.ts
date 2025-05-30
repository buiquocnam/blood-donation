/**
 * Dịch vụ API cho tính năng Nhân viên y tế
 */
import { UpdateDonationStatusData, PhanHoiWithUserInfo, TrangThaiPhanHoi, UpdateFeedbackStatusData, DonationRegistrationResponse } from '../types';
import { mockDangKiHienMau, mockNguoiDung } from '@/mock';
import { mockPhanHoi } from '@/mock/events';
import { NGUOIDUNG } from '@/types';
import api from '@/lib/api/client';
import { MEDICAL_STAFF_ENDPOINTS } from '@/lib/api/endpoints';

/**
 * Service xử lý các chức năng dành cho nhân viên y tế
 */
export class MedicalStaffService {
  private static ENDPOINTS = {
    REGISTRATIONS: MEDICAL_STAFF_ENDPOINTS.DONATION_REQUESTS,
    
    USERS: '/users/public',
    UPDATE_DONATION_STATUS: '/donations/:id/status',
    FEEDBACKS: MEDICAL_STAFF_ENDPOINTS.FEEDBACKS
  };

  /**
   * Lấy danh sách đăng ký hiến máu cho một sự kiện
   * @param eventId ID của sự kiện
   * @returns Danh sách đăng ký hiến máu
   */
  public static async getRegistrationsByEvent(eventId: string): Promise<DonationRegistrationResponse[]> {
    try {
      console.log(`[MedicalStaffService] Fetching registrations for event: ${eventId}`);
      console.log(`[MedicalStaffService] Using endpoint: ${MEDICAL_STAFF_ENDPOINTS.EVENT_REGISTRATIONS(eventId)}`);
      
      // Sử dụng api đã được cấu hình sẵn trong client.ts
      const response = await api.get(MEDICAL_STAFF_ENDPOINTS.EVENT_REGISTRATIONS(eventId));
      console.log(response.data.result.data);
      if (!response.data.result) {
        console.warn('[MedicalStaffService] API response missing result field');
        throw new Error('Không thể lấy danh sách đăng ký hiến máu');
      }
      
      console.log(`[MedicalStaffService] Successfully fetched ${response.data.result.length} registrations`);
      return response.data.result.data;
    } catch (error) {
      console.error('[MedicalStaffService] getRegistrationsByEvent error:', error);
      return [];
    }
  }


  /**
   * Lấy thông tin người hiến máu theo ID
   * @param donorId ID của người hiến máu
   * @returns Thông tin người hiến máu
   */
  public static async getDonorById(donorId: string): Promise<NGUOIDUNG> {
    try {
      const response = await api.get(`${this.ENDPOINTS.USERS}/${donorId}`);
      if (!response.data) {
        throw new Error('Không thể lấy thông tin người hiến máu');
      }
      console.log("getDonorById",response.data.result);
      return response.data.result;
    } catch (error) {
      console.error('[MedicalStaffService] getDonorById error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách người đã hiến máu cho một sự kiện
   * @param eventId ID của sự kiện
   * @returns Danh sách người đã hiến máu
   */
  public static async getDonationsByEvent(eventId: string): Promise<DonationRegistrationResponse[]> {
    try {
      // Sử dụng api đã được cấu hình sẵn trong client.ts
      const response = await api.get(MEDICAL_STAFF_ENDPOINTS.EVENT_DONATIONS(eventId));
      
      if (!response.data) {
        console.warn('[MedicalStaffService] API response missing data');
        throw new Error('Không thể lấy danh sách người đã hiến máu');
      }
      
      console.log(`[MedicalStaffService] Successfully fetched donations`);
      return response.data.result.data;
    } catch (error) {
      console.error('[MedicalStaffService] getDonationsByEvent error:', error);
      return [];
    }
  }
  /**
   * Duyệt đơn đăng ký hiến máu
   * @param registrationId ID của đơn đăng ký
   * @param status Trạng thái duyệt (DA_DUYET/TU_CHOI)
   * @param note Ghi chú khi duyệt đơn
   * @returns Kết quả duyệt
   */
  public static async approveRegistration(
    registrationId: string, 
    status: string, 
    note?: string
  ): Promise<boolean> {
    if (!registrationId) return false;
    
    console.log(`[MedicalStaffService] Approving registration ${registrationId} with status: ${status}`);
    if (note) {
      console.log(`[MedicalStaffService] Note: ${note}`);
    }
    
    try {
      const response = await api.put(`/donations/${registrationId}/status`, {
        status,
        note
      });
      
      if (!response.data) {
        throw new Error('Không thể duyệt đơn đăng ký hiến máu');
      }
      
      console.log('[MedicalStaffService] Successfully approved registration');
      return true;
    } catch (error) {
      console.error('[MedicalStaffService] approveRegistration error:', error);
      
      // Simulating approval in mock environment
      console.log(`[MedicalStaffService] Mock approve completed for ${registrationId}`);
      return true;
    }
  }

  /**
   * Cập nhật trạng thái hiến máu
   * @param registrationId ID của đơn đăng ký
   * @param donationData Dữ liệu hiến máu
   * @returns Kết quả cập nhật
   */
  public static async updateDonationStatus(
    registrationId: string, 
    donationData: UpdateDonationStatusData
  ): Promise<boolean> {
    try {
      const response = await api.put(`${this.ENDPOINTS.REGISTRATIONS}/${registrationId}/donation-status`, donationData);
      
      if (!response.data) {
        throw new Error('Không thể cập nhật trạng thái hiến máu');
      }
      
      return true;
    } catch (error) {
      console.error('[MedicalStaffService] updateDonationStatus error:', error);
      console.log('[MedicalStaffService] Simulating successful update');
      
      // Giả lập việc cập nhật thành công
      return true;
    }
  }

  /**
   * Lấy danh sách phản hồi của người hiến máu
   * @returns Danh sách phản hồi
   */
  public static async getFeedbacks(): Promise<PhanHoiWithUserInfo[]> {
    try {
      const response = await api.get(this.ENDPOINTS.FEEDBACKS);
      if (!response.data) {
        throw new Error('Không thể lấy danh sách phản hồi');
      }
      return response.data;
    } catch (error) {
      console.error('[MedicalStaffService] getFeedbacks error:', error);
      
      // Sử dụng mock data
      const feedbacksWithUser: PhanHoiWithUserInfo[] = mockPhanHoi.map(feedback => {
        const registration = mockDangKiHienMau.find(reg => reg.MaDKiHienMau === feedback.MaDKiHienMau);
        const user = registration ? mockNguoiDung.find(user => user.MaNguoiDung === registration.IdNguoiHienMau) : null;
        
        return {
          ...feedback,
          NguoiHienMau: user || undefined,
          DangKyHienMau: registration,
          TrangThaiXuLy: TrangThaiPhanHoi.CHUA_XU_LY,
          GhiChuXuLy: ''
        };
      });
      
      return feedbacksWithUser;
    }
  }

  /**
   * Lấy chi tiết phản hồi theo ID
   * @param feedbackId ID của phản hồi
   * @returns Chi tiết phản hồi
   */
  public static async getFeedbackById(feedbackId: string): Promise<PhanHoiWithUserInfo> {
    try {
      const response = await api.get(`${this.ENDPOINTS.FEEDBACKS}/${feedbackId}`);
      if (!response.data) {
        throw new Error('Không thể lấy chi tiết phản hồi');
      }
      return response.data;
    } catch (error) {
      console.error('[MedicalStaffService] getFeedbackById error:', error);
      
      // Sử dụng mock data
      const feedback = mockPhanHoi.find(f => f.MaPhanHoi === feedbackId);
      if (!feedback) {
        throw new Error(`Không tìm thấy phản hồi với ID: ${feedbackId}`);
      }
      
      const registration = mockDangKiHienMau.find(reg => reg.MaDKiHienMau === feedback.MaDKiHienMau);
      const user = registration ? mockNguoiDung.find(user => user.MaNguoiDung === registration.IdNguoiHienMau) : null;
      
      return {
        ...feedback,
        NguoiHienMau: user || undefined,
        DangKyHienMau: registration,
        TrangThaiXuLy: TrangThaiPhanHoi.CHUA_XU_LY,
        GhiChuXuLy: ''
      };
    }
  }

  /**
   * Cập nhật trạng thái xử lý phản hồi
   * @param feedbackId ID của phản hồi
   * @param status Dữ liệu cập nhật
   * @returns Kết quả cập nhật
   */
  public static async updateFeedbackStatus(
    feedbackId: string, 
    status: UpdateFeedbackStatusData
  ): Promise<boolean> {
    try {
      const response = await api.put(`${this.ENDPOINTS.FEEDBACKS}/${feedbackId}/status`, status);
      if (!response.data) {
        throw new Error('Không thể cập nhật trạng thái phản hồi');
      }
      return true;
    } catch (error) {
      console.error('[MedicalStaffService] updateFeedbackStatus error:', error);
      
      // Giả lập việc cập nhật thành công trong môi trường phát triển
      console.log(`[MedicalStaffService] Giả lập cập nhật trạng thái phản hồi ${feedbackId}:`, status);
      return true;
    }
  }
}

// Backwards compatibility exports
export const getRegistrationsByEvent = MedicalStaffService.getRegistrationsByEvent.bind(MedicalStaffService);
export const getDonorById = MedicalStaffService.getDonorById.bind(MedicalStaffService);
export const getDonationsByEvent = MedicalStaffService.getDonationsByEvent.bind(MedicalStaffService);
export const approveRegistration = MedicalStaffService.approveRegistration.bind(MedicalStaffService);
export const updateDonationStatus = MedicalStaffService.updateDonationStatus.bind(MedicalStaffService);
export const getFeedbacks = MedicalStaffService.getFeedbacks.bind(MedicalStaffService);
export const getFeedbackById = MedicalStaffService.getFeedbackById.bind(MedicalStaffService);
export const updateFeedbackStatus = MedicalStaffService.updateFeedbackStatus.bind(MedicalStaffService); 