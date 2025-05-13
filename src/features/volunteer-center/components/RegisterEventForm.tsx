'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { THONGBAODKTOCHUC } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { formatDate } from '@/lib/utils';

// Define the form schema
const FormSchema = z.object({
  soLuongDK: z.coerce
    .number()
    .min(1, 'Số lượng đăng ký phải ít nhất là 1')
    .max(1000, 'Số lượng đăng ký không được vượt quá 1000'),
});

type FormValues = z.infer<typeof FormSchema>;

interface RegisterEventFormProps {
  announcement: THONGBAODKTOCHUC;
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

export function RegisterEventForm({ announcement, onSubmit, isLoading }: RegisterEventFormProps) {
  // Prepare the form
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      soLuongDK: 1,
    },
  });

  // Format dates for display
  const registrationStart = formatDate(announcement.TgBatDauDK);
  const registrationEnd = formatDate(announcement.TgKetThucDK);
  const eventStart = formatDate(announcement.TgBatDauSK);
  const eventEnd = formatDate(announcement.TgKetThucSK);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Đăng ký tổ chức hiến máu</CardTitle>
        <CardDescription>
          Vui lòng nhập thông tin đăng ký tổ chức hiến máu cho sự kiện: {announcement.TieuDe}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2 text-sm">
          <div>
            <span className="font-semibold">Thời gian đăng ký:</span> {registrationStart} - {registrationEnd}
          </div>
          <div>
            <span className="font-semibold">Thời gian sự kiện:</span> {eventStart} - {eventEnd}
          </div>
          <div>
            <span className="font-semibold">Số lượng mục tiêu:</span> {announcement.SoLuongMauHien} đơn vị
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="soLuongDK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng đăng ký (đơn vị máu)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số lượng đăng ký"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nhập số lượng đơn vị máu mà cơ sở của bạn dự kiến có thể tiếp nhận.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký tổ chức'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 