import { LoginCredentials, RegisterData, AuthUser, VolunteerCenterRegisterData } from "@/features/auth/types";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints";
import { NGUOIDUNG, COSOTINHNGUYEN } from "@/types";
import api from "@/lib/api/client";

// Cấu trúc response từ API
export interface ApiResponse<T> {
  code: number;
  result: T;
}

/**
 * Dịch vụ xác thực người dùng
 * Xử lý các yêu cầu API liên quan đến xác thực
 */
export class AuthService {
  /**
   * Đăng nhập
   * @param credentials Thông tin đăng nhập
   * @returns ApiResponse với user data và token
   */
  public static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      // Sử dụng một endpoint duy nhất cho cả hai loại tài khoản
      const endpoint = AUTH_ENDPOINTS.LOGIN;
      
      // Gửi request đến API
      const response = await api.post<ApiResponse<AuthUser>>(endpoint, credentials);
      
      // Trả về toàn bộ response để store xử lý lưu token
      return response.data;
    } catch (error) {
      console.error("[AuthService] Lỗi đăng nhập:", error);
      throw new Error('Thông tin đăng nhập không chính xác');
    }
  }

  /**
   * Đăng xuất
   */
  public static async logout(): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
      // Không xóa token, để store xử lý
    } catch (error) {
      console.error("[AuthService] logout error:", error);
      throw error; // Trả về lỗi để store xử lý
    }
  }

  /**
   * Đăng ký người dùng thông thường (người hiến máu)
   * @param userData Thông tin đăng ký người dùng
   * @returns ApiResponse với user data và token
   */
  public static async register(userData: RegisterData): Promise<ApiResponse<NGUOIDUNG>> {
    try {
      // Chuẩn bị dữ liệu để gửi đến API
      const payload = {
        ...userData,
        MaVaiTro: userData.MaVaiTro || 'donor'
      };

      const response = await api.post<ApiResponse<NGUOIDUNG>>(AUTH_ENDPOINTS.REGISTER, payload);
      
      // Trả về toàn bộ response để store xử lý lưu token
      return response.data;
    } catch (error) {
      console.error("[AuthService] register error:", error);
      throw new Error('Đăng ký thất bại. Vui lòng thử lại sau.');
    }
  }

  /**
   * Đăng ký trưởng cơ sở tình nguyện
   * @param data Thông tin đăng ký cơ sở tình nguyện
   * @returns ApiResponse với center data và token
   */
  public static async registerVolunteerCenter(data: VolunteerCenterRegisterData): Promise<ApiResponse<COSOTINHNGUYEN>> {
    try {
      // Chuẩn bị dữ liệu để gửi đến API
      const payload = {
        TenCoSoTinhNguyen: data.TenCoSoTinhNguyen,
        Email: data.Email,
        MatKhau: data.MatKhau,
        SDT: data.SDT,
        NguoiPhuTrach: data.NguoiPhuTrach,
        UserName: data.UserName || data.Email, // Tự động lấy từ email nếu chưa có
        DiaChi: data.DiaChi || '',
        IdPhuong: data.IdPhuong.toString() || '',
        MaVaiTro: data.MaVaiTro || 'ROLE_VOLUNTEER_MANAGER',
      };
      
      // Gọi API với dữ liệu JSON
      const response = await api.post<ApiResponse<COSOTINHNGUYEN>>(
        AUTH_ENDPOINTS.REGISTER_VOLUNTEER_CENTER, 
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Trả về toàn bộ response để store xử lý lưu token
      return response.data;
    } catch (error) {
      console.error("[AuthService] registerVolunteerCenter error:", error);
      throw new Error('Đăng ký cơ sở tình nguyện thất bại. Vui lòng thử lại sau.');
    }
  }

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns Thông tin người dùng đang đăng nhập
   */
  public static async getCurrentUser(): Promise<AuthUser> {
    try {
      const response = await api.get<ApiResponse<AuthUser>>(AUTH_ENDPOINTS.ME);
      return response.data.result;
    } catch (error) {
      console.error("[AuthService] getCurrentUser error:", error);
      throw new Error('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
    }
  }
  
  /**
   * Kiểm tra phiên đăng nhập
   * @returns True nếu người dùng đã đăng nhập
   */
  public static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  }
  
  /**
   * Lấy thông tin người dùng từ localStorage
   * @returns Thông tin cơ bản của người dùng hoặc null nếu chưa đăng nhập
   */
  public static getUserInfo(): { id: string; role: string; name: string; isCenter: boolean } | null {
    if (typeof window === 'undefined') return null;
    
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) return null;
    
    try {
      return JSON.parse(userInfo);
    } catch (error) {
      console.error("[AuthService] Lỗi khi đọc thông tin người dùng:", error);
      return null;
    }
  }
} 