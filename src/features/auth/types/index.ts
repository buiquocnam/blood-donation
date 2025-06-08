import { NGUOIDUNG, COSOTINHNGUYEN } from "@/types";

export type AuthUser = (NGUOIDUNG | COSOTINHNGUYEN) & {
  token?: string;
  refreshToken?: string;
  MaVaiTro: string;
};

export const UserRole = {
  ROLE_DONOR: "ROLE_DONOR" as const,
  ROLE_DOCTOR: "ROLE_DOCTOR" as const,
  ROLE_MEDICAL_STAFF: "ROLE_MEDICAL_STAFF" as const,
  ROLE_VOLUNTEER_MANAGER: "ROLE_VOLUNTEER_MANAGER" as const,
  ROLE_BLOOD_DIRECTOR: "ROLE_BLOOD_DIRECTOR" as const,
  ROLE_ADMIN: "ROLE_ADMIN" as const
} as const;

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<NGUOIDUNG>;
  registerVolunteerCenter: (data: VolunteerCenterRegisterData) => Promise<COSOTINHNGUYEN>;
}

export interface LoginCredentials {
  Email: string;
  MatKhau: string;
  isCenter: boolean;
}

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

export interface VolunteerCenterRegisterData {
  TenCoSoTinhNguyen: string;
  DiaChi: string;
  IdPhuong: string;
  MinhChung: string | File | null;
  Email: string;
  SDT: string;
  UserName: string;
  NguoiPhuTrach: string;
  MatKhau: string;
  XacNhanMatKhau: string;
  MaVaiTro: string;
}