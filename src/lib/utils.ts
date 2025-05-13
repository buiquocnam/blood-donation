import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Kết hợp nhiều lớp CSS và xử lý xung đột với Tailwind
 * @param inputs - Các lớp CSS cần kết hợp
 * @returns Chuỗi lớp CSS đã được kết hợp và xử lý xung đột
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Định dạng ngày tháng theo tiêu chuẩn Việt Nam
 * @param dateString - Chuỗi ngày tháng cần định dạng
 * @returns Chuỗi ngày tháng đã được định dạng (DD/MM/YYYY)
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Kiểm tra date có hợp lệ không
  if (isNaN(date.getTime())) return '';
  
  // Lấy ngày, tháng, năm
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
} 