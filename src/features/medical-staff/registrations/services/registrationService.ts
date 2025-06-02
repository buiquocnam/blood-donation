import axios from '@/lib/axios';
import { DANGKIHIENMAU_WithRelations, TrangThaiDangKy } from '@/types';
import { 
  UpdateHealthStatusRequest,
  UpdateBloodDonationStatusRequest,
  RegistrationResponse
} from '../types';
import { ApiResponse } from '@/lib/constants';

type ApiResult<T> = ApiResponse<T>['result'];

export const registrationService = {
  // Lấy danh sách đăng ký hiến máu
  getByEventId: async (eventId?: string): Promise<ApiResult<RegistrationResponse[]>> => {
    const { data } = await axios.get<ApiResponse<RegistrationResponse[]>>(`/donations/event/${eventId}`);
    console.log("getByEventId",data.result.data);
    return data.result;
  },

  // Cập nhật trạng thái đăng ký (Chỉ nhân viên y tế, director và admin)
  updateStatus: async (status: TrangThaiDangKy, registrationId: string): Promise<ApiResult<DANGKIHIENMAU_WithRelations>> => {
    const { data } = await axios.put(
      `/donations/${registrationId}/status`,
      { status }
    );
    return data.result;
  },

  // Cập nhật trạng thái hiến máu
  updateBloodDonationStatus: async (request: UpdateBloodDonationStatusRequest): Promise<ApiResult<DANGKIHIENMAU_WithRelations>> => {
    const { registrationId, ...body } = request;
    const { data } = await axios.patch(
      `/medical-staff/registrations/${registrationId}/donation-status`,
      body
    );
    return data.result;
  }
}; 