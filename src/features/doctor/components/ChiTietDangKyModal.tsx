'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  DANGKIHIENMAU_WithRelations, 
  CapNhatSucKhoe 
} from '../types';
import { TrangThaiSucKhoe } from '@/types/common';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Props cho component ChiTietDangKyModal
 */
interface ChiTietDangKyModalProps {
  open: boolean;
  dangKy: DANGKIHIENMAU_WithRelations | null;
  onClose: () => void;
  onCapNhatSucKhoe: (data: CapNhatSucKhoe) => void;
  isLoading: boolean;
}

/**
 * Component hiển thị chi tiết đăng ký hiến máu và form cập nhật sức khỏe
 */
export function ChiTietDangKyModal({ 
  open, 
  dangKy, 
  onClose, 
  onCapNhatSucKhoe, 
  isLoading 
}: ChiTietDangKyModalProps) {
  const [activeTab, setActiveTab] = useState('thongTinCaNhan');
  
  // React Hook Form setup
  const form = useForm<CapNhatSucKhoe>({
    defaultValues: {
      MaDKiHienMau: dangKy?.MaDKiHienMau || '',
      ChieuCao: dangKy?.ChieuCao || 0,
      CanNang: dangKy?.CanNang || 0,
      NhietDo: dangKy?.NhietDo || 0,
      NhipTim: dangKy?.NhipTim || 0,
      HuyetAp: dangKy?.HuyetAp || '',
      TTSKKhamSangLoc: dangKy?.TTSKKhamSangLoc || TrangThaiSucKhoe.CHUA_DANH_GIA,
      GhiChu: dangKy?.GhiChu || '',
    },
  });
  
  // Reset form when the modal opens with new data
  if (dangKy && dangKy.MaDKiHienMau !== form.getValues().MaDKiHienMau) {
    form.reset({
      MaDKiHienMau: dangKy.MaDKiHienMau,
      ChieuCao: dangKy.ChieuCao,
      CanNang: dangKy.CanNang,
      NhietDo: dangKy.NhietDo,
      NhipTim: dangKy.NhipTim,
      HuyetAp: dangKy.HuyetAp,
      TTSKKhamSangLoc: dangKy.TTSKKhamSangLoc,
      GhiChu: dangKy.GhiChu,
    });
  }
  
  // Format ngày giờ
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return 'Không xác định';
    }
  };
  
  // Handle form submission
  const onSubmit = (data: CapNhatSucKhoe) => {
    onCapNhatSucKhoe(data);
  };
  
  // Generate nhóm máu display
  const getNhomMauDisplay = () => {
    if (!dangKy?.NguoiHienMau?.NhomMau) return 'Chưa xác định';
    return `${dangKy.NguoiHienMau.NhomMau.MaNhomMau} (${dangKy.NguoiHienMau.NhomMau.MoTaNhomMau})`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đăng ký hiến máu</DialogTitle>
        </DialogHeader>
        
        {!dangKy ? (
          <div className="flex justify-center items-center h-40">
            <p>Đang tải...</p>
          </div>
        ) : (
          <>
            <Tabs defaultValue="thongTinCaNhan" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="thongTinCaNhan">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="tienSuBenh">Tiền sử bệnh</TabsTrigger>
                <TabsTrigger value="capNhatSucKhoe">Cập nhật sức khỏe</TabsTrigger>
              </TabsList>
              
              {/* Tab thông tin cá nhân */}
              <TabsContent value="thongTinCaNhan" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin người hiến</h3>
                    <p><span className="font-medium">Họ tên:</span> {dangKy.NguoiHienMau?.HoTen || 'Không xác định'}</p>
                    <p><span className="font-medium">Ngày sinh:</span> {dangKy.NguoiHienMau?.NgaySinh || 'Không xác định'}</p>
                    <p><span className="font-medium">Giới tính:</span> {dangKy.NguoiHienMau?.GioiTinh ? 'Nam' : 'Nữ'}</p>
                    <p><span className="font-medium">CCCD:</span> {dangKy.NguoiHienMau?.CCCD || 'Không xác định'}</p>
                    <p><span className="font-medium">Nhóm máu:</span> {getNhomMauDisplay()}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin đăng ký</h3>
                    <p><span className="font-medium">Mã đăng ký:</span> {dangKy.MaDKiHienMau}</p>
                    <p><span className="font-medium">Ngày đăng ký:</span> {formatDate(dangKy.NgayDangKi)}</p>
                    <p><span className="font-medium">Ngày sửa:</span> {formatDate(dangKy.NgaySua)}</p>
                    <p><span className="font-medium">Đã từng hiến:</span> {dangKy.DaTungHienMau ? 'Có' : 'Không'}</p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Tab tiền sử bệnh */}
              <TabsContent value="tienSuBenh" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Tiền sử bệnh</h3>
                    <p>{dangKy.TienSuBenh || 'Không có'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Bệnh hiện tại</h3>
                    <p>{dangKy.MacBenhHienTai || 'Không có'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin 12 tháng qua</h3>
                    <p>{dangKy.ThongTin12ThangQua || 'Không có'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin 6 tháng qua</h3>
                    <p>{dangKy.ThongTin6ThangQua || 'Không có'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin 1 tháng qua</h3>
                    <p>{dangKy.ThongTin1ThangQua || 'Không có'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin 14 ngày qua</h3>
                    <p>{dangKy.ThongTin14NgayQua || 'Không có'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Thuốc 7 ngày qua</h3>
                    <p>{dangKy.Thuoc7Ngay || 'Không có'}</p>
                  </div>
                  
                  {dangKy.NguoiHienMau?.GioiTinh === false && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Thông tin phụ nữ 12 tháng qua</h3>
                        <p>{dangKy.ThongTinPhuNu12ThangQua || 'Không có'}</p>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              
              {/* Tab cập nhật sức khỏe */}
              <TabsContent value="capNhatSucKhoe">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ChieuCao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chiều cao (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="CanNang"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cân nặng (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="NhietDo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nhiệt độ (°C)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="NhipTim"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nhịp tim (lần/phút)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="HuyetAp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Huyết áp (mmHg)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="VD: 120/80" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="TTSKKhamSangLoc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Đánh giá sức khỏe</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn đánh giá" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={TrangThaiSucKhoe.DU_DIEU_KIEN}>
                                Đủ điều kiện hiến máu
                              </SelectItem>
                              <SelectItem value={TrangThaiSucKhoe.KHONG_DU_DIEU_KIEN}>
                                Không đủ điều kiện hiến máu
                              </SelectItem>
                              <SelectItem value={TrangThaiSucKhoe.CHUA_DANH_GIA}>
                                Chưa đánh giá
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="GhiChu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Nhập ghi chú" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        <DialogFooter>
          {activeTab === 'capNhatSucKhoe' && (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mr-2"
            >
              {isLoading ? 'Đang xử lý...' : 'Cập nhật sức khỏe'}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 