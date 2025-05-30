import { NGUOIDUNG, COSOTINHNGUYEN } from "@/types";
/**
 * State quản lý xác thực người dùng
 */

export type AuthUser = (NGUOIDUNG | COSOTINHNGUYEN) & {
  token?: string;
  refreshToken?: string;
  MaVaiTro: string;
};

export type UserRoleType = 
  | "ROLE_DONOR"             // Người hiến máu
  | "ROLE_DOCTOR"            // Bác sĩ
  | "ROLE_MEDICAL_STAFF"     // Nhân viên duyệt
  | "ROLE_VOLUNTEER_MANAGER" // Trưởng cơ sở tình nguyện
  | "ROLE_BLOOD_DIRECTOR"    // Giám đốc ngân hàng máu
  | "ROLE_ADMIN";            // Quản trị viên

export const UserRole = {
  ROLE_DONOR: "ROLE_DONOR" as const,
  ROLE_DOCTOR: "ROLE_DOCTOR" as const,
  ROLE_MEDICAL_STAFF: "ROLE_MEDICAL_STAFF" as const,
  ROLE_VOLUNTEER_MANAGER: "ROLE_VOLUNTEER_MANAGER" as const,
  ROLE_BLOOD_DIRECTOR: "ROLE_BLOOD_DIRECTOR" as const,
  ROLE_ADMIN: "ROLE_ADMIN" as const
};

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean; // đã xác thực hay chưa
  isLoading: boolean; // đang tải

  /**
   * Đăng nhập người dùng
   * @param credentials Thông tin đăng nhập
   * @returns Dữ liệu người dùng sau khi đăng nhập thành công
   */
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  
  /**
   * Đăng xuất người dùng
   */
  logout: () => void;
  
  /**
   * Đăng ký người dùng thông thường
   * @param userData Thông tin đăng ký
   * @returns Dữ liệu người dùng sau khi đăng ký thành công
   */
  register: (userData: RegisterData) => Promise<NGUOIDUNG>;
  
  /**
   * Đăng ký cơ sở tình nguyện
   * @param data Thông tin đăng ký
   * @returns Dữ liệu cơ sở sau khi đăng ký thành công
   */
  registerVolunteerCenter: (data: VolunteerCenterRegisterData) => Promise<COSOTINHNGUYEN>;
}

/**
 * Thông tin đăng nhập
 */
export interface LoginCredentials {
  /**
   * Email hoặc tên đăng nhập. Đây là trường dùng để đăng nhập.
   * Có thể là email của người hiến máu hoặc người dùng khác,
   * hoặc username của cơ sở tình nguyện.
   */
  Email: string;
  
  /**
   * Mật khẩu đăng nhập
   */
  MatKhau: string;
  
  /**
   * Đánh dấu đăng nhập của cơ sở tình nguyện (true) 
   * hoặc người dùng thông thường (false)
   */
  isCenter: boolean;
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
  MinhChung: string | File | null;
  Email: string;
  SDT: string;
  UserName: string;
  NguoiPhuTrach: string; // Tên người phụ trách
  MatKhau: string;
  XacNhanMatKhau: string;
  MaVaiTro: string;
}