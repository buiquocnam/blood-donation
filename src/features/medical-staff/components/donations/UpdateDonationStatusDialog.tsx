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
import { MedicalStaffService } from '../../services';
import { TrangThaiHienMau } from '@/types';
import { UpdateDonationStatusData } from '../../types';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { DonationRegistrationResponse } from '@/features/medical-staff/types';

interface UpdateDonationStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: DonationRegistrationResponse;
  onSuccess: () => void;
}

/**
 * Dialog cập nhật trạng thái hiến máu
 */
export function UpdateDonationStatusDialog({
  open,
  onOpenChange,
  donation,
  onSuccess
}: UpdateDonationStatusDialogProps) {
  const [status, setStatus] = useState<string>(donation.TrangThaiHienMau || TrangThaiHienMau.CHO_HIEN);
  const [nhietDo, setNhietDo] = useState<string>((donation.NhietDo || '').toString());
  const [nhipTim, setNhipTim] = useState<string>((donation.NhipTim || '').toString());
  const [huyetAp, setHuyetAp] = useState<string>(donation.HuyetAp || '');
  const [ttskKhamSangLoc, setTtskKhamSangLoc] = useState<string>(donation.TTSKKhamSangLoc || '');
  const [ttskSauHien, setTtskSauHien] = useState<string>(donation.TTSKSauHien || '');
  const [ghiChu, setGhiChu] = useState<string>(donation.GhiChu || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!donation.MaDKiHienMau) return;
    
    try {
      setIsSubmitting(true);
      
      const donationData: UpdateDonationStatusData = {
        TrangThaiHienMau: status,
        NhietDo: nhietDo ? parseFloat(nhietDo) : undefined,
        NhipTim: nhipTim ? parseInt(nhipTim, 10) : undefined,
        HuyetAp: huyetAp || undefined,
        TTSKKhamSangLoc: ttskKhamSangLoc || undefined,
        TTSKSauHien: ttskSauHien || undefined,
        GhiChu: ghiChu || undefined
      };
      
      const result = await MedicalStaffService.updateDonationStatus(donation.MaDKiHienMau, donationData);
      
      if (result) {
        toast.success('Cập nhật trạng thái hiến máu thành công');
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error('Cập nhật trạng thái hiến máu thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái hiến máu:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái hiến máu');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái hiến máu</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin và trạng thái cho đơn hiến máu #{donation.MaDKiHienMau}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Thông tin người hiến máu</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Họ và tên</Label>
                <p className="font-medium">{donation.NGUOIHIENMAU?.HoTen || 'Không xác định'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Nhóm máu</Label>
                <p className="font-medium">{donation.NGUOIHIENMAU?.MaNhomMau || 'Không xác định'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cập nhật thông tin hiến máu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label htmlFor="status">Trạng thái hiến máu</Label>
                <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TrangThaiHienMau.CHO_HIEN} id="pending" />
                    <Label htmlFor="pending">Chờ hiến</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TrangThaiHienMau.DA_HIEN} id="completed" />
                    <Label htmlFor="completed">Đã hiến máu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={TrangThaiHienMau.TU_CHOI} id="rejected" />
                    <Label htmlFor="rejected">Từ chối hiến máu</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nhietDo">Nhiệt độ (°C)</Label>
                  <Input
                    id="nhietDo"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={nhietDo}
                    onChange={(e) => setNhietDo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nhipTim">Nhịp tim (bpm)</Label>
                  <Input
                    id="nhipTim"
                    type="number"
                    placeholder="80"
                    value={nhipTim}
                    onChange={(e) => setNhipTim(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="huyetAp">Huyết áp</Label>
                  <Input
                    id="huyetAp"
                    placeholder="120/80"
                    value={huyetAp}
                    onChange={(e) => setHuyetAp(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ttskKhamSangLoc">Thông tin sức khỏe khám sàng lọc</Label>
                <Textarea
                  id="ttskKhamSangLoc"
                  placeholder="Nhập thông tin sức khỏe khám sàng lọc..."
                  value={ttskKhamSangLoc}
                  onChange={(e) => setTtskKhamSangLoc(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ttskSauHien">Thông tin sức khỏe sau hiến</Label>
                <Textarea
                  id="ttskSauHien"
                  placeholder="Nhập thông tin sức khỏe sau hiến..."
                  value={ttskSauHien}
                  onChange={(e) => setTtskSauHien(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ghiChu">Ghi chú</Label>
                <Textarea
                  id="ghiChu"
                  placeholder="Nhập ghi chú nếu có..."
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Cập nhật trạng thái'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 