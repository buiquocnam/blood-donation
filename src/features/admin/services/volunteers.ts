import { COSOTINHNGUYEN_WithLocation } from '@/types';
import { mockCoSoTinhNguyen } from '@/mock/volunteers';
import { mockPhuong } from '@/mock/location';
import { 
  VolunteerCenterFilter,
  UpdateStatusResponse,
  DeleteAccountResponse
} from '../types';

/**
 * Lấy danh sách tất cả cơ sở tình nguyện với thông tin địa điểm
 */
export async function getAllVolunteerCenters(): Promise<COSOTINHNGUYEN_WithLocation[]> {
  // Trong môi trường thực tế, gọi API ở đây
  return mockCoSoTinhNguyen.map(center => ({
    ...center,
    Phuong: mockPhuong.find(phuong => phuong.IdPhuong === center.IdPhuong)
  }));
}

/**
 * Lấy danh sách cơ sở tình nguyện theo bộ lọc
 */
export async function getVolunteerCentersByFilter(filter: VolunteerCenterFilter): Promise<COSOTINHNGUYEN_WithLocation[]> {
  // Lấy tất cả cơ sở tình nguyện
  const allCenters = await getAllVolunteerCenters();
  
  // Lọc theo các điều kiện
  return allCenters.filter(center => {
    // Lọc theo trạng thái
    if (filter.status !== undefined && center.TinhTrang !== filter.status) {
      return false;
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (filter.searchTerm) {
      const searchTermLower = filter.searchTerm.toLowerCase();
      return (
        center.TenCoSoTinhNguyen.toLowerCase().includes(searchTermLower) ||
        center.Email.toLowerCase().includes(searchTermLower) ||
        center.SDT.includes(filter.searchTerm) ||
        center.NguoiPhuTrach.toLowerCase().includes(searchTermLower)
      );
    }
    
    return true;
  });
}

/**
 * Lấy thông tin cơ sở tình nguyện theo ID
 */
export async function getVolunteerCenterById(centerId: string): Promise<COSOTINHNGUYEN_WithLocation | null> {
  const centers = await getAllVolunteerCenters();
  return centers.find(center => center.IDCoSoTinhNguyen === centerId) || null;
}

/**
 * Cập nhật trạng thái cơ sở tình nguyện
 */
export async function updateVolunteerCenterStatus(
  centerId: string, 
  status: boolean
): Promise<UpdateStatusResponse> {
  // Trong môi trường thực tế, gọi API PUT ở đây
  
  // Giả lập cập nhật thành công
  return {
    success: true,
    message: `Đã ${status ? 'kích hoạt' : 'khóa'} cơ sở tình nguyện thành công`
  };
}

/**
 * Xóa cơ sở tình nguyện
 */
export async function deleteVolunteerCenter(centerId: string): Promise<DeleteAccountResponse> {
  // Trong môi trường thực tế, gọi API DELETE ở đây
  
  // Giả lập xóa thành công
  return {
    success: true,
    message: `Đã xóa cơ sở tình nguyện thành công`
  };
} 