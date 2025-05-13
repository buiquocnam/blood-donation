import { NGUOIDUNG, COSOTINHNGUYEN } from "@/types";
/**
 * State quản lý xác thực người dùng
 */

export type AuthUser = NGUOIDUNG | COSOTINHNGUYEN;

export type UserRole = "ROLE_DONOR" | "ROLE_MEDICAL" | "ROLE_DOCTOR" | "ROLE_VOLUNTEER" | "ROLE_DIRECTOR" | "ROLE_ADMIN";

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean; // đã xác thực hay chưa
  isLoading: boolean; // đang tải
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<NGUOIDUNG>;
  registerVolunteerCenter: (data: VolunteerCenterRegisterData) => Promise<COSOTINHNGUYEN>;
}

/**
 * Thông tin đăng nhập
 */
export interface LoginCredentials {
  email: string;
  password: string; // mật khẩu
}

/**
 * Dữ liệu đăng ký cho người dùng thông thường (người hiến máu)
 */
export interface RegisterData {
  HoTen: string;
  Email: string;
  MatKhau: string;
  XacNhanMatKhau: string;
  SDT: string;
  NgaySinh: string;
  GioiTinh: string;
  CCCD: string;
  MaNhomMau?: string;
  tenDiaChi: string;
  IdPhuong: string; 
  MaVaiTro: string;
}

/**
 * Dữ liệu đăng ký cho trưởng cơ sở tình nguyện
 */
export interface VolunteerCenterRegisterData {
  TenCoSoTinhNguyen: string;
  DiaChi: string;
  IdPhuong: string;
  MinhChung: string;
  Email: string;
  SDT: string;
  UserName: string;
  NguoiPhuTrach: string; // Tên người phụ trách
  MatKhau: string;
  XacNhanMatKhau: string;
  MaVaiTro: string;
}