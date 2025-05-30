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
import {formatDate} from '@/lib/utils';
import { TrangThaiDangKy } from '@/types';
import { useDonorInfo } from '@/features/medical-staff/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { DonationRegistrationResponse } from '@/features/medical-staff/types';
import { toast } from 'sonner';

interface ApproveRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: DonationRegistrationResponse;
  onApprove: (registrationId: string, status: string, note?: string) => void;
  viewOnly?: boolean;
  isSubmitting?: boolean;
}

/**
 * Dialog xác nhận duyệt đơn đăng ký hiến máu
 */
export function ApproveRegistrationDialog({
  open,
  onOpenChange,
  registration,
  onApprove,
  viewOnly = false,
  isSubmitting = false,
}: ApproveRegistrationDialogProps) {
  const [status, setStatus] = useState<string>(TrangThaiDangKy.DA_DUYET);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('donor-info');
  
  // Sử dụng hook để lấy thông tin chi tiết
  const { 
    donorData, 
    isLoading 
  } = useDonorInfo(registration.NGUOIHIENMAU?.MaNguoiDung);
  console.log("donorData", donorData);

  
  const handleSubmit = async () => {
    if (!registration.MaDKiHienMau) {
      toast.error('ID đơn đăng ký không hợp lệ');
      return;
    }
    
    try {
      await onApprove(registration.MaDKiHienMau, status, note);
      // Dialog sẽ đóng khi thành công qua callback
    } catch (error) {
      console.error('Lỗi khi duyệt đơn:', error);
      // Không cần hiển thị toast ở đây vì handleApprove đã xử lý
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
        ) : (
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
                  {donorData ? (
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Họ và tên:</p>
                        <p>{donorData?.HoTen || 'Không xác định'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Nhóm máu:</p>
                        <p>{donorData?.MaNhomMau || 'Không xác định'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Số điện thoại:</p>
                        <p>{donorData?.SDT || 'Không xác định'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email:</p>
                        <p>{donorData?.Email || 'Không xác định'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Ngày sinh:</p>
                        <p>{donorData?.NgaySinh ? formatDate(donorData.NgaySinh) : 'Không xác định'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Giới tính:</p>
                        <p>{donorData?.GioiTinh ? 'Nam' : 'Nữ'}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Địa chỉ:</p>
                        <p>{donorData?.tenDiaChi || 'Không xác định'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">CCCD:</p>
                        <p>{donorData?.CCCD || 'Không xác định'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Ngày đăng ký:</p>
                        <p>{formatDate(registration.NgayDangKi)}</p>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="text-center py-6">
                      <p className="text-muted-foreground">Không thể tải thông tin người hiến máu</p>
                      <p className="text-sm text-muted-foreground mt-1">ID: {registration.IdNguoiHienMau || 'Không xác định'}</p>
                    </CardContent>
                  )}
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