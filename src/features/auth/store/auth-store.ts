import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser, AuthState, RegisterData, VolunteerCenterRegisterData, LoginCredentials } from "@/features/auth/types";
import { AuthService } from "../services/auth-service";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          // Attempt to use the AuthService
          const user = await AuthService.login(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        // Call the AuthService logout
        AuthService.logout().catch(console.error);
        set({ user: null, isAuthenticated: false });
      },
      
      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          // Use the AuthService register method
          const newUser = await AuthService.register(userData);
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return newUser;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      registerVolunteerCenter: async (data: VolunteerCenterRegisterData) => {
        set({ isLoading: true });
        
        try {
          // Use the AuthService register method for volunteer centers
          const newCenter = await AuthService.registerVolunteerCenter(data);
          set({ user: newCenter, isAuthenticated: true, isLoading: false });
          return newCenter;
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