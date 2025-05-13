"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthMiddleware } from "@/lib/auth/auth-middleware";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Trong ứng dụng thực tế, chúng ta sẽ kiểm tra xem người dùng đã đăng nhập hay chưa
  // và chuyển hướng đến trang đăng nhập nếu họ chưa đăng nhập

  return (
      <div className="container mx-auto py-6">
        {children}
      </div>
  );
} 