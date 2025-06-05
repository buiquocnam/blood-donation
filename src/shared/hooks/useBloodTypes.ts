import { useQuery } from '@tanstack/react-query';
import { bloodService } from '@/shared/services/bloodService';
import type { NHOMMAU } from '@/types';

export const BLOOD_TYPES_KEYS = {
  all: ['blood-types'] as const,
  lists: () => [...BLOOD_TYPES_KEYS.all, 'list'] as const,
} as const;

/**
 * Hook lấy danh sách nhóm máu
 */
export function useBloodTypes() {
  return useQuery({
    queryKey: BLOOD_TYPES_KEYS.lists(),
    queryFn: () => bloodService.getBloodTypes(),
  });
}


/**
 * Hook lấy danh sách nhóm máu dạng options cho select
 */
export function useBloodTypeOptions() {
  const { data: bloodTypes = [], ...rest } = useBloodTypes();

  const options = bloodTypes.map((bloodType) => ({
    value: bloodType.MaNhomMau,
    label: bloodType.MoTaNhomMau,
  }));

  return {
    options,
    ...rest,
  };
}

/**
 * Hook lấy tên nhóm máu từ mã
 */
export function useBloodTypeName(code: string) {
  const { data: bloodType, ...rest } = useBloodTypes();

  return {
    bloodTypeName: bloodType?.find((bloodType) => bloodType.MaNhomMau === code)?.MoTaNhomMau,
    ...rest,
  };
} 