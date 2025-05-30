"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";

// Schema xác thực form chung cho tất cả loại đăng nhập
const loginSchema = z.object({
  Email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  MatKhau: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  isCenter: z.boolean() // Xác định là đăng nhập cơ sở hay người dùng thường
});

// Trang mặc định cho từng vai trò
const roleDefaultPages: Record<string, string> = {
  donor: "/events",
  medical_staff: "/medical-staff",
  doctor: "/doctor",
  volunteer_center_manager: "/volunteer-center",
  blood_bank_director: "/blood-bank/notifications",
  admin: "/admin",
};

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  // Form xử lý cho người dùng thông thường
  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: "",
      MatKhau: "",
      isCenter: false
    },
  });

  // Form xử lý cho cơ sở tình nguyện
  const {
    register: registerCenter,
    handleSubmit: handleSubmitCenter,
    formState: { errors: centerErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: "",
      MatKhau: "",
      isCenter: true
    },
  });

  // Xử lý đăng nhập người dùng thông thường
  const onSubmitUser = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const user = await login(data);
      toast.success("Đăng nhập thành công");
      
      // Điều hướng người dùng sau khi đăng nhập
      const targetPath = redirectPath || roleDefaultPages[user.MaVaiTro] || "/";
      router.push(targetPath);
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý đăng nhập cơ sở tình nguyện
  const onSubmitCenter = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const user = await login(data);
      toast.success("Đăng nhập thành công");
      
      // Điều hướng cơ sở sau khi đăng nhập
      const targetPath = redirectPath || "/volunteer-center";
      router.push(targetPath);
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
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
          <TabsPrimitive.Root 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsPrimitive.List className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-4 w-full grid grid-cols-2">
              <TabsPrimitive.Trigger 
                value="user"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Người dùng
              </TabsPrimitive.Trigger>
              <TabsPrimitive.Trigger 
                value="center"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Cơ sở tình nguyện
              </TabsPrimitive.Trigger>
            </TabsPrimitive.List>

            {/* Form đăng nhập người dùng */}
            <TabsPrimitive.Content value="user" className="mt-0">
              <form onSubmit={handleSubmitUser(onSubmitUser)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="email@example.com"
                    className={cn(userErrors.Email && "border-destructive")}
                    {...registerUser("Email")}
                  />
                  {userErrors.Email && (
                    <p className="text-destructive text-sm">{userErrors.Email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">Mật khẩu</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="••••••••"
                    className={cn(userErrors.MatKhau && "border-destructive")}
                    {...registerUser("MatKhau")}
                  />
                  {userErrors.MatKhau && (
                    <p className="text-destructive text-sm">{userErrors.MatKhau.message}</p>
                  )}
                </div>
                {/* Không hiển thị trường isCenter ra giao diện */}
                <input type="hidden" {...registerUser("isCenter")} />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  variant="default"
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </form>
            </TabsPrimitive.Content>

            {/* Form đăng nhập cơ sở tình nguyện */}
            <TabsPrimitive.Content value="center" className="mt-0">
              <form onSubmit={handleSubmitCenter(onSubmitCenter)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="center-email">Email</Label>
                  <Input
                    id="center-email"
                    type="email"
                    placeholder="email@example.com"
                    className={cn(centerErrors.Email && "border-destructive")}
                    {...registerCenter("Email")}
                  />
                  {centerErrors.Email && (
                    <p className="text-destructive text-sm">{centerErrors.Email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="center-password">Mật khẩu</Label>
                  <Input
                    id="center-password"
                    type="password"
                    placeholder="••••••••"
                    className={cn(centerErrors.MatKhau && "border-destructive")}
                    {...registerCenter("MatKhau")}
                  />
                  {centerErrors.MatKhau && (
                    <p className="text-destructive text-sm">{centerErrors.MatKhau.message}</p>
                  )}
                </div>
                {/* Không hiển thị trường isCenter ra giao diện */}
                <input type="hidden" {...registerCenter("isCenter")} />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  variant="default"
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </form>
            </TabsPrimitive.Content>
          </TabsPrimitive.Root>
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