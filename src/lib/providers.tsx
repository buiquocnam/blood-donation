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

  // Xác định nếu đang ở trang 404 hoặc trang lỗi
  const isErrorPage = pathname === "/not-found" || pathname === "/error" || !pathname;

  return (
    <QueryClientProvider client={queryClient}>
      {isErrorPage ? (
        // Không bao bọc các trang lỗi trong AuthMiddleware
        <>
          <Toaster position="top-right" />
          {children}
        </>
      ) : (
        // Bao bọc các trang thông thường trong AuthMiddleware
        <AuthMiddleware>
          <Toaster position="top-right" />
          {children}
        </AuthMiddleware>
      )}
    </QueryClientProvider>
  );
} 