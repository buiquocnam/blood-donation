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
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useRegistrationDetail } from '../../hooks';
import { MedicalStaffService } from '../../services';
import { TrangThaiHienMau } from '@/types';
import { UpdateDonationStatusData } from '../../types';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface UpdateDonationStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
  onSuccess: () => void;
}

/**
 * Dialog cập nhật trạng thái hiến máu
 */
export function UpdateDonationStatusDialog({
  open,
  onOpenChange,
  registrationId,
  onSuccess
}: UpdateDonationStatusDialogProps) {
  const { registration, donor, isLoading } = useRegistrationDetail(open ? registrationId : null);
  const queryClient = useQueryClient();
  
  // State cho form cập nhật
  const [status, setStatus] = useState<string>(TrangThaiHienMau.DA_HOAN_THANH);
  const [nhietDo, setNhietDo] = useState<string>('');
  const [nhipTim, setNhipTim] = useState<string>('');
  const [huyetAp, setHuyetAp] = useState<string>('');
  const [ttKhamSangLoc, setTtKhamSangLoc] = useState<string>('');
  const [ttSauHien, setTtSauHien] = useState<string>('');
  const [ghiChu, setGhiChu] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form khi mở dialog với đăng ký mới
  const resetForm = () => {
    if (registration) {
      setStatus(registration.TrangThaiHienMau || TrangThaiHienMau.DA_HOAN_THANH);
      setNhietDo(registration.NhietDo ? registration.NhietDo.toString() : '');
      setNhipTim(registration.NhipTim ? registration.NhipTim.toString() : '');
      setHuyetAp(registration.HuyetAp || '');
      setTtKhamSangLoc(registration.TTSKKhamSangLoc || '');
      setTtSauHien(registration.TTSKSauHien || '');
      setGhiChu(registration.GhiChu || '');
    } else {
      setStatus(TrangThaiHienMau.DA_HOAN_THANH);
      setNhietDo('');
      setNhipTim('');
      setHuyetAp('');
      setTtKhamSangLoc('');
      setTtSauHien('');
      setGhiChu('');
    }
  };
  
  // Xử lý submit form
  const handleSubmit = async () => {
    if (!registrationId) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: UpdateDonationStatusData = {
        TrangThaiHienMau: status,
        NhietDo: nhietDo ? parseFloat(nhietDo) : undefined,
        NhipTim: nhipTim ? parseInt(nhipTim, 10) : undefined,
        HuyetAp: huyetAp || undefined,
        TTSKKhamSangLoc: ttKhamSangLoc || undefined,
        TTSKSauHien: ttSauHien || undefined,
        GhiChu: ghiChu || undefined
      };
      
      const result = await MedicalStaffService.updateDonationStatus(registrationId, updateData);
      
      if (result) {
        // Invalidate queries để cập nhật dữ liệu
        queryClient.invalidateQueries({ queryKey: ['registration-detail', registrationId] });
        queryClient.invalidateQueries({ queryKey: ['registrations'] });
        queryClient.invalidateQueries({ queryKey: ['donations'] });
        
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái hiến máu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog 
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen) {
          resetForm();
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái hiến máu</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin và trạng thái sau khi người hiến đã thực hiện hiến máu
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : !registration ? (
          <div className="py-4 text-center">Không tìm thấy thông tin đăng ký hoặc có lỗi xảy ra</div>
        ) : (
          <div className="space-y-4 py-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin người hiến máu</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Họ tên:</span> {donor?.HoTen || 'Không xác định'}
                </div>
                <div>
                  <span className="font-medium">Nhóm máu:</span> {donor?.MaNhomMau || 'Không xác định'}
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="status">Trạng thái hiến máu</Label>
                <RadioGroup
                  value={status}
                  onValueChange={setStatus}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TrangThaiHienMau.DA_HOAN_THANH} id="completed" />
                    <Label htmlFor="completed">Đã hiến máu thành công</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TrangThaiHienMau.CHO_HIEN} id="pending" />
                    <Label htmlFor="pending">Chưa hiến máu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TrangThaiHienMau.TU_CHOI} id="rejected" />
                    <Label htmlFor="rejected">Không đủ điều kiện hiến máu</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="temperature">Nhiệt độ (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={nhietDo}
                    onChange={(e) => setNhietDo(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="heartRate">Nhịp tim (nhịp/phút)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="72"
                    value={nhipTim}
                    onChange={(e) => setNhipTim(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="bloodPressure">Huyết áp (mmHg)</Label>
                <Input
                  id="bloodPressure"
                  placeholder="120/80"
                  value={huyetAp}
                  onChange={(e) => setHuyetAp(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="screening">Tình trạng sức khỏe khi khám sàng lọc</Label>
                <Textarea
                  id="screening"
                  placeholder="Nhập thông tin sức khỏe khi khám sàng lọc"
                  value={ttKhamSangLoc}
                  onChange={(e) => setTtKhamSangLoc(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="afterDonation">Tình trạng sức khỏe sau khi hiến máu</Label>
                <Textarea
                  id="afterDonation"
                  placeholder="Nhập thông tin sức khỏe sau khi hiến máu"
                  value={ttSauHien}
                  onChange={(e) => setTtSauHien(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  placeholder="Nhập ghi chú nếu cần"
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !registration}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Lưu thông tin'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 