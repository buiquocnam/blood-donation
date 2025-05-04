import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole, AuthState, RegisterData } from "@/features/auth/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        
        try {
          // Giả lập API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Giả lập dữ liệu người dùng - trong thực tế sẽ từ API
          let mockUser: User | null = null;
          
          if (credentials.email === 'donor@example.com' && credentials.password === 'password') {
            mockUser = {
              id: '1',
              name: 'Nguyễn Văn A',
              email: 'donor@example.com',
              role: 'donor',
            };
          } else if (credentials.email === 'staff@example.com' && credentials.password === 'password') {
            mockUser = {
              id: '2',
              name: 'Trần Thị B',
              email: 'staff@example.com',
              role: 'medical_staff',
            };
          } else if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
            mockUser = {
              id: '3',
              name: 'Lê Văn C',
              email: 'admin@example.com',
              role: 'admin',
            };
          } else if (credentials.email === 'doctor@example.com' && credentials. password === 'password') {
            mockUser = {
              id: '4',
              name: 'Phạm Thị D',
              email: 'doctor@example.com',
              role: 'doctor',
            };
          } else if (credentials.email === 'volunteer@example.com' && credentials.password === 'password') {
            mockUser = {
              id: '5',
              name: 'Hoàng Văn E',
              email: 'volunteer@example.com',
              role: 'volunteer_center_manager',
            };
          } else if (credentials.email === 'director@example.com' && credentials.password === 'password') {
            mockUser = {
              id: '6',
              name: 'Vũ Thị F',
              email: 'director@example.com',
              role: 'blood_bank_director',
            };
          } else {
            throw new Error('Thông tin đăng nhập không chính xác');
          }
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return mockUser;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          // Giả lập API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Giả lập đăng ký thành công
          const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            name: userData.name,
            email: userData.email,
            role: userData.role,
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return newUser;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
); 