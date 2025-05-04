export type UserRole = 
  | "donor" // người hiến máu
  | "medical_staff" // nhân viên y tế
  | "doctor" // bác sĩ
  | "volunteer_center_manager" // trưởng cơ sở tình nguyện
  | "blood_bank_director" // giám đốc ngân hàng máu
  | "admin"; // quản trị viên

export interface User {
  id: string;
  name: string; // tên
  email: string;
  role: UserRole; // vai trò
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean; // đã xác thực hay chưa
  isLoading: boolean; // đang tải
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string; // mật khẩu
}

export interface RegisterData {
  name: string; // tên
  email: string;
  password: string; // mật khẩu
  role: UserRole; // vai trò
} 