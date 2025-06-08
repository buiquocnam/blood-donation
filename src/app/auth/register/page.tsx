// page.tsx (Server Component - for SEO and layout)
import { ClientTabContent } from './client-tabs';
import { locationService } from '@/shared/services/locationService';

export const metadata = {
  title: 'Đăng ký | Hệ thống hiến máu',
  description: 'Đăng ký tài khoản mới để tham gia hiến máu hoặc tổ chức sự kiện hiến máu',
  keywords: 'đăng ký hiến máu, tình nguyện hiến máu, tạo tài khoản hiến máu',
};

// Preload data trong Server Component
async function fetchInitialData() {
  try {
    // Fetch tất cả thành phố - dữ liệu nhỏ nên fetch trước
    const cities = await locationService.getCities();
    return { cities };
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu ban đầu:', error);
    return { cities: [] };
  }
}

export default async function RegisterPage() {
  const { cities } = await fetchInitialData();
  
  // Render client component với dữ liệu cities từ server
  return <ClientTabContent initialCities={cities || []} />;
} 