/**
 * Dịch vụ API cho tính năng Nhân viên y tế
 */
import { BloodDonation, UpdateDonationStatusData, PhanHoiWithUserInfo, TrangThaiPhanHoi, UpdateFeedbackStatusData } from '../types';
import { mockDangKiToChucHienMau, mockDangKiHienMau, mockNguoiDung } from '@/mock';
import { mockPhanHoi } from '@/mock/events';
import { DANGKITOCHUCHIENMAU, DANGKIHIENMAU, NGUOIDUNG, TrangThaiHienMau } from '@/types';
import api from '@/lib/api/client';

/**
 * Service xử lý các chức năng dành cho nhân viên y tế
 */
export class MedicalStaffService {
  private static ENDPOINTS = {
    EVENTS: '/medical-staff/events',
    REGISTRATIONS: '/medical-staff/registrations',
    DONATIONS: '/medical-staff/donations',
    APPROVE: '/medical-staff/approve',
    DONATION_STATUS: '/medical-staff/donation-status',
    USERS: '/medical-staff/users',
    FEEDBACKS: '/medical-staff/feedbacks'
  };

  /**
   * Lấy danh sách sự kiện hiến máu
   * @returns Danh sách sự kiện hiến máu
   */
  public static async getBloodDonationEvents(): Promise<DANGKITOCHUCHIENMAU[]> {
    try {
      console.log(`[MedicalStaffService] Fetching events from: ${this.ENDPOINTS.EVENTS}`);
      const response = await api.get(this.ENDPOINTS.EVENTS);
      if (!response.data) {
        throw new Error('Không thể lấy danh sách sự kiện hiến máu');
      }
      return response.data;
    } catch (error) {
      console.error('[MedicalStaffService] getBloodDonationEvents error:', error);
      console.log('[MedicalStaffService] Using mock data');
      
      // Trả về trực tiếp dữ liệu mock
      return mockDangKiToChucHienMau;
    }
  }

  /**
   * Lấy danh sách đăng ký hiến máu cho một sự kiện
   * @param eventId ID của sự kiện
   * @returns Danh sách đăng ký hiến máu
   */
  public static async getRegistrationsByEvent(eventId: string): Promise<DANGKIHIENMAU[]> {
    try {
      console.log(`[MedicalStaffService] Fetching registrations for event: ${eventId}`);
      const response = await api.get(`${this.ENDPOINTS.EVENTS}/${eventId}/registrations`);
      if (!response.data) {
        throw new Error('Không thể lấy danh sách đăng ký hiến máu');
      }
      return response.data;
    } catch (error) {
      console.error('[MedicalStaffService] getRegistrationsByEvent error:', error);
      
      // Fallback to mock data
      console.log('[MedicalStaffService] Using mock data');
      return mockDangKiHienMau.filter(dk => dk.IdSuKienHienMau === eventId);
    }
  }

  /**
   * Lấy chi tiết đăng ký hiến máu theo ID
   * @param registrationId ID của đơn đăng ký hiến máu
   * @returns Chi tiết đăng ký hiến máu
   */
  public static async getRegistrationById(registrationId: string): Promise<DANGKIHIENMAU> {
    console.log(`[MedicalStaffService] Fetching registration with ID: "${registrationId}"`);
    
    try {
      const response = await api.get(`${this.ENDPOINTS.REGISTRATIONS}/${registrationId}`);
      if (!response.data) {
        console.error('[MedicalStaffService] API request failed: No data returned');
        throw new Error('Không thể lấy chi tiết đăng ký hiến máu');
      }
      
      console.log('[MedicalStaffService] API returned data:', response.data);
      return response.data;
    } catch (error) {
      console.error('[MedicalStaffService] getRegistrationById error:', error);
      console.log('[MedicalStaffService] Switching to mock data lookup');
      
      // Verify mock data is available
      console.log('[MedicalStaffService] Available IDs in mock data:', 
        mockDangKiHienMau.map(reg => reg.MaDKiHienMau));
      
      // Find matching registration by ID
      const mockRegistration = mockDangKiHienMau.find(
        reg => reg.MaDKiHienMau === registrationId
      );
      
      if (!mockRegistration) {
        console.error(`[MedicalStaffService] No registration found with ID: "${registrationId}" in mock data`);
        throw new Error(`Không tìm thấy đăng ký hiến máu với ID: ${registrationId}`);
      }
      
      console.log('[MedicalStaffService] Found matching mock registration:', mockRegistration);
      return { ...mockRegistration };  // Return a copy to avoid mutations
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
      return response.data;
    } catch (error) {
      console.error('[MedicalStaffService] getDonorById error:', error);
      
      // Fallback to mock data
      const donorData = mockNguoiDung.find(user => user.MaNguoiDung === donorId);
      if (!donorData) {
        throw new Error(`Không tìm thấy thông tin người hiến máu với ID: ${donorId}`);
      }
      return donorData;
    }
  }

  /**
   * Lấy danh sách người đã hiến máu cho một sự kiện
   * @param eventId ID của sự kiện
   * @returns Danh sách người đã hiến máu
   */
  public static async getDonationsByEvent(eventId: string): Promise<BloodDonation[]> {
    try {
      const response = await api.get(`${this.ENDPOINTS.EVENTS}/${eventId}/donations`);
      if (!response.data) {
        throw new Error('Không thể lấy danh sách người đã hiến máu');
      }
      return response.data;
    } catch (error) {
      console.error('[MedicalStaffService] getDonationsByEvent error:', error);
      console.log('[MedicalStaffService] Using mock data');
      
      // Lọc đăng ký đã hoàn thành (đã hiến máu) theo sự kiện
      const completedDonations = mockDangKiHienMau.filter(
        (reg) => 
          reg.IdSuKienHienMau === eventId && 
          reg.TrangThaiHienMau === TrangThaiHienMau.DA_HOAN_THANH
      );
      
      return completedDonations.map((donation) => ({
        MaDKiHienMau: donation.MaDKiHienMau,
        IdNguoiHienMau: donation.IdNguoiHienMau,
        HoTen: `Người hiến máu ${donation.MaDKiHienMau}`, // Giả định tên người hiến máu
        MaNhomMau: "A_POS", // Giả định nhóm máu
        ChieuCao: donation.ChieuCao || 170,
        CanNang: donation.CanNang || 65,
        NhietDo: donation.NhietDo || 36.5,
        NhipTim: donation.NhipTim || 72,
        HuyetAp: donation.HuyetAp || "120/80",
        TrangThaiHienMau: donation.TrangThaiHienMau,
        NgayHienMau: donation.NgaySua // Giả sử ngày hiến máu là ngày cập nhật
      }));
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
      const response = await api.put(`${this.ENDPOINTS.REGISTRATIONS}/${registrationId}/approve`, {
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
        const registration = mockDangKiHienMau.find(reg => reg.MaDKiHienMau === feedback.MaDKiKienMau);
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
      
      const registration = mockDangKiHienMau.find(reg => reg.MaDKiHienMau === feedback.MaDKiKienMau);
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
export const getBloodDonationEvents = MedicalStaffService.getBloodDonationEvents.bind(MedicalStaffService);
export const getRegistrationsByEvent = MedicalStaffService.getRegistrationsByEvent.bind(MedicalStaffService);
export const getRegistrationById = MedicalStaffService.getRegistrationById.bind(MedicalStaffService);
export const getDonorById = MedicalStaffService.getDonorById.bind(MedicalStaffService);
export const getDonationsByEvent = MedicalStaffService.getDonationsByEvent.bind(MedicalStaffService);
export const approveRegistration = MedicalStaffService.approveRegistration.bind(MedicalStaffService);
export const updateDonationStatus = MedicalStaffService.updateDonationStatus.bind(MedicalStaffService);
export const getFeedbacks = MedicalStaffService.getFeedbacks.bind(MedicalStaffService);
export const getFeedbackById = MedicalStaffService.getFeedbackById.bind(MedicalStaffService);
export const updateFeedbackStatus = MedicalStaffService.updateFeedbackStatus.bind(MedicalStaffService); 