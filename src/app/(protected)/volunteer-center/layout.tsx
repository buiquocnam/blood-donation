import { Metadata } from 'next';
import { Sidebar } from '@/components/layout/sidebar';
export const metadata: Metadata = {
  title: {
    template: '%s | Hệ thống quản lý hiến máu',
    default: 'Cơ sở tình nguyện | Hệ thống quản lý hiến máu',
  },
  description: 'Quản lý thông tin cơ sở tình nguyện, đăng ký tổ chức và hiến máu',
};

export default function VolunteerCenterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 