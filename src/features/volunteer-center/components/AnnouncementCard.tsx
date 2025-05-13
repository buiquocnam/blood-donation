'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { THONGBAODKTOCHUC } from '@/types';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: THONGBAODKTOCHUC;
  onRegister: (announcementId: string) => void;
}

export function AnnouncementCard({ announcement, onRegister }: AnnouncementCardProps) {
  // Check if registration period is still open
  const now = new Date();
  const endDate = new Date(announcement.TgKetThucDK);
  const isRegistrationOpen = now <= endDate;

  // Format dates for display
  const registrationStart = formatDate(announcement.TgBatDauDK);
  const registrationEnd = formatDate(announcement.TgKetThucDK);
  const eventStart = formatDate(announcement.TgBatDauSK);
  const eventEnd = formatDate(announcement.TgKetThucSK);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{announcement.TieuDe}</CardTitle>
        <CardDescription className="line-clamp-2 text-muted-foreground">
          {announcement.NoiDung}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>Đăng ký: {registrationStart} - {registrationEnd}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Sự kiện: {eventStart} - {eventEnd}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Số lượng cần: {announcement.SoLuongMauHien} đơn vị</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/volunteer-center/announcements/${announcement.IdThongBaoDK}`}>
            Xem chi tiết
          </Link>
        </Button>
        <Button 
          onClick={() => onRegister(announcement.IdThongBaoDK)}
          disabled={!isRegistrationOpen}
        >
          {isRegistrationOpen ? 'Đăng ký tổ chức' : 'Đã hết hạn đăng ký'}
        </Button>
      </CardFooter>
    </Card>
  );
} 