 'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DANGKIHIENMAU, NGUOIDUNG, TrangThaiDangKy } from '@/types';
import { useRegistrationDetail } from '@/features/medical-staff/hooks';
import { Skeleton } from '@/components/ui/skeleton';

interface ApproveRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
  onApprove: (registrationId: string, status: string, note?: string) => void;
  viewOnly?: boolean;
}

/**
 * Dialog xác nhận duyệt đơn đăng ký hiến máu
 */
export function ApproveRegistrationDialog({
  open,
  onOpenChange,
  registrationId,
  onApprove,
  viewOnly = false,
}: ApproveRegistrationDialogProps) {
  const [status, setStatus] = useState<string>(TrangThaiDangKy.DA_DUYET);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('donor-info');
  
  // Sử dụng hook để lấy thông tin chi tiết
  const { 
    registration, 
    donor, 
    isLoading 
  } = useRegistrationDetail(open ? registrationId : null);
  
  // Format date to Vietnamese format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', { locale: vi });
    } catch (e) {
      return dateString;
    }
  };
  
  const handleSubmit = async () => {
    if (!registrationId) return;
    
    try {
      setIsSubmitting(true);
      await onApprove(registrationId, status, note);
      onOpenChange(false);
    } catch (error) {
      console.error('Lỗi khi duyệt đơn:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {viewOnly ? 'Chi tiết đơn đăng ký hiến máu' : 'Thông tin chi tiết đơn đăng ký hiến máu'}
          </DialogTitle>
          <DialogDescription>
            {viewOnly ? 'Xem chi tiết thông tin người đăng ký' : 'Xem chi tiết thông tin đơn đăng ký trước khi phê duyệt'}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4 py-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : registration ? (
          <div className="space-y-4 py-2">
            <Tabs 
              defaultValue="donor-info" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="donor-info">Thông tin người hiến</TabsTrigger>
                <TabsTrigger value="health-info">Thông tin sức khỏe</TabsTrigger>
                <TabsTrigger value="screening-info">Khai báo y tế</TabsTrigger>
              </TabsList>
              
              {/* Tab thông tin người hiến máu */}
              <TabsContent value="donor-info" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Họ và tên:</p>
                      <p>{donor?.HoTen || 'Không xác định'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Nhóm máu:</p>
                      <p>{donor?.MaNhomMau || 'Không xác định'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Số điện thoại:</p>
                      <p>{donor?.SDT || 'Không xác định'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email:</p>
                      <p>{donor?.Email || 'Không xác định'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Ngày sinh:</p>
                      <p>{donor?.NgaySinh ? formatDate(donor.NgaySinh) : 'Không xác định'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Giới tính:</p>
                      <p>{donor?.GioiTinh ? 'Nam' : 'Nữ'}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Địa chỉ:</p>
                      <p>{donor?.tenDiaChi || 'Không xác định'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">CCCD:</p>
                      <p>{donor?.CCCD || 'Không xác định'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Ngày đăng ký:</p>
                      <p>{formatDate(registration.NgayDangKi)}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab thông tin sức khỏe */}
              <TabsContent value="health-info" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Thông tin sức khỏe</CardTitle>
                    <CardDescription>Các thông số sức khỏe đã khai báo</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Chiều cao:</p>
                      <p>{registration.ChieuCao ? `${registration.ChieuCao} cm` : 'Chưa cập nhật'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Cân nặng:</p>
                      <p>{registration.CanNang ? `${registration.CanNang} kg` : 'Chưa cập nhật'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Nhiệt độ:</p>
                      <p>{registration.NhietDo ? `${registration.NhietDo}°C` : 'Chưa cập nhật'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Nhịp tim:</p>
                      <p>{registration.NhipTim ? `${registration.NhipTim} bpm` : 'Chưa cập nhật'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Huyết áp:</p>
                      <p>{registration.HuyetAp || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Đã từng hiến máu:</p>
                      <p>{registration.DaTungHienMau ? 'Đã từng hiến' : 'Chưa từng hiến'}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Tiền sử bệnh:</p>
                      <p>{registration.TienSuBenh || 'Không có'}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Bệnh hiện tại:</p>
                      <p>{registration.MacBenhHienTai || 'Không có'}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab khai báo y tế */}
              <TabsContent value="screening-info" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Khai báo y tế</CardTitle>
                    <CardDescription>Thông tin khai báo sàng lọc</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Thông tin 12 tháng qua:</p>
                      <p>{registration.ThongTin12ThangQua || 'Không có'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Thông tin 6 tháng qua:</p>
                      <p>{registration.ThongTin6ThangQua || 'Không có'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Thông tin 1 tháng qua:</p>
                      <p>{registration.ThongTin1ThangQua || 'Không có'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Thông tin 14 ngày qua:</p>
                      <p>{registration.ThongTin14NgayQua || 'Không có'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Thuốc 7 ngày qua:</p>
                      <p>{registration.Thuoc7Ngay || 'Không có'}</p>
                    </div>
                    {registration.ThongTinPhuNu12ThangQua && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Thông tin phụ nữ 12 tháng qua:</p>
                        <p>{registration.ThongTinPhuNu12ThangQua}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">TT Sức khỏe khám sàng lọc:</p>
                      <p>{registration.TTSKKhamSangLoc || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">TT Sức khỏe sau hiến:</p>
                      <p>{registration.TTSKSauHien || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Ghi chú:</p>
                      <p>{registration.GhiChu || 'Không có'}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {!viewOnly && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle>Quyết định duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={TrangThaiDangKy.DA_DUYET} id="approve" />
                      <Label htmlFor="approve" className="font-medium">Duyệt đơn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={TrangThaiDangKy.TU_CHOI} id="reject" />
                      <Label htmlFor="reject" className="font-medium">Từ chối</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      id="note"
                      placeholder="Nhập ghi chú nếu cần..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="py-4 text-center">Không tìm thấy thông tin đăng ký hoặc có lỗi xảy ra</div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {viewOnly ? 'Đóng' : 'Hủy'}
          </Button>
          
          {!viewOnly && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !registration}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}