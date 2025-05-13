"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Schema định nghĩa dữ liệu feedback form
const feedbackSchema = z.object({
  loaiPhanHoi: z.string().min(1, "Vui lòng chọn loại phản hồi"),
  dangKyHienMau: z.string().optional(),
  tieuDe: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(100, "Tiêu đề không vượt quá 100 ký tự"),
  noiDung: z.string().min(20, "Nội dung phải có ít nhất 20 ký tự").max(1000, "Nội dung không vượt quá 1000 ký tự"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      loaiPhanHoi: "",
      dangKyHienMau: "",
      tieuDe: "",
      noiDung: "",
    },
  });

  // Xử lý gửi phản hồi
  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Gửi phản hồi:", values);
      toast.success("Gửi phản hồi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.");
      form.reset();
      router.push("/donor/dashboard");
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
      toast.error("Không thể gửi phản hồi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/donor/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Gửi phản hồi</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phản hồi về dịch vụ hiến máu</CardTitle>
          <CardDescription>
            Hãy chia sẻ trải nghiệm của bạn để chúng tôi có thể cải thiện dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="loaiPhanHoi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại phản hồi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại phản hồi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gop_y">Góp ý</SelectItem>
                        <SelectItem value="khieu_nai">Khiếu nại</SelectItem>
                        <SelectItem value="khen_ngoi">Khen ngợi</SelectItem>
                        <SelectItem value="cau_hoi">Câu hỏi</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Chọn loại phản hồi phù hợp với nội dung bạn muốn gửi
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dangKyHienMau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã đăng ký hiến máu (nếu có)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã đăng ký hiến máu nếu phản hồi liên quan đến lần hiến máu cụ thể"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Để trống nếu phản hồi không liên quan đến lần hiến máu cụ thể
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tieuDe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề phản hồi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noiDung"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung phản hồi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung phản hồi chi tiết"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Hãy mô tả chi tiết trải nghiệm hoặc vấn đề bạn gặp phải
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/donor/dashboard")}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Gửi phản hồi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 