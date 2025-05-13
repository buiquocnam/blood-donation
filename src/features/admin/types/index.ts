import { 
  NGUOIDUNG, 
  NGUOIDUNG_WithRole, 
  COSOTINHNGUYEN, 
  COSOTINHNGUYEN_WithLocation,
  VAITRO
} from '@/types';

/**
 * Kiểu dữ liệu cho bộ lọc người dùng
 */
export interface UserFilter {
  role?: string;
  status?: boolean;
  searchTerm?: string;
}

/**
 * Kiểu dữ liệu cho bộ lọc cơ sở tình nguyện
 */
export interface VolunteerCenterFilter {
  status?: boolean;
  searchTerm?: string;
}

/**
 * Kiểu dữ liệu phản hồi cập nhật trạng thái
 */
export interface UpdateStatusResponse {
  success: boolean;
  message: string;
}

/**
 * Kiểu dữ liệu phản hồi cập nhật vai trò
 */
export interface UpdateRoleResponse {
  success: boolean;
  message: string;
}

/**
 * Kiểu dữ liệu phản hồi khi xóa tài khoản
 */
export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

/**
 * Kiểu dữ liệu cho tham số tab đang active
 */
export type AdminTabType = 'users' | 'volunteer'; 