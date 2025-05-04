"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserRole } from "@/features/auth/types";

// Schema xác thực form
const registerSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
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

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      // Không gửi confirmPassword
      const { confirmPassword, ...registerData } = data;
      const user = await registerUser({...registerData, role: 'donor'});
      toast.success("Đăng ký thành công");
      
      // Chuyển hướng đến trang mặc định dựa trên vai trò
      const defaultPage = roleDefaultPages[user.role] || "/";
      router.push(defaultPage);
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Tạo tài khoản mới</h1>
          <p className="text-gray-500">
            Nhập thông tin của bạn để tạo tài khoản mới
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                className={errors.name ? "border-red-500" : ""}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className={errors.email ? "border-red-500" : ""}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={errors.password ? "border-red-500" : ""}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className={errors.confirmPassword ? "border-red-500" : ""}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Đăng Nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 