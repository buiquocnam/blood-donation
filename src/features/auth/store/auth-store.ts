import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser, AuthState, RegisterData, VolunteerCenterRegisterData, LoginCredentials } from "@/features/auth/types";
import { AuthService, ApiResponse } from "../services/auth-service";
import { COSOTINHNGUYEN, NGUOIDUNG } from "@/types";

/**
 * Lưu token vào localStorage
 */
const saveTokens = (response: any) => {
  if (!response) return;
  
  // Kiểm tra và lưu token một cách an toàn
  if (response.token) {
    localStorage.setItem('auth_token', response.token);
  }
  
  if (response.refreshToken) {
    localStorage.setItem('refresh_token', response.refreshToken);
  }
};

/**
 * Lưu thông tin cơ bản của người dùng
 */
const saveUserInfo = (user: AuthUser, isCenter: boolean) => {
  const userInfo = {
    id: isCenter 
      ? (user as COSOTINHNGUYEN).IDCoSoTinhNguyen 
      : (user as NGUOIDUNG).MaNguoiDung,
    role: user.MaVaiTro,
    name: isCenter 
      ? (user as COSOTINHNGUYEN).TenCoSoTinhNguyen 
      : (user as NGUOIDUNG).HoTen,
    isCenter
  };
  
  localStorage.setItem('user_info', JSON.stringify(userInfo));
};

/**
 * Xóa tất cả thông tin xác thực khỏi localStorage
 */
const clearAuthData = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          // Gọi service đăng nhập
          const response = await AuthService.login(credentials);
                    // Lưu token và thông tin người dùng
          saveTokens(response.result);
          
          if (response.result) {
            saveUserInfo(response.result, credentials.isCenter);
          }
          
          // Cập nhật state
          set({ 
            user: response.result, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return response.result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        // Gọi service đăng xuất và xóa token
        AuthService.logout().catch(error => {
          console.error("Lỗi khi đăng xuất:", error);
        });
        
        // Xóa dữ liệu xác thực
        clearAuthData();
        
        // Reset state
        set({ user: null, isAuthenticated: false });
      },
      
      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          // Gọi service đăng ký
          const response = await AuthService.register(userData);
          
          // Lưu token nếu API trả về
          saveTokens(response);
          
          if (response.result) {
            saveUserInfo(response.result, false); // người dùng thông thường
          }
          
          // Cập nhật state
          set({ 
            user: response.result, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return response.result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      registerVolunteerCenter: async (data: VolunteerCenterRegisterData) => {
        set({ isLoading: true });
        
        try {
          // Gọi service đăng ký cơ sở tình nguyện
          const response = await AuthService.registerVolunteerCenter(data);
          
          // Lưu token nếu API trả về
          saveTokens(response);
          
          if (response.result) {
            saveUserInfo(response.result, true); // cơ sở tình nguyện
          }
          
          // Cập nhật state
          set({ 
            user: response.result, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return response.result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      // Lưu trữ user, isAuthenticated vào localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 