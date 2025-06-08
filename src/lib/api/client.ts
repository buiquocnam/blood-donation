import axios from 'axios';

export const authEvents = {
  tokenExpired: new CustomEvent('auth:token-expired'),
  networkError: new CustomEvent('auth:network-error')
};

// Danh sách các endpoint không cần token
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/register/center'
];

// Tạo một instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token xác thực
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (chỉ hoạt động phía client)
    if (typeof window !== 'undefined') {
      try {
        // Kiểm tra xem endpoint có cần token không
        const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
          config.url?.includes(endpoint)
        );

        if (!isPublicEndpoint) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            if (config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } else {
            console.error(`[API Client] No token available for protected request to ${config.url}`);
          }
        }
      } catch (error) {
        console.error('Server: Lỗi đọc token từ localStorage:', error);
      }
    } else {
      console.log(`[API Client] Running on server for ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Client] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error or server not responding');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(authEvents.networkError);
      }
      return Promise.reject({ 
        message: 'Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng' 
      });
    }
    
    if (error.response?.status === 401) {
      console.log('Unauthorized access, token expired or invalid');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(authEvents.tokenExpired);
      }
      
      return Promise.reject({
        response: error.response,
        message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
      });
    }
    
    return Promise.reject(error);
  }
);

export default api; 