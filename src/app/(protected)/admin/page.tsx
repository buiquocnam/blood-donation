import { Metadata } from 'next';
import { PageTitle } from '@/components/shared/page-title';
import { AdminTabs } from '@/features/admin';
import { 
  getAllUsers, 
  getAllRoles, 
  getAllVolunteerCenters 
} from '@/features/admin/services';

export const metadata: Metadata = {
  title: 'Quản trị hệ thống',
  description: 'Quản lý thông tin người dùng, nhân viên y tế, bác sĩ, cơ sở tình nguyện và giám đốc',
};

/**
 * Trang quản trị hệ thống
 * Hiển thị giao diện quản lý toàn bộ hệ thống cho Admin
 */
export default async function AdminPage() {
  // Fetch initial data at page level (SSR)
  const initialData = await fetchInitialData();
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <PageTitle 
        title="Quản trị hệ thống" 
        description="Quản lý thông tin người dùng, nhân viên y tế, bác sĩ, cơ sở tình nguyện và giám đốc ngân hàng máu."
      />
      
      <div className="mt-8 bg-white rounded-lg shadow-sm">
        <AdminTabs initialData={initialData} />
      </div>
    </div>
  );
}

/**
 * Fetch dữ liệu ban đầu cho trang Admin
 * Hàm này chạy ở server-side
 */
async function fetchInitialData() {
  try {
    const [users, roles, volunteerCenters] = await Promise.all([
      getAllUsers(),
      getAllRoles(),
      getAllVolunteerCenters()
    ]);
    
    return {
      users,
      roles,
      volunteerCenters
    };
  } catch (error) {
    console.error('Error fetching initial admin data:', error);
    return {
      users: [],
      roles: [],
      volunteerCenters: []
    };
  }
}