import { useEffect, useState } from 'react';

/**
 * Hook để trì hoãn cập nhật giá trị, giúp tránh việc gọi API liên tục khi người dùng nhập
 * @param value Giá trị cần trì hoãn
 * @param delay Thời gian trì hoãn tính bằng milliseconds
 * @returns Giá trị sau khi đã trì hoãn
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Tạo timeout để cập nhật giá trị sau thời gian delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Xóa timeout nếu giá trị thay đổi trước khi hết thời gian delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 