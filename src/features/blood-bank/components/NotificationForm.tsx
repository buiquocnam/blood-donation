'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { useNotifications } from '../hooks/useNotifications';
import { THONGBAODKTOCHUC, FormDuLieuThongBao } from '@/types';

interface NotificationFormProps {
  notification?: THONGBAODKTOCHUC;
  onSuccess?: () => void;
}

// Helper type for form state (allows Date objects for date fields)
interface FormState {
  TieuDe: string;
  NoiDung: string;
  SoLuongMauHien: number;
  HanDangKi: Date | undefined;
  TgBatDauDK: Date | undefined;
  TgKetThucDK: Date | undefined;
  TgBatDauSK: Date | undefined;
  TgKetThucSK: Date | undefined;
  HanDK: Date | undefined;
}

export function NotificationForm({ notification, onSuccess }: NotificationFormProps) {
  const { createNotification, updateNotification } = useNotifications();
  
  const [formData, setFormData] = useState<FormState>({
    TieuDe: notification?.TieuDe || '',
    NoiDung: notification?.NoiDung || '',
    SoLuongMauHien: notification?.SoLuongMauHien || 0,
    HanDangKi: notification?.HanDangKi ? new Date(notification.HanDangKi) : undefined,
    TgBatDauDK: notification?.TgBatDauDK ? new Date(notification.TgBatDauDK) : undefined,
    TgKetThucDK: notification?.TgKetThucDK ? new Date(notification.TgKetThucDK) : undefined,
    TgBatDauSK: notification?.TgBatDauSK ? new Date(notification.TgBatDauSK) : undefined,
    TgKetThucSK: notification?.TgKetThucSK ? new Date(notification.TgKetThucSK) : undefined,
    HanDK: notification?.HanDK ? new Date(notification.HanDK) : undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check required fields
    if (!formData.TieuDe || !formData.NoiDung || !formData.SoLuongMauHien || 
        !formData.TgBatDauDK || !formData.TgKetThucDK || !formData.HanDangKi || !formData.HanDK ||
        !formData.TgBatDauSK || !formData.TgKetThucSK) {
      return;
    }
    
    // Convert Date objects to ISO strings for submission
    const dataToSubmit: FormDuLieuThongBao = {
      TieuDe: formData.TieuDe,
      NoiDung: formData.NoiDung,
      SoLuongMauHien: formData.SoLuongMauHien,
      HanDangKi: formData.HanDangKi.toISOString(),
      TgBatDauDK: formData.TgBatDauDK.toISOString(),
      TgKetThucDK: formData.TgKetThucDK.toISOString(),
      TgBatDauSK: formData.TgBatDauSK.toISOString(),
      TgKetThucSK: formData.TgKetThucSK.toISOString(),
      HanDK: formData.HanDK?.toISOString(),
    };

    if (notification) {
      // Update existing notification
      updateNotification.mutate(
        { 
          id: notification.IdThongBaoDK, 
          data: dataToSubmit 
        },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
          }
        }
      );
    } else {
      // Create new notification
      createNotification.mutate(dataToSubmit, {
        onSuccess: () => {
          // Reset form after successful creation
          setFormData({
            TieuDe: '',
            NoiDung: '',
            SoLuongMauHien: 0,
            HanDangKi: undefined,
            TgBatDauDK: undefined,
            TgKetThucDK: undefined,
            TgBatDauSK: undefined,
            TgKetThucSK: undefined,
            HanDK: undefined,
          });
          
          if (onSuccess) onSuccess();
        }
      });
    }
  };

  const handleReset = () => {
    if (notification) {
      // Reset to original notification values
      setFormData({
        TieuDe: notification.TieuDe,
        NoiDung: notification.NoiDung,
        SoLuongMauHien: notification.SoLuongMauHien,
        HanDangKi: new Date(notification.HanDangKi),
        TgBatDauDK: new Date(notification.TgBatDauDK),
        TgKetThucDK: new Date(notification.TgKetThucDK),
        TgBatDauSK: notification.TgBatDauSK ? new Date(notification.TgBatDauSK) : undefined,
        TgKetThucSK: notification.TgKetThucSK ? new Date(notification.TgKetThucSK) : undefined,
        HanDK: notification.HanDK ? new Date(notification.HanDK) : undefined,
      });
    } else {
      // Clear form
      setFormData({
        TieuDe: '',
        NoiDung: '',
        SoLuongMauHien: 0,
        HanDangKi: undefined,
        TgBatDauDK: undefined,
        TgKetThucDK: undefined,
        TgBatDauSK: undefined,
        TgKetThucSK: undefined,
        HanDK: undefined,
      });
    }
  };

  return (
    <>
      <CardContent>
        <form id="notification-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
      <div className="space-y-2">
            <Label htmlFor="TieuDe">Tiêu đề</Label>
        <Input 
              id="TieuDe"
              name="TieuDe"
              value={formData.TieuDe}
              onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
            <Label htmlFor="NoiDung">Nội dung</Label>
        <Textarea 
              id="NoiDung"
              name="NoiDung"
              value={formData.NoiDung}
              onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
            <Label htmlFor="SoLuongMauHien">Số lượng máu hiến (dự kiến)</Label>
          <Input 
              id="SoLuongMauHien"
              name="SoLuongMauHien"
              type="number"
              min={1}
              value={formData.SoLuongMauHien}
              onChange={handleNumberChange}
            required
          />
        </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="TgBatDauDK">Thời gian bắt đầu đăng ký</Label>
              <DateTimePicker
                value={formData.TgBatDauDK}
                onChange={(date) => handleDateChange("TgBatDauDK", date)}
              />
            </div>
        <div className="space-y-2">
              <Label htmlFor="TgKetThucDK">Thời gian kết thúc đăng ký</Label>
              <DateTimePicker
                value={formData.TgKetThucDK}
                onChange={(date) => handleDateChange("TgKetThucDK", date)}
          />
        </div>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="TgBatDauSK">Thời gian bắt đầu sự kiện</Label>
              <DateTimePicker
                value={formData.TgBatDauSK}
                onChange={(date) => handleDateChange("TgBatDauSK", date)}
              />
          </div>
            <div className="space-y-2">
              <Label htmlFor="TgKetThucSK">Thời gian kết thúc sự kiện</Label>
              <DateTimePicker
                value={formData.TgKetThucSK}
                onChange={(date) => handleDateChange("TgKetThucSK", date)}
          />
        </div>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="HanDangKi">Hạn đăng ký</Label>
              <DateTimePicker
                value={formData.HanDangKi}
                onChange={(date) => handleDateChange("HanDangKi", date)}
              />
          </div>
            <div className="space-y-2">
              <Label htmlFor="HanDK">Hạn chót</Label>
              <DateTimePicker
                value={formData.HanDK}
                onChange={(date) => handleDateChange("HanDK", date)}
              />
        </div>
      </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Đặt lại
        </Button>
        <Button 
          type="submit" 
          form="notification-form" 
          disabled={createNotification.isPending || updateNotification.isPending}
        >
          {createNotification.isPending || updateNotification.isPending ? 'Đang lưu...' : notification ? 'Cập nhật' : 'Tạo thông báo'}
        </Button>
      </CardFooter>
    </>
  );
} 
