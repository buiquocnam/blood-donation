import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useAuthCheck = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có token trong localStorage không
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userInfo = localStorage.getItem('user_info');
        setIsAuthenticated(!!token && !!userInfo);
      }
    };

    checkAuth();
  }, []);

  const requireAuth = (callback?: () => void) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này');
      router.push('/auth/login');
      return false;
    }
    
    if (callback) {
      callback();
    }
    return true;
  };

  return {
    isAuthenticated,
    requireAuth
  };
}; 