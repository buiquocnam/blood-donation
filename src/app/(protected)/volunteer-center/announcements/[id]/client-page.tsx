'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterEventForm } from '@/features/volunteer-center';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { THONGBAODKTOCHUC } from '@/types';
import { useRegisterForEvent } from '@/features/volunteer-center/hooks';
import { useQueryClient } from '@tanstack/react-query';

interface ClientAnnouncementDetailProps {
  announcement: THONGBAODKTOCHUC;
  centerId: string;
}

export default function ClientAnnouncementDetail({ 
  announcement, 
  centerId 
}: ClientAnnouncementDetailProps) {
  const queryClient = useQueryClient();
  const { mutate: registerForEvent, isPending } = useRegisterForEvent();
  
  // Check if registration period is still open
  const now = new Date();
  const endDate = new Date(announcement.TgKetThucDK);
  const isRegistrationOpen = now <= endDate;
  
  // Format dates for display
  const registrationStart = formatDate(announcement.TgBatDauDK);
  const registrationEnd = formatDate(announcement.TgKetThucDK);
  const eventStart = formatDate(announcement.TgBatDauSK);
  const eventEnd = formatDate(announcement.TgKetThucSK);
  
  // Handler for form submission
  const handleSubmit = (values: { soLuongDK: number }) => {
    registerForEvent({
      centerId,
      eventId: announcement.IdThongBaoDK,
      data: values
    }, {
      onSuccess: () => {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['eventRegistrations', centerId] });
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
        alert(`Đăng ký thành công với số lượng ${values.soLuongDK} đơn vị!`);
      }
    });
  };
  
  return (
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
          isLoading={isPending}
        />
      )}
    </div>
  );
} 