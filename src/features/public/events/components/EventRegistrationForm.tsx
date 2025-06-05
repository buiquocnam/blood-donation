'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { EventRegistrationFormProps, EventRegistrationFormData } from '../types';

const formSchema = z.object({
  ChieuCao: z.number({
    required_error: 'Vui lòng nhập chiều cao',
  }).min(145, 'Chiều cao phải từ 145cm trở lên'),
  CanNang: z.number({
    required_error: 'Vui lòng nhập cân nặng',
  }).min(40, 'Cân nặng phải từ 40kg trở lên'),
  DaTungHienMau: z.boolean(),
  TienSuBenh: z.string({
    required_error: 'Vui lòng nhập tiền sử bệnh',
  }),
  MacBenhHienTai: z.string({
    required_error: 'Vui lòng nhập bệnh hiện tại nếu có',
  }),
  ThongTin12ThangQua: z.string({
    required_error: 'Vui lòng nhập thông tin 12 tháng qua',
  }),
  ThongTin6ThangQua: z.string({
    required_error: 'Vui lòng nhập thông tin 6 tháng qua',
  }),
  ThongTin1ThangQua: z.string({
    required_error: 'Vui lòng nhập thông tin 1 tháng qua',
  }),
  ThongTin14NgayQua: z.string({
    required_error: 'Vui lòng nhập thông tin 14 ngày qua',
  }),
  Thuoc7Ngay: z.string({
    required_error: 'Vui lòng nhập thông tin thuốc 7 ngày qua',
  }),
  ThongTinPhuNu12ThangQua: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const FormSectionTitle = ({ 
  icon, 
  title, 
  description, 
  tooltip 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  tooltip?: string;
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </div>
);

export function EventRegistrationForm({ 
  onSubmit,
  isSubmitting 
}: EventRegistrationFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ChieuCao: 0,
      CanNang: 0,
      DaTungHienMau: false,
      TienSuBenh: '',
      MacBenhHienTai: '',
      ThongTin12ThangQua: '',
      ThongTin6ThangQua: '',
      ThongTin1ThangQua: '',
      ThongTin14NgayQua: '',
      Thuoc7Ngay: '',
      ThongTinPhuNu12ThangQua: '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as EventRegistrationFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Đăng ký hiến máu</h2>
          <p className="text-muted-foreground mt-2">Vui lòng điền đầy đủ thông tin để đăng ký tham gia sự kiện</p>
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vui lòng cung cấp thông tin chính xác để đảm bảo an toàn cho quá trình hiến máu
          </AlertDescription>
        </Alert>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <FormSectionTitle
                icon={<Info className="h-5 w-5 text-primary" />}
                title="Thông tin cơ bản"
                description="Thông tin về chiều cao và cân nặng của bạn"
                tooltip="Chiều cao và cân nặng là yếu tố quan trọng để xác định đủ điều kiện hiến máu"
              />

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="ChieuCao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chiều cao (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập chiều cao"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Chiều cao tối thiểu là 145cm
                      </FormDescription>
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
                          placeholder="Nhập cân nặng"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Cân nặng tối thiểu là 40kg
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <FormSectionTitle
                icon={<AlertCircle className="h-5 w-5 text-primary" />}
                title="Tiền sử bệnh"
                description="Thông tin về bệnh lý và tình trạng sức khỏe"
                tooltip="Thông tin sức khỏe giúp đảm bảo an toàn cho người hiến máu và người nhận máu"
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="DaTungHienMau"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/10">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Đã từng hiến máu</FormLabel>
                        <FormDescription>
                          Đánh dấu nếu bạn đã từng hiến máu trước đây
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="TienSuBenh"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Tiền sử bệnh</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Các bệnh mãn tính hoặc bệnh di truyền mà bạn mắc phải</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Ví dụ: Tiểu đường, huyết áp cao, tim mạch,..."
                          className="min-h-[80px]"
                          {...field}
                          value={String(field.value || '')}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="MacBenhHienTai"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Bệnh hiện tại</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Các bệnh đang điều trị hoặc các triệu chứng bệnh hiện tại</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Các bệnh đang mắc hoặc đang điều trị (nếu có)"
                          className="min-h-[80px]"
                          {...field}
                          value={String(field.value || '')}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <FormSectionTitle
              icon={<AlertCircle className="h-5 w-5 text-primary" />}
              title="Thông tin sức khỏe theo thời gian"
              description="Chi tiết về tình trạng sức khỏe trong các khoảng thời gian"
              tooltip="Thông tin sức khỏe được chia theo các mốc thời gian để dễ theo dõi"
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="ThongTin12ThangQua"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>12 tháng qua</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Các can thiệp y tế, phẫu thuật, tiêm chủng trong 12 tháng qua</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Ví dụ: Phẫu thuật, truyền máu, xăm/xỏ, tiêm chủng,..."
                        className="min-h-[100px]"
                        {...field}
                        value={String(field.value || '')}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ThongTin6ThangQua"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>6 tháng qua</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Các bệnh truyền nhiễm hoặc vấn đề sức khỏe nghiêm trọng</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Ví dụ: Sốt xuất huyết, viêm gan, các bệnh truyền nhiễm,..."
                        className="min-h-[100px]"
                        {...field}
                        value={String(field.value || '')}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ThongTin1ThangQua"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>1 tháng qua</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Các triệu chứng bệnh hoặc thay đổi sức khỏe gần đây</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Ví dụ: Cảm cúm, sốt, đau họng,..."
                        className="min-h-[100px]"
                        {...field}
                        value={String(field.value || '')}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ThongTin14NgayQua"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>14 ngày qua</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Các triệu chứng liên quan đến COVID-19 hoặc bệnh truyền nhiễm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Ví dụ: Ho, sốt, khó thở, mất vị giác,..."
                        className="min-h-[100px]"
                        {...field}
                        value={String(field.value || '')}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Thuoc7Ngay"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Thuốc đã dùng (7 ngày qua)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Các loại thuốc bạn đã sử dụng trong 7 ngày gần đây</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Các loại thuốc đã sử dụng trong 7 ngày qua"
                        className="min-h-[100px]"
                        {...field}
                        value={String(field.value || '')}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ThongTinPhuNu12ThangQua"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Thông tin dành cho phụ nữ (12 tháng qua)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Thông tin về thai nghén, sinh nở và các vấn đề phụ khoa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Thông tin về thai nghén, sinh nở trong 12 tháng qua (nếu có)"
                        className="min-h-[100px]"
                        {...field}
                        value={String(field.value || '')}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Chỉ điền nếu bạn là phụ nữ và có thai nghén/sinh nở trong 12 tháng qua
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            disabled={isSubmitting}
            className="min-w-[200px]"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký tham gia'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 