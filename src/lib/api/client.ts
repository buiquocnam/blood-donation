import axios from 'axios';

export const authEvents = {
  tokenExpired: new CustomEvent('auth:token-expired'),
  networkError: new CustomEvent('auth:network-error')
};
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
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Gắn token vào header an toàn với TypeScript
          if (config.headers) {
            // Sử dụng object literal để tránh lỗi TypeScript
            config.headers.Authorization = `Bearer ${token}`;
          }
          // Log chi tiết để debug
          console.log(`[API Client] Request to ${config.url}`);
          console.log(`[API Client] Token: ${token}`);
          console.log(`[API Client] Headers:`, config.headers);
          
        } else {
          console.error(`[API Client] No token available for request to ${config.url}`);
          console.log('[API Client]           ', {
            auth_token: localStorage.getItem('auth_token'),
            refresh_token: localStorage.getItem('refresh_token'),
            user_info: localStorage.getItem('user_info')
          });
        }
      } catch (error) {
        console.error('Server: Lỗi đọc token từ localStorage:', error);
      }
    } else {
      // Đang chạy trên server, không có localStorage
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
    // Kiểm tra nếu lỗi là do network hoặc server không phản hồi
    if (!error.response) {
      console.error('Network error or server not responding');
      // Dispatch sự kiện lỗi mạng
      window.dispatchEvent(authEvents.networkError);
      return Promise.reject({ 
        message: 'Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng' 
      });
    }
    
    // Xử lý trường hợp token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      console.log('Unauthorized access, token expired or invalid');
      
      // Dispatch sự kiện token hết hạn
      window.dispatchEvent(authEvents.tokenExpired);
      
      // Gửi lỗi cụ thể về token hết hạn
      return Promise.reject({
        response: error.response,
        message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
      });
    }
    
    return Promise.reject(error);
  }
);


export default api; 