import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterEventForm } from '@/features/volunteer-center';
import { mockCoSoTinhNguyen } from '@/mock/volunteers';
import { mockThongBaoDKToChuc } from '@/mock/announcements';
import { CalendarIcon, Clock, Users, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface AnnouncementDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AnnouncementDetailPageProps): Promise<Metadata> {
  const announcement = mockThongBaoDKToChuc.find(a => a.IdThongBaoDK === params.id);
  
  if (!announcement) {
    return {
      title: 'Thông báo không tồn tại',
    };
  }
  
  return {
    title: `${announcement.TieuDe} | Thông báo hiến máu`,
    description: announcement.NoiDung.substring(0, 160),
  };
}

export default function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  // In a real app, this would come from an API call
  const announcement = mockThongBaoDKToChuc.find(a => a.IdThongBaoDK === params.id);
  
  // Use the first volunteer center from mock data (in a real app, this would be the current user)
  const centerId = mockCoSoTinhNguyen[0].IDCoSoTinhNguyen;
  
  if (!announcement) {
    return notFound();
  }
  
  // Check if registration period is still open
  const now = new Date();
  const endDate = new Date(announcement.TgKetThucDK);
  const isRegistrationOpen = now <= endDate;
  
  // Format dates for display
  const registrationStart = formatDate(announcement.TgBatDauDK);
  const registrationEnd = formatDate(announcement.TgKetThucDK);
  const eventStart = formatDate(announcement.TgBatDauSK);
  const eventEnd = formatDate(announcement.TgKetThucSK);
  
  // This would be a real event handler in a production app
  const handleSubmit = (values: { soLuongDK: number }) => {
    console.log('Đăng ký với số lượng:', values.soLuongDK);
    alert(`Đăng ký thành công với số lượng ${values.soLuongDK} đơn vị!`);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Link 
        href="/volunteer-center" 
        className="flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Quay lại danh sách thông báo
      </Link>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{announcement.TieuDe}</CardTitle>
            <CardDescription>
              Thông báo đăng ký tổ chức hiến máu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>{announcement.NoiDung}</p>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Thời gian đăng ký:</span> 
                <span>{registrationStart} - {registrationEnd}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Thời gian sự kiện:</span> 
                <span>{eventStart} - {eventEnd}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Số lượng cần:</span> 
                <span>{announcement.SoLuongMauHien} đơn vị</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              {isRegistrationOpen ? (
                <span className="text-green-600 font-medium">Đang mở đăng ký</span>
              ) : (
                <span className="text-red-600 font-medium">Đã hết hạn đăng ký</span>
              )}
            </div>
          </CardFooter>
        </Card>
        
        {isRegistrationOpen && (
          <RegisterEventForm 
            announcement={announcement}
            onSubmit={handleSubmit}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
} 