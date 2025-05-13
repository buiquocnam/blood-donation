import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDangKiToChucHienMau } from '@/mock/events';
import { TrangThaiSuKien } from '@/types/common';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Trang danh sách sự kiện đang diễn ra cho bác sĩ
 */
export default async function DoctorEventsPage() {
  // Lọc các sự kiện đang diễn ra
  const ongoingEvents = mockDangKiToChucHienMau.filter(
    (event) => event.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA
  );

  return (
    <main className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Sự kiện hiến máu đang diễn ra</h1>
        <p className="text-muted-foreground">
          Chọn một sự kiện để xem danh sách đăng ký hiến máu và quản lý hoạt động khám sức khỏe.
        </p>

        {ongoingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50">
            <p className="text-lg font-medium mb-2">Không có sự kiện nào đang diễn ra</p>
            <p className="text-muted-foreground">Vui lòng quay lại sau khi có sự kiện được bắt đầu.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ongoingEvents.map((event) => (
              <Card key={event.IdSuKien} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2">
                      Sự kiện #{event.IdSuKien}
                    </CardTitle>
                    <Badge variant="secondary">Đang diễn ra</Badge>
                  </div>
                  <CardDescription>
                    Địa điểm: {event.IDCoSoTinhNguyen}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Số lượng đăng ký:</span>
                      <span>{event.SoLuongDK}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Đã duyệt:</span>
                      <span>{event.SoLuongDDK}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ngày đăng ký:</span>
                      <span>{format(new Date(event.NgayDangKi), 'dd/MM/yyyy', { locale: vi })}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <Link href={`/doctor/events/${event.IdSuKien}`} className="w-full">
                    <Button className="w-full">Quản lý hiến máu</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 