'use client';

import { useState, useEffect, useCallback } from 'react';
import { NGUOIDUNG_WithRole, VAITRO } from '@/types';
import { 
  getAllUsers, 
  getUsersByFilter,
  getAllRoles,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  createUser
} from '../services';
import { UserFilter } from '../types';

/**
 * Hook quản lý người dùng cho Admin
 */
export function useAdminUsers(
  initialUsers?: NGUOIDUNG_WithRole[],
  initialRoles?: VAITRO[]
) {
  // State quản lý danh sách người dùng
  const [users, setUsers] = useState<NGUOIDUNG_WithRole[]>(initialUsers || []);
  
  // State quản lý danh sách vai trò
  const [roles, setRoles] = useState<VAITRO[]>(initialRoles || []);
  
  // State quản lý bộ lọc
  const [filter, setFilter] = useState<UserFilter>({});
  
  // State loading
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(!initialUsers);
  
  // State loading khi tạo người dùng
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  
  // Fetch người dùng theo filter
  const fetchUsers = useCallback(async () => {
    if (filter) {
      setIsLoadingUsers(true);
      try {
        const filteredUsers = await getUsersByFilter(filter);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users by filter:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    }
  }, [filter]);
  
  // Fetch vai trò
  const fetchRoles = useCallback(async () => {
    if (!initialRoles) {
      try {
        const allRoles = await getAllRoles();
        setRoles(allRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    }
  }, [initialRoles]);
  
  // Cập nhật trạng thái người dùng
  const handleUpdateStatus = async (userId: string, status: boolean) => {
    try {
      const response = await updateUserStatus(userId, status);
      if (response.success) {
        // Cập nhật state
        setUsers(prevUsers => prevUsers.map(user => 
          user.MaNguoiDung === userId ? { ...user, TinhTrangTK: status } : user
        ));
      }
      return response;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };
  
  // Cập nhật vai trò người dùng
  const handleUpdateRole = async (userId: string, roleId: string) => {
    try {
      const response = await updateUserRole(userId, roleId);
      if (response.success) {
        // Cập nhật state
        setUsers(prevUsers => prevUsers.map(user => {
          if (user.MaNguoiDung === userId) {
            const newRole = roles.find(role => role.MaVaiTro === roleId);
            return { ...user, MaVaiTro: roleId, VaiTro: newRole };
          }
          return user;
        }));
      }
      return response;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };
  
  // Xóa người dùng
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        // Cập nhật state
        setUsers(prevUsers => prevUsers.filter(user => user.MaNguoiDung !== userId));
      }
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  
  // Tạo người dùng mới
  const handleCreateUser = async (userData: {
    hoTen: string;
    email: string;
    sdt: string;
    matKhau: string;
    maVaiTro: string;
    cccd: string;
    ngaySinh: string;
    gioiTinh: string;
  }) => {
    setIsCreatingUser(true);
    try {
      const response = await createUser(userData);
      if (response.success && response.userId) {
        // Làm mới danh sách người dùng
        fetchUsers();
      }
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      setIsCreatingUser(false);
    }
  };
  
  // Fetch dữ liệu khi component mount hoặc filter thay đổi
  useEffect(() => {
    if (!initialUsers || Object.keys(filter).length > 0) {
      fetchUsers();
    }
  }, [fetchUsers, filter, initialUsers]);
  
  // Fetch roles khi component mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);
  
  return {
    users,
    roles,
    isLoadingUsers,
    filter,
    setFilter,
    updateStatus: handleUpdateStatus,
    updateRole: handleUpdateRole,
    deleteUser: handleDeleteUser,
    createUser: handleCreateUser,
    isCreatingUser
  };
}
