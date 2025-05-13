'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NGUOIDUNG_WithRole, VAITRO } from '@/types';
import { 
  getAllUsers, 
  getUsersByFilter, 
  getAllRoles, 
  updateUserStatus as apiUpdateUserStatus,
  updateUserRole as apiUpdateUserRole,
  deleteUser as apiDeleteUser,
  createUser as apiCreateUser
} from '../services';
import { UserFilter } from '../types';

/**
 * Hook quản lý danh sách người dùng trong giao diện Admin
 */
export function useAdminUsers() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<UserFilter>({});

  // Query để lấy danh sách người dùng theo bộ lọc
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: userError,
    refetch: refetchUsers
  } = useQuery<NGUOIDUNG_WithRole[]>({
    queryKey: ['admin', 'users', filter],
    queryFn: () => getUsersByFilter(filter)
  });

  // Query để lấy danh sách vai trò
  const {
    data: roles = [],
    isLoading: isLoadingRoles
  } = useQuery<VAITRO[]>({
    queryKey: ['admin', 'roles'],
    queryFn: getAllRoles
  });

  // Mutation để cập nhật trạng thái người dùng
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: boolean }) => 
      apiUpdateUserStatus(userId, status),
    onSuccess: () => {
      // Làm mới dữ liệu sau khi cập nhật
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  // Mutation để cập nhật vai trò người dùng
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => 
      apiUpdateUserRole(userId, roleId),
    onSuccess: () => {
      // Làm mới dữ liệu sau khi cập nhật
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  // Mutation để xóa người dùng
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiDeleteUser(userId),
    onSuccess: () => {
      // Làm mới dữ liệu sau khi xóa
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  // Mutation để tạo người dùng mới
  const createUserMutation = useMutation({
    mutationFn: (userData: {
      hoTen: string;
      email: string;
      sdt: string;
      matKhau: string;
      maVaiTro: string;
      cccd: string;
      ngaySinh: string;
      gioiTinh: string;
    }) => apiCreateUser(userData),
    onSuccess: () => {
      // Làm mới dữ liệu sau khi tạo
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  // Các hàm tiện ích để sử dụng trực tiếp
  const updateStatus = (userId: string, status: boolean) => {
    updateStatusMutation.mutate({ userId, status });
  };

  const updateRole = (userId: string, roleId: string) => {
    updateRoleMutation.mutate({ userId, roleId });
  };

  return {
    users,
    roles,
    isLoadingUsers,
    isLoadingRoles,
    userError,
    filter,
    setFilter,
    refetchUsers,
    updateStatus,
    updateRole,
    deleteUser: deleteUserMutation.mutate,
    createUser: createUserMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    isUpdatingRole: updateRoleMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isCreatingUser: createUserMutation.isPending
  };
}
