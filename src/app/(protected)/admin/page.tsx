import { Metadata } from 'next';
import { PageTitle } from '@/components/shared/page-title';
import { AdminTabs } from '@/features/admin';

export const metadata: Metadata = {
  title: 'Quản trị hệ thống',
  description: 'Quản lý thông tin người dùng, nhân viên y tế, bác sĩ, cơ sở tình nguyện và giám đốc',
};

/**
 * Trang quản trị hệ thống
 * Hiển thị giao diện quản lý toàn bộ hệ thống cho Admin
 */
export default function AdminPage() {
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <PageTitle 
        title="Quản trị hệ thống" 
        description="Quản lý thông tin người dùng, nhân viên y tế, bác sĩ, cơ sở tình nguyện và giám đốc ngân hàng máu."
      />
      
      <div className="mt-8 bg-white rounded-lg shadow-sm">
        <AdminTabs />
      </div>
    </div>
  );
}