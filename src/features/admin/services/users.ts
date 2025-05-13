import { NGUOIDUNG_WithRole, VAITRO } from '@/types';
import { mockNguoiDung, mockVaiTro } from '@/mock/users';
import { 
  UserFilter,
  UpdateStatusResponse,
  UpdateRoleResponse,
  DeleteAccountResponse
} from '../types';

/**
 * Lấy danh sách tất cả người dùng với thông tin vai trò
 */
export async function getAllUsers(): Promise<NGUOIDUNG_WithRole[]> {
  // Trong môi trường thực tế, gọi API ở đây
  return mockNguoiDung.map(user => ({
    ...user,
    VaiTro: mockVaiTro.find(role => role.MaVaiTro === user.MaVaiTro)
  }));
}

/**
 * Lấy danh sách người dùng theo bộ lọc
 */
export async function getUsersByFilter(filter: UserFilter): Promise<NGUOIDUNG_WithRole[]> {
  // Lấy tất cả người dùng
  const allUsers = await getAllUsers();
  
  // Lọc theo các điều kiện
  return allUsers.filter(user => {
    // Lọc theo vai trò
    if (filter.role && user.MaVaiTro !== filter.role) {
      return false;
    }
    
    // Lọc theo trạng thái
    if (filter.status !== undefined && user.TinhTrangTK !== filter.status) {
      return false;
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (filter.searchTerm) {
      const searchTermLower = filter.searchTerm.toLowerCase();
      return (
        user.HoTen.toLowerCase().includes(searchTermLower) ||
        user.Email.toLowerCase().includes(searchTermLower) ||
        user.SDT.includes(filter.searchTerm)
      );
    }
    
    return true;
  });
}

/**
 * Lấy danh sách tất cả vai trò
 */
export async function getAllRoles(): Promise<VAITRO[]> {
  // Trong môi trường thực tế, gọi API ở đây
  return mockVaiTro;
}

/**
 * Lấy thông tin người dùng theo ID
 */
export async function getUserById(userId: string): Promise<NGUOIDUNG_WithRole | null> {
  const users = await getAllUsers();
  return users.find(user => user.MaNguoiDung === userId) || null;
}

/**
 * Cập nhật trạng thái người dùng
 */
export async function updateUserStatus(
  userId: string, 
  status: boolean
): Promise<UpdateStatusResponse> {
  // Trong môi trường thực tế, gọi API PUT ở đây
  
  // Giả lập cập nhật thành công
  return {
    success: true,
    message: `Đã ${status ? 'kích hoạt' : 'khóa'} tài khoản người dùng thành công`
  };
}

/**
 * Cập nhật vai trò người dùng
 */
export async function updateUserRole(
  userId: string, 
  roleId: string
): Promise<UpdateRoleResponse> {
  // Trong môi trường thực tế, gọi API PUT ở đây
  
  // Giả lập cập nhật thành công
  return {
    success: true,
    message: `Đã cập nhật vai trò người dùng thành công`
  };
}

/**
 * Xóa tài khoản người dùng
 */
export async function deleteUser(userId: string): Promise<DeleteAccountResponse> {
  // Trong môi trường thực tế, gọi API DELETE ở đây
  
  // Giả lập xóa thành công
  return {
    success: true,
    message: `Đã xóa tài khoản người dùng thành công`
  };
}

/**
 * Tạo tài khoản người dùng mới
 */
export async function createUser(userData: {
  hoTen: string;
  email: string;
  sdt: string;
  matKhau: string;
  maVaiTro: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: string;
}): Promise<{ success: boolean; message: string; userId?: string }> {
  // Trong môi trường thực tế, gọi API POST đến endpoint tạo người dùng
  
  // Chuyển đổi gioiTinh từ string sang boolean
  const gioiTinhBoolean = userData.gioiTinh === 'true';
  
  // Mô phỏng tạo mã người dùng mới
  const newUserId = `ND${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  // Giả lập tạo người dùng thành công
  return {
    success: true,
    message: 'Tạo tài khoản người dùng thành công',
    userId: newUserId
  };
} 