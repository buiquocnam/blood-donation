import { PHANHOI, DANGKIHIENMAU, DANGKITOCHUCHIENMAU } from '@/types';
import { NGUOIDUNG } from '@/types';

/**
 * Thông tin chi tiết về một lần hiến máu
 */
export interface BloodDonation {
  MaDKiHienMau: string;
  IdNguoiHienMau: string;
  HoTen: string;
  MaNhomMau: string;
  ChieuCao: number;
  CanNang: number;
  NhietDo: number;
  NhipTim: number;
  HuyetAp: string;
  TrangThaiHienMau: string;
  NgayHienMau: string;
}

/**
 * Dữ liệu cập nhật trạng thái hiến máu
 */
export interface UpdateDonationStatusData {
  TrangThaiHienMau: string;
  NhietDo?: number;
  NhipTim?: number;
  HuyetAp?: string;
  TTSKKhamSangLoc?: string;
  TTSKSauHien?: string;
  GhiChu?: string;
}

/**
 * Tham số duyệt đăng ký hiến máu
 */
export interface ApproveRegistrationParams {
  registrationId: string;
  status: string;
  note?: string;
}

/**
 * Kết quả trạng thái tiếp nhận đăng ký
 */
export interface RegistrationResponse {
  success: boolean;
  message?: string;
  data?: DANGKIHIENMAU;
}

/**
 * Mối quan hệ chứa thông tin sự kiện và đăng ký hiến máu
 */
export interface RegistrationEventRelation {
  event: DANGKITOCHUCHIENMAU;
  registrations: DANGKIHIENMAU[];
}

/**
 * Kết quả chi tiết đăng ký hiến máu bao gồm thông tin người hiến
 */
export interface RegistrationDetail {
  registration: DANGKIHIENMAU;
  donor: NGUOIDUNG;
}

/**
 * Interface cho kết quả phê duyệt đăng ký hiến máu
 */
export interface ApprovalResult {
  success: boolean;
  message?: string;
}

/**
 * Interface cho trạng thái xử lý phản hồi
 */
export enum TrangThaiPhanHoi {
  CHUA_XU_LY = 'CHUA_XU_LY',
  DANG_XU_LY = 'DANG_XU_LY',
  DA_XU_LY = 'DA_XU_LY'
}

/**
 * Interface cho phản hồi kèm thông tin người hiến máu
 */
export interface PhanHoiWithUserInfo extends PHANHOI {
  NguoiHienMau?: NGUOIDUNG;
  DangKyHienMau?: DANGKIHIENMAU;
  TrangThaiXuLy: TrangThaiPhanHoi;
  GhiChuXuLy?: string;
}

/**
 * Interface cho thông tin cập nhật trạng thái xử lý phản hồi
 */
export interface UpdateFeedbackStatusData {
  trangThaiXuLy: TrangThaiPhanHoi;
  ghiChuXuLy: string;
}