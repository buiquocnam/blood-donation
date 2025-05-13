import { LoginCredentials, RegisterData, AuthUser, VolunteerCenterRegisterData } from "@/features/auth/types";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints";
import { NGUOIDUNG, COSOTINHNGUYEN } from "@/types";
import { mockNguoiDung } from "@/mock/users";
import { mockCoSoTinhNguyen } from "@/mock/volunteers";
import api from "@/lib/api/client";
import router from "next/router";

/**
 * Dịch vụ xác thực người dùng
 * Xử lý các yêu cầu API liên quan đến xác thực
 */
export class AuthService {
  /**
   * Đăng nhập
   * @param credentials Thông tin đăng nhập
   * @returns NGUOIDUNG_WithRole hoặc COSOTINHNGUYEN_WithLocation tùy theo loại tài khoản
   */
  public static async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
      
      // Lưu token vào localStorage (được xử lý bởi interceptor trong client.ts)
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error("[AuthService] login error:", error);
      
      // Giả lập đăng nhập thành công (chỉ trong quá trình phát triển)
      // Sẽ được xóa khi triển khai API thực tế
      if (credentials.email === 'donor@example.com' && credentials.password === 'password') {
        // Giả lập người dùng thông thường (người hiến máu)
        return {
          ...mockNguoiDung[1], // Người dùng với vai trò donor
          MatKhau: '' // Không trả về mật khẩu
        };
      } else if (credentials.email === 'staff@example.com' && credentials.password === 'password') {
        return {
          ...mockNguoiDung[2], // Người dùng với vai trò staff
          MatKhau: '' // Không trả về mật khẩu
        };
      } else if (credentials.email === 'doctor@example.com' && credentials.password === 'password') {
        // Giả lập bác sĩ
        return {
          ...mockNguoiDung[3], // Người dùng với vai trò doctor
          MatKhau: '' // Không trả về mật khẩu
        };
      }
      
      else if (credentials.email === 'volunteer@example.com' && credentials.password === 'password') {
        // Giả lập trưởng cơ sở tình nguyện
        return {
          ...mockCoSoTinhNguyen[0], // Cơ sở tình nguyện đầu tiên
          MatKhau: '' // Không trả về mật khẩu
        };
      } else if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        // Admin
        return {
          ...mockNguoiDung[6],
          MatKhau: '' // Không trả về mật khẩu
        };
      } else if (credentials.email === 'director@example.com' && credentials.password === 'password') {
        // Giám đốc ngân hàng máu
        return {
          ...mockNguoiDung[5], // Người dùng với vai trò blood_bank_director
          MatKhau: '' // Không trả về mật khẩu
        };
      }
      
      throw new Error('Thông tin đăng nhập không chính xác');
    }
  }

  /**
   * Đăng xuất
   */
  public static async logout(): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
      // Xóa token từ localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error("[AuthService] logout error:", error);
      // Không ném lỗi khi đăng xuất để người dùng luôn có thể đăng xuất
      // Xóa token từ localStorage ngay cả khi API thất bại
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * Đăng ký người dùng thông thường (người hiến máu)
   * @param userData Thông tin đăng ký người dùng
   * @returns Thông tin người dùng đã đăng ký
   */
  public static async register(userData: RegisterData): Promise<NGUOIDUNG> {
    try {
      // Chuẩn bị dữ liệu để gửi đến API
      const payload = {
        ...userData,
        MaVaiTro: userData.MaVaiTro || 'donor'
      };

      const response = await api.post(AUTH_ENDPOINTS.REGISTER, payload);
      return response.data;
    } catch (error) {
      console.error("[AuthService] register error:", error);
      
      // Giả lập đăng ký thành công (chỉ trong quá trình phát triển)
      // Sẽ được xóa khi triển khai API thực tế
      const newUser: NGUOIDUNG = {
        MaNguoiDung: `user_${Date.now().toString(36)}`,
        MaVaiTro: userData.MaVaiTro || 'donor',
        HoTen: userData.HoTen,
        NgaySinh: userData.NgaySinh,
        Email: userData.Email,
        SDT: userData.SDT,
        MatKhau: '',
        GioiTinh: userData.GioiTinh === '1',
        CCCD: userData.CCCD,
        MaNhomMau: userData.MaNhomMau || '',
        AnhDaiDien: '',
        tenDiaChi: userData.tenDiaChi,
        IdPhuong: userData.IdPhuong,
        TinhTrangTK: true,
        NgayTao: new Date().toISOString(),
      };
      return newUser;
    }
  }

  /**
   * Đăng ký trưởng cơ sở tình nguyện
   * @param data Thông tin đăng ký cơ sở tình nguyện
   * @returns Thông tin cơ sở tình nguyện đã đăng ký
   */
  public static async registerVolunteerCenter(data: VolunteerCenterRegisterData): Promise<COSOTINHNGUYEN> {
    try {
      // Đảm bảo các trường tính toán được gán giá trị
      const payload = {
        ...data,
        NguoiPhuTrach: data.NguoiPhuTrach,
        UserName: data.UserName || data.Email,
        MaVaiTro: data.MaVaiTro || 'volunteer_center_manager'
      };
      
      const response = await api.post(AUTH_ENDPOINTS.REGISTER_VOLUNTEER_CENTER, payload);
      return response.data;
    } catch (error) {
      console.error("[AuthService] registerVolunteerCenter error:", error);
      
      // Giả lập đăng ký thành công (chỉ trong quá trình phát triển)
      // Sẽ được xóa khi triển khai API thực tế
      const newCenter: COSOTINHNGUYEN = {
        IDCoSoTinhNguyen: `cs_${Date.now().toString(36)}`,
        TenCoSoTinhNguyen: data.TenCoSoTinhNguyen,
        DiaChi: data.DiaChi,
        SDT: data.SDT,
        Email: data.Email,
        IdPhuong: data.IdPhuong,
        NguoiPhuTrach: data.NguoiPhuTrach,
        MinhChung: data.MinhChung || '',
        UserName: data.UserName || data.Email,
        MatKhau: '',
        TinhTrang: true,
        NgayTao: new Date().toISOString(),
        MaVaiTro: data.MaVaiTro || 'volunteer_center_manager',
      };
      return newCenter;
    }
  }

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns Thông tin người dùng đang đăng nhập
   */
  public static async getCurrentUser(): Promise<AuthUser> {
    try {
      const response = await api.get(AUTH_ENDPOINTS.ME);
      return response.data;
    } catch (error) {
      console.error("[AuthService] getCurrentUser error:", error);
      throw error;
    }
  }
} 