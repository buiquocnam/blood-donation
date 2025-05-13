'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDanhSachChoKham,
  getDanhSachDaHienMau,
  getDanhSachKhongDuDieuKien,
  getChiTietDangKyHienMau,
  capNhatSucKhoeSauKham
} from '../services';
import { CapNhatSucKhoe } from '../types';

/**
 * Hook sử dụng cho quản lý hiến máu của bác sĩ
 * @param idSuKien ID sự kiện hiến máu
 */
export function useQuanLyHienMau(idSuKien: string) {
  const queryClient = useQueryClient();

  // Query để lấy danh sách chờ khám
  const choKhamQuery = useQuery({
    queryKey: ['dangKyHienMau', 'choKham', idSuKien],
    queryFn: () => getDanhSachChoKham(idSuKien),
    enabled: !!idSuKien,
  });

  // Query để lấy danh sách đã hiến máu
  const daHienMauQuery = useQuery({
    queryKey: ['dangKyHienMau', 'daHienMau', idSuKien],
    queryFn: () => getDanhSachDaHienMau(idSuKien),
    enabled: !!idSuKien,
  });

  // Query để lấy danh sách không đủ điều kiện
  const khongDuDieuKienQuery = useQuery({
    queryKey: ['dangKyHienMau', 'khongDuDieuKien', idSuKien],
    queryFn: () => getDanhSachKhongDuDieuKien(idSuKien),
    enabled: !!idSuKien,
  });

  // Query để lấy chi tiết đăng ký hiến máu
  const getChiTiet = (maDangKy: string) => {
    return useQuery({
      queryKey: ['chiTietDangKyHienMau', maDangKy],
      queryFn: () => getChiTietDangKyHienMau(maDangKy),
      enabled: !!maDangKy,
    });
  };

  // Mutation để cập nhật thông tin sức khỏe sau khám
  const capNhatSucKhoeMutation = useMutation({
    mutationFn: (data: CapNhatSucKhoe) => capNhatSucKhoeSauKham(data),
    onSuccess: () => {
      // Invalidate relevant queries when update is successful
      queryClient.invalidateQueries({ queryKey: ['dangKyHienMau', 'choKham'] });
      queryClient.invalidateQueries({ queryKey: ['dangKyHienMau', 'daHienMau'] });
      queryClient.invalidateQueries({ queryKey: ['dangKyHienMau', 'khongDuDieuKien'] });
      queryClient.invalidateQueries({ queryKey: ['chiTietDangKyHienMau'] });
    },
  });

  return {
    choKhamQuery,
    daHienMauQuery,
    khongDuDieuKienQuery,
    getChiTiet,
    capNhatSucKhoeMutation,
  };
} 