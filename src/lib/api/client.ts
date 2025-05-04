import axios from 'axios';

// Tạo một instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token xác thực
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (chỉ hoạt động phía client)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi API
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thực hiện refresh token (nếu có)
        // const refreshToken = localStorage.getItem('refresh_token');
        // Gọi API để refresh token

        // Nếu refresh thành công, thử lại request ban đầu
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh không thành công, đăng xuất người dùng
        if (typeof window !== 'undefined') {
          // Xóa token và chuyển về trang đăng nhập
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 