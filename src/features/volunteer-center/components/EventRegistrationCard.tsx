'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DANGKITOCHUCHIENMAU, THONGBAODKTOCHUC } from '@/types';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { TrangThaiDangKy, TrangThaiSuKien } from '@/types/common';

interface EventRegistrationCardProps {
  registration: DANGKITOCHUCHIENMAU;
  announcement?: THONGBAODKTOCHUC;
  onCancel: (eventId: string) => void;
}

export function EventRegistrationCard({ 
  registration, 
  announcement, 
  onCancel 
}: EventRegistrationCardProps) {
  // Format dates for display
  const registrationDate = formatDate(registration.NgayDangKi);
  
  // Helper function to get status badge
  const getStatusBadge = (status: TrangThaiDangKy) => {
    switch (status) {
      case TrangThaiDangKy.CHO_DUYET:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ duyệt</Badge>;
      case TrangThaiDangKy.DA_DUYET:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã duyệt</Badge>;
      case TrangThaiDangKy.TU_CHOI:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Helper function to get event status badge
  const getEventStatusBadge = (status: TrangThaiSuKien) => {
    switch (status) {
      case TrangThaiSuKien.SAP_DIEN_RA:
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Sắp diễn ra</Badge>;
      case TrangThaiSuKien.DANG_DIEN_RA:
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Đang diễn ra</Badge>;
      case TrangThaiSuKien.DA_HOAN_THANH:
        return <Badge className="bg-green-50 text-green-700 border-green-200">Đã hoàn thành</Badge>;
      case TrangThaiSuKien.DA_HUY:
        return <Badge className="bg-red-50 text-red-700 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  // Check if can be cancelled
  const canCancel = registration.TinhTrangDK === TrangThaiDangKy.CHO_DUYET;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {announcement?.TieuDe || `Đăng ký #${registration.IdSuKien}`}
          </CardTitle>
          <div className="flex space-x-2">
            {getStatusBadge(registration.TinhTrangDK)}
            {getEventStatusBadge(registration.TrangThaiSuKien)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>Ngày đăng ký: {registrationDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Số lượng đăng ký: {registration.SoLuongDK} đơn vị</span>
          </div>
          {registration.SoLuongDDK > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Đã đăng ký: {registration.SoLuongDDK} người</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="destructive" 
          onClick={() => onCancel(registration.IdSuKien)}
          disabled={!canCancel}
        >
          Hủy đăng ký
        </Button>
      </CardFooter>
    </Card>
  );
} 