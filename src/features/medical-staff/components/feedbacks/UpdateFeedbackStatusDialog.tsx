'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFeedbackDetail } from '@/features/medical-staff/hooks';
import { TrangThaiPhanHoi, UpdateFeedbackStatusData } from '@/features/medical-staff/types';
import { toast } from 'sonner';

interface UpdateFeedbackStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedbackId: string;
  onSuccess?: () => void;
}

// Schema validation cho form
const formSchema = z.object({
  trangThaiXuLy: z.string({
    required_error: 'Vui lòng chọn trạng thái xử lý',
  }),
  ghiChuXuLy: z.string()
    .min(5, { message: 'Ghi chú phải có ít nhất 5 ký tự' })
    .max(500, { message: 'Ghi chú không được vượt quá 500 ký tự' }),
});

/**
 * Dialog cập nhật trạng thái xử lý phản hồi
 */
export function UpdateFeedbackStatusDialog({ 
  open, 
  onOpenChange,
  feedbackId,
  onSuccess
}: UpdateFeedbackStatusDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lấy thông tin chi tiết phản hồi
  const { 
    feedback, 
    isLoading,
    handleUpdateStatus 
  } = useFeedbackDetail(feedbackId);
  
  // Khởi tạo form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trangThaiXuLy: feedback?.TrangThaiXuLy || TrangThaiPhanHoi.CHUA_XU_LY,
      ghiChuXuLy: feedback?.GhiChuXuLy || '',
    },
  });
  
  // Cập nhật giá trị mặc định khi dữ liệu được tải
  React.useEffect(() => {
    if (feedback) {
      form.reset({
        trangThaiXuLy: feedback.TrangThaiXuLy,
        ghiChuXuLy: feedback.GhiChuXuLy || '',
      });
    }
  }, [feedback, form]);
  
  // Xử lý form submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const updateData: UpdateFeedbackStatusData = {
        trangThaiXuLy: values.trangThaiXuLy as TrangThaiPhanHoi,
        ghiChuXuLy: values.ghiChuXuLy,
      };
      
      const result = await handleUpdateStatus(updateData);
      
      if (result) {
        toast.success('Cập nhật trạng thái thành công');
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái xử lý phản hồi</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin xử lý phản hồi của người hiến máu
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Đang tải thông tin phản hồi...</p>
          </div>
        ) : !feedback ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-destructive">Không tìm thấy thông tin phản hồi</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Thông tin phản hồi</h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="mb-2">
                    <span className="font-medium">Mã phản hồi:</span> {feedback.MaPhanHoi}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Mã đăng ký hiến máu:</span> {feedback.MaDKiKienMau}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Người hiến máu:</span> {feedback.NguoiHienMau?.HoTen || 'Không xác định'}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Ngày phản hồi:</span> {new Date(feedback.NgayPhanHoi).toLocaleDateString('vi-VN')}
                  </div>
                  <div>
                    <span className="font-medium">Nội dung phản hồi:</span>
                    <p className="mt-1 whitespace-pre-wrap">{feedback.TinhTrangMoTa}</p>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trangThaiXuLy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái xử lý</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái xử lý" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={TrangThaiPhanHoi.CHUA_XU_LY}>
                              Chưa xử lý
                            </SelectItem>
                            <SelectItem value={TrangThaiPhanHoi.DANG_XU_LY}>
                              Đang xử lý
                            </SelectItem>
                            <SelectItem value={TrangThaiPhanHoi.DA_XU_LY}>
                              Đã xử lý
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Chọn trạng thái xử lý cho phản hồi này
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ghiChuXuLy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú xử lý</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={isSubmitting}
                            placeholder="Nhập ghi chú xử lý"
                            className="resize-none"
                            rows={5}
                          />
                        </FormControl>
                        <FormDescription>
                          Nhập thông tin chi tiết về cách xử lý phản hồi này
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 