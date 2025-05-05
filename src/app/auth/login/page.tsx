"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { UserRole } from "@/features/auth/types";

// Schema xác thực form
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Trang mặc định cho từng vai trò
const roleDefaultPages: Record<UserRole, string> = {
  donor: "/events",
  medical_staff: "/medical-staff",
  doctor: "/doctor",
  volunteer_center_manager: "/volunteer-center",
  blood_bank_director: "/blood-bank/notifications",
  admin: "/admin",
};

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const user = await login(data);
      toast.success("Đăng nhập thành công");
      
      // Điều hướng người dùng sau khi đăng nhập
      const targetPath = redirectPath || roleDefaultPages[user.role] || "/";
      router.push(targetPath);
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu của bạn.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/10">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Đăng Nhập</h1>
          <p className="text-muted-foreground">
            Nhập thông tin đăng nhập để truy cập tài khoản của bạn
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className={cn(errors.email && "border-destructive")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={cn(errors.password && "border-destructive")}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Đăng Ký
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 