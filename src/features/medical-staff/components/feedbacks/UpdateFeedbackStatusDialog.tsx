'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
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
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { PHANHOI } from "@/types/events";
import { formatDate } from "@/utils";

export interface UpdateFeedbackStatusDialogProps {
  feedback: PHANHOI;
  children: React.ReactNode;
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
export function UpdateFeedbackStatusDialog({ feedback, children }: UpdateFeedbackStatusDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("CHUA_XU_LY");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lấy thông tin chi tiết phản hồi
  const { 
    feedback: feedbackDetail, 
    isLoading,
    handleUpdateStatus 
  } = useFeedbackDetail(feedback.MaPhanHoi);
  
  // Khởi tạo form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trangThaiXuLy: feedbackDetail?.TrangThaiXuLy || TrangThaiPhanHoi.CHUA_XU_LY,
      ghiChuXuLy: feedbackDetail?.GhiChuXuLy || '',
    },
  });
  
  // Cập nhật giá trị mặc định khi dữ liệu được tải
  React.useEffect(() => {
    if (feedbackDetail) {
      form.reset({
        trangThaiXuLy: feedbackDetail.TrangThaiXuLy,
        ghiChuXuLy: feedbackDetail.GhiChuXuLy || '',
      });
    }
  }, [feedbackDetail, form]);
  
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
        setIsOpen(false);
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
  
  const handleUpdateStatusDialog = async () => {
    setIsSubmitting(true);
    
    try {
      const updateData: UpdateFeedbackStatusData = {
        trangThaiXuLy: status as TrangThaiPhanHoi,
        ghiChuXuLy: note,
      };
      
      const result = await handleUpdateStatus(updateData);
      
      if (result) {
        toast.success('Cập nhật trạng thái thành công');
        setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Cập nhật trạng thái phản hồi</DialogTitle>
          <DialogDescription className="text-left">
            Cập nhật thông tin xử lý phản hồi
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Đang tải thông tin phản hồi...</p>
          </div>
        ) : !feedbackDetail ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-destructive">Không tìm thấy thông tin phản hồi</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-left">Thông tin phản hồi</h3>
                <div className="rounded-md bg-muted p-3 text-sm overflow-hidden">
                  <div className="mb-1 flex">
                    <span className="font-medium w-32 shrink-0 text-left">Mã phản hồi:</span> 
                    <span className="truncate text-left">{feedback.MaPhanHoi}</span>
                  </div>
                  <div className="mb-1 flex">
                    <span className="font-medium w-32 shrink-0 text-left">Mã đăng ký:</span> 
                    <span className="truncate text-left">{feedback.MaDKiKienMau}</span>
                  </div>
                  <div className="mb-1 flex">
                    <span className="font-medium w-32 shrink-0 text-left">Người hiến máu:</span> 
                    <span className="truncate text-left">{feedbackDetail.NguoiHienMau?.HoTen || 'Không xác định'}</span>
                  </div>
                  <div className="mb-1 flex">
                    <span className="font-medium w-32 shrink-0 text-left">Ngày phản hồi:</span> 
                    <span className="text-left">{formatDate(feedback.NgayPhanHoi)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-left">Nội dung phản hồi:</span>
                    <p className="mt-1 whitespace-pre-wrap break-words overflow-auto text-sm bg-background p-2 rounded max-h-28 text-left">{feedback.TinhTrangMoTa}</p>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="trangThaiXuLy"
                    render={({ field }) => (
                      <FormItem className="text-left">
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
                        <FormDescription className="text-xs text-left">
                          Chọn trạng thái xử lý phản hồi
                        </FormDescription>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ghiChuXuLy"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>Ghi chú xử lý</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={isSubmitting}
                            placeholder="Nhập ghi chú xử lý"
                            className="resize-none text-left"
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-left">
                          Nhập thông tin chi tiết về cách xử lý phản hồi
                        </FormDescription>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      disabled={isSubmitting}
                      className="mt-2 sm:mt-0"
                    >
                      Hủy
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Lưu thay đổi'}
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