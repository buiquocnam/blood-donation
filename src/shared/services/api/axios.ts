import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Thêm token xác thực vào header nếu đang ở client side
axiosInstance.interceptors.request.use(
  (config) => {
    // Kiểm tra xem có đang ở môi trường trình duyệt không
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
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

// Response Interceptor: Xử lý refresh token khi token hết hạn (chỉ ở client side)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isClient = typeof window !== 'undefined';
    
    if (isClient && error.response?.status === 401) {
      const originalRequest = error.config;
      
      // Tránh vòng lặp vô hạn nếu refresh token cũng thất bại
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          
          const { accessToken } = response.data;
          localStorage.setItem('auth_token', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 