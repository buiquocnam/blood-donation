export type UserRole = 'donor' | 'medical_staff' | 'doctor' | 'volunteer_center_manager' | 'blood_bank_director' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<User>;
}

export interface RegisterData extends Omit<User, 'id'> {
  password: string;
} 
export interface LoginCredentials {
  email: string;
  password: string;
} 
