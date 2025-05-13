import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date sang định dạng tiếng Việt
 * @param dateString Chuỗi ngày cần format
 * @param formatPattern Mẫu định dạng, mặc định là 'HH:mm - dd/MM/yyyy'
 * @returns Chuỗi đã được định dạng
 */
export function formatDate(dateString?: string | Date, formatPattern: string = 'HH:mm - dd/MM/yyyy'): string {
  if (!dateString) return 'Không xác định';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, formatPattern, { locale: vi });
  } catch (error) {
    console.error('Lỗi khi format date:', error);
    return typeof dateString === 'string' ? dateString : 'Không xác định';
  }
}

/**
 * Format date sang định dạng ngày-tháng-năm
 * @param dateString Chuỗi ngày cần format
 * @returns Chuỗi đã được định dạng ngày-tháng-năm
 */
export function formatDateOnly(dateString?: string | Date): string {
  return formatDate(dateString, 'dd/MM/yyyy');
}

/**
 * Format date sang định dạng giờ:phút
 * @param dateString Chuỗi ngày cần format
 * @returns Chuỗi đã được định dạng giờ:phút
 */
export function formatTimeOnly(dateString?: string | Date): string {
  return formatDate(dateString, 'HH:mm');
}

/**
 * Format date sang định dạng đầy đủ
 * @param dateString Chuỗi ngày cần format
 * @returns Chuỗi đã được định dạng đầy đủ
 */
export function formatFullDateTime(dateString?: string | Date): string {
  return formatDate(dateString, 'HH:mm:ss - dd/MM/yyyy');
} 