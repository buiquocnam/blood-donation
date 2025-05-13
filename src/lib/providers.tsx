"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthMiddleware } from "@/lib/auth/auth-middleware";
import { usePathname } from "next/navigation";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 phút
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // TODO: Bỏ comment dòng dưới đây khi đã hoàn thiện hệ thống xác thực
  // Tạm thời vô hiệu hóa middleware để phát triển
  const isPublicRoute = true; // Coi tất cả các route là public trong quá trình phát triển
  
  // Xác định nếu đang ở trang public hoặc trang lỗi
  // const isPublicRoute = 
  //   pathname === "/" || 
  //   pathname === "/auth/login" || 
  //   pathname === "/auth/register" || 
  //   pathname === "/about" || 
  //   pathname === "/not-found" || 
  //   pathname === "/error" || 
  //   !pathname;

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      {isPublicRoute ? children : <AuthMiddleware>{children}</AuthMiddleware>}
    </QueryClientProvider>
  );
} 