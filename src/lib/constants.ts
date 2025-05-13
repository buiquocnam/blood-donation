/**
 * Hằng số cho toàn bộ ứng dụng
 */

// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Thời gian hiển thị thông báo (ms)
export const TOAST_DURATION = 5000;

// Số lượng item trên mỗi trang
export const DEFAULT_PAGE_SIZE = 10;

// Hằng số cho upload files
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Hằng số cho phân trang
export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE,
  MAX_DISPLAY_PAGES: 5,
};

// Độ tuổi hợp lệ để hiến máu
export const BLOOD_DONATION_AGE_RANGE = {
  MIN: 18,
  MAX: 60,
};

// Thời gian tối thiểu giữa 2 lần hiến máu (ngày)
export const MIN_DAYS_BETWEEN_DONATIONS = 90; // 3 tháng 