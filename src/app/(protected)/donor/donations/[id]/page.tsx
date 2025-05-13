"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, Calendar, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useDonationDetail, useCancelDonation, useSubmitFeedback } from "@/features/donor/hooks";
import { FormPhanHoiHienMau } from "@/features/donor/types";
import { TrangThaiDangKy, TrangThaiHienMau } from "@/types/common";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from '@/utils';

const feedbackSchema = z.object({
  tinhTrangMoTa: z.string().min(10, "Vui lòng nhập ít nhất 10 ký tự"),
});


// Chi tiết đăng ký hiến máu
export default function DonationDetailPage({ 
  params
}: { 
  params: { id: string } 
}) {
  const router = useRouter();
  const { data: detail, isLoading, refetch } = useDonationDetail(params.id);
  const { mutate: cancel, isPending: isCancelling } = useCancelDonation(() => {
    toast.success("Đã hủy đăng ký hiến máu thành công");
    router.push("/donor/dashboard#history");
  });
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } = useSubmitFeedback(() => {
    setShowFeedbackDialog(false);
    form.reset();
    toast.success("Gửi phản hồi thành công");
    refetch();
  });
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      tinhTrangMoTa: "",
    },
  });

  // Function để hủy đăng ký hiến máu
  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đăng ký hiến máu này?")) {
      cancel(params.id);
      // Success và Error được xử lý trong hook useCancelDonation
    }
  };

  // Function để gửi phản hồi
  const onSubmitFeedback = (values: z.infer<typeof feedbackSchema>) => {
    const feedbackData: FormPhanHoiHienMau = {
      maDKiHienMau: params.id,
      tinhTrangMoTa: values.tinhTrangMoTa,
      ngayPhanHoi: new Date().toISOString()
    };

    submitFeedback(feedbackData);
    // Success và Error được xử lý trong hook useSubmitFeedback
  };

  // Function để hiển thị trạng thái
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case TrangThaiHienMau.DA_HOAN_THANH:
        return <Badge className="bg-green-500">Đã hoàn thành</Badge>;
      case TrangThaiHienMau.CHO_HIEN:   
        return <Badge className="bg-yellow-500">Chờ hiến</Badge>;
      case TrangThaiHienMau.TU_CHOI:
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/donor/dashboard#history">
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

  if (!detail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/donor/dashboard#history">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Chi tiết đăng ký hiến máu</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
              Không tìm thấy thông tin
            </CardTitle>
            <CardDescription>
              Không tìm thấy thông tin đăng ký hiến máu với mã {params.id}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/donor/dashboard#history">Quay lại lịch sử hiến máu</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { dangKyHienMau, suKienHienMau, coTheHuy, coTheGuiPhanHoi } = detail;
  const hasFeedback = !!detail.phanHoi;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/donor/dashboard#history">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Chi tiết đăng ký hiến máu</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{suKienHienMau.ThongBao?.TieuDe || "Sự kiện hiến máu"}</CardTitle>
              <CardDescription>{suKienHienMau.CoSoTinhNguyen?.TenCoSoTinhNguyen || "Không có thông tin"}</CardDescription>
            </div>
            {renderStatusBadge(dangKyHienMau.TrangThaiHienMau)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin đăng ký</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Mã đăng ký:</span>
                  <span>{dangKyHienMau.MaDKiHienMau}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Ngày đăng ký:</span>
                  <span>{formatDate(dangKyHienMau.NgayDangKi)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Đơn vị hiến máu:</span>
                  <span>{dangKyHienMau.IdDanhMucDVHienMau || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Trạng thái đơn:</span>
                  <span>{dangKyHienMau.TrangThaiDonDK.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Đã từng hiến máu:</span>
                  <span>{dangKyHienMau.DaTungHienMau ? "Có" : "Không"}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin sự kiện</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Mã sự kiện:</span>
                  <span>{suKienHienMau.IdSuKien}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Thời gian diễn ra:</span>
                  <span>
                    {formatDate(suKienHienMau.NgayDang)} - {formatDate(suKienHienMau.NgaySua)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Địa điểm:</span>
                  <span>{suKienHienMau.CoSoTinhNguyen?.DiaChi || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Trạng thái sự kiện:</span>
                  <span>{suKienHienMau.TrangThaiSuKien?.replace(/_/g, " ") || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Thông tin sức khỏe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Chiều cao:</span>
                  <span>{dangKyHienMau.ChieuCao ? `${dangKyHienMau.ChieuCao} cm` : "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Cân nặng:</span>
                  <span>{dangKyHienMau.CanNang ? `${dangKyHienMau.CanNang} kg` : "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Nhiệt độ:</span>
                  <span>{dangKyHienMau.NhietDo ? `${dangKyHienMau.NhietDo} °C` : "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Nhịp tim:</span>
                  <span>{dangKyHienMau.NhipTim ? `${dangKyHienMau.NhipTim} nhịp/phút` : "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-40">Huyết áp:</span>
                  <span>{dangKyHienMau.HuyetAp || "Chưa cập nhật"}</span>
                </div>
              </div>

              <div>
                {dangKyHienMau.GhiChu && (
                  <div className="text-sm">
                    <span className="font-medium">Ghi chú:</span>
                    <p className="mt-1">{dangKyHienMau.GhiChu}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {hasFeedback && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Phản hồi sau hiến máu</h3>
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-sm">{detail.phanHoi?.TinhTrangMoTa}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Đã gửi vào: {formatDate(detail.phanHoi?.NgayPhanHoi)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {coTheHuy && (
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Hủy đăng ký
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/donor/dashboard#history">
                Quay lại
              </Link>
            </Button>

            {coTheGuiPhanHoi && !hasFeedback && (
              <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                <DialogTrigger>
                  <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Gửi phản hồi
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Phản hồi sau hiến máu</DialogTitle>
                    <DialogDescription>
                      Vui lòng cho chúng tôi biết tình trạng sức khỏe của bạn sau khi hiến máu
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitFeedback)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="tinhTrangMoTa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả tình trạng</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Mô tả tình trạng sức khỏe của bạn sau khi hiến máu"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Hãy mô tả chi tiết các triệu chứng nếu có để chúng tôi có thể hỗ trợ bạn tốt nhất.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                          Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmittingFeedback}>
                          {isSubmittingFeedback && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Gửi phản hồi
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 