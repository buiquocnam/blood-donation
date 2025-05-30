import { VolunteerCenterTabs } from '@/features/volunteer-center';
import { mockCoSoTinhNguyen } from '@/mock/volunteers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import { 
  fetchAnnouncements, 
  fetchEventRegistrations, 
  fetchVolunteerCenterById 
} from '@/features/volunteer-center/services';
import { TrangThaiDangKy } from '@/types/common';

export const metadata: Metadata = {
  title: 'Trang quản lý cơ sở tình nguyện',
  description: 'Quản lý thông tin cơ sở tình nguyện, đăng ký tổ chức và hiến máu',
};

// Lấy dữ liệu ban đầu từ phía server
async function fetchInitialData(centerId: string) {
  const [announcements, eventRegistrations, centerDetails] = await Promise.all([
    fetchAnnouncements(),
    fetchEventRegistrations(centerId),
    fetchVolunteerCenterById(centerId)
  ]);

  return {
    announcements,
    eventRegistrations,
    centerDetails
  };
}

export default async function VolunteerCenterDashboardPage() {
  // Trong ứng dụng thực tế, chúng ta sẽ lấy ID của người dùng hiện tại từ phiên
  // Cho mục đích demo, chúng ta sử dụng cơ sở tình nguyện đầu tiên từ dữ liệu mẫu
  const centerId = mockCoSoTinhNguyen[0].IDCoSoTinhNguyen;
  const center = mockCoSoTinhNguyen[0];
  
  // Lấy dữ liệu ban đầu từ phía server
  const initialData = await fetchInitialData(centerId);

  // Tạo thống kê đơn giản để hiển thị
  const stats = {
    announcementsCount: initialData.announcements.length,
    registrationsCount: initialData.eventRegistrations.length,
    approvedCount: initialData.eventRegistrations.filter(r => r.TinhTrangDK === TrangThaiDangKy.DA_DUYET).length,
    pendingCount: initialData.eventRegistrations.filter(r => r.TinhTrangDK === TrangThaiDangKy.CHO_DUYET).length,
    totalBloodUnits: initialData.eventRegistrations.reduce((sum, reg) => sum + reg.SoLuongDK, 0)
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý cơ sở tình nguyện</h1>
        <p className="text-muted-foreground">
          Chào mừng <span className="font-medium">{center.TenCoSoTinhNguyen}</span> đến với hệ thống quản lý cơ sở tình nguyện hiến máu
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thông báo hiện tại</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.announcementsCount} thông báo</div>
            <p className="text-xs text-muted-foreground">
              +1 thông báo mới so với tuần trước
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đăng ký của bạn</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registrationsCount} đăng ký</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedCount} đã duyệt, {stats.pendingCount} đang chờ duyệt
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn vị máu đã đăng ký</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBloodUnits} đơn vị</div>
            <p className="text-xs text-muted-foreground">
              +5% so với kỳ trước
            </p>
          </CardContent>
        </Card>
      </div>

      <VolunteerCenterTabs 
        centerId={centerId} 
        initialData={initialData}
      />
    </div>
  );
}