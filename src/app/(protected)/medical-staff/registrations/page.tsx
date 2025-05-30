import { Metadata } from 'next';
import { eventsService } from '@/features/public/services';
import { EventsList } from '@/features/medical-staff/components';

export const metadata: Metadata = {
  title: 'Sự kiện hiến máu - Nhân viên y tế',
  description: 'Quản lý sự kiện hiến máu dành cho nhân viên y tế',
};

/**
 * Trang hiển thị danh sách sự kiện hiến máu
 * Tuân thủ kiến trúc FFMA: Server Component lấy dữ liệu và truyền cho Client Component
 */
export default async function RegistrationsPage() {
  // Lấy dữ liệu sự kiện từ server-side theo kiến trúc FFMA
  const events = await eventsService.getPublicEvents();
  
  // Sắp xếp sự kiện từ mới nhất đến cũ nhất theo ngày đăng ký
  const sortedEvents = [...events.data].sort((a, b) => 
    new Date(b.NgayDangKi).getTime() - new Date(a.NgayDangKi).getTime()
  );

  return (
    <div className="space-y-6">
      <EventsList initialEvents={sortedEvents} />
    </div>
  );
} 