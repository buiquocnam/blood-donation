"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Loader2, MapPin } from "lucide-react";
import { useDonationDetail, useSubmitFeedback } from "@/features/donor/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPhanHoiHienMau } from "@/features/donor/types";
import { Separator } from "@/components/ui/separator";
import { formatDate } from '@/utils';

// Schema định nghĩa dữ liệu feedback form
const feedbackSchema = z.object({
  tinhTrangMoTa: z.string().min(10, "Vui lòng nhập ít nhất 10 ký tự").max(500, "Nội dung tối đa 500 ký tự"),
});

export default function DonationFeedbackPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter();
  const { data: detail, isLoading } = useDonationDetail(params.id);
  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback(() => {
    toast.success("Gửi phản hồi hiến máu thành công");
    router.push(`/donor/donations/${params.id}`);
  });
  
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      tinhTrangMoTa: "",
    },
  });

  // Xử lý gửi phản hồi
  const onSubmit = (values: z.infer<typeof feedbackSchema>) => {
    const feedbackData: FormPhanHoiHienMau = {
      maDKiHienMau: params.id,
      tinhTrangMoTa: values.tinhTrangMoTa,
      ngayPhanHoi: new Date().toISOString()
    };

    submitFeedback(feedbackData);
    // Success và Error được xử lý trong hook useSubmitFeedback với callback
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/donor/donations/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!detail || !detail.coTheGuiPhanHoi) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/donor/donations/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Gửi phản hồi hiến máu</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Không thể gửi phản hồi</CardTitle>
            <CardDescription>
              {!detail ? 
                "Không tìm thấy thông tin đăng ký hiến máu" : 
                "Bạn không thể gửi phản hồi cho đăng ký hiến máu này"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {!detail ? 
                `Không tìm thấy thông tin đăng ký hiến máu với mã ${params.id}` : 
                "Chỉ những đăng ký đã hoàn thành hiến máu mới có thể gửi phản hồi"}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/donor/dashboard#history">Quay lại lịch sử hiến máu</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { dangKyHienMau, suKienHienMau } = detail;
  const hasFeedback = !!detail.phanHoi;

  if (hasFeedback) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/donor/donations/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Phản hồi đã gửi</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{suKienHienMau.ThongBao?.TieuDe || "Sự kiện hiến máu"}</CardTitle>
            <CardDescription>
              Bạn đã gửi phản hồi cho đăng ký hiến máu này vào {formatDate(detail.phanHoi?.NgayPhanHoi)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Nội dung phản hồi của bạn:</h3>
              <div className="bg-muted/50 p-4 rounded-md">
                <p>{detail.phanHoi?.TinhTrangMoTa}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/donor/donations/${params.id}`}>Xem chi tiết đăng ký</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/donor/donations/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Gửi phản hồi hiến máu</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{suKienHienMau.ThongBao?.TieuDe || "Sự kiện hiến máu"}</CardTitle>
          <CardDescription>
            Gửi phản hồi về tình trạng sức khỏe sau khi hiến máu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex items-center text-sm mb-2">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              <span className="font-medium">Ngày hiến máu:</span>
              <span className="ml-2">{formatDate(dangKyHienMau.NgayDangKi)}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-red-500" />
              <span className="font-medium">Địa điểm:</span>
              <span className="ml-2">{suKienHienMau.CoSoTinhNguyen?.DiaChi || "Chưa cập nhật"}</span>
            </div>
          </div>

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tinhTrangMoTa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả tình trạng sức khỏe sau hiến máu</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả tình trạng sức khỏe của bạn sau khi hiến máu, các triệu chứng nếu có..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Hãy mô tả chi tiết các triệu chứng nếu có để chúng tôi có thể hỗ trợ bạn tốt nhất. 
                      Nếu bạn khỏe mạnh, hãy cho chúng tôi biết trải nghiệm tốt của bạn.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push(`/donor/donations/${params.id}`)}
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