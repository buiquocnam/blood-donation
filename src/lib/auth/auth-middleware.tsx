"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { AuthUser } from "@/features/auth/types";

type Props = {
  children: React.ReactNode;
};

// Các đường dẫn được bảo vệ (cần đăng nhập)
const protectedPaths = ["/profile", "/admin", "/medical-staff", "/doctor", "/volunteer-center", "/donor", "/blood-bank"];

// Các đường dẫn công khai (không cần đăng nhập)
const publicPaths = ["/", "/about", "/events", "/auth/login", "/auth/register", "/contact"];

// Đường dẫn 404 và các trang hệ thống
const systemPaths = ["/not-found", "/error"];

// Trang mặc định cho từng vai trò
const roleDefaultPages: Record<string, string> = {
  ROLE_DONOR: "/events",
  ROLE_MEDICAL_STAFF: "/medical-staff",
  ROLE_DOCTOR: "/doctor",
  ROLE_VOLUNTEER_MANAGER: "/volunteer-center",
  ROLE_BLOOD_DIRECTOR: "/blood-bank/notifications",
  ROLE_ADMIN: "/admin",
};

// Ánh xạ vai trò người dùng đến các đường dẫn được phép
const rolePathMapping: Record<string, string[]> = {
  ROLE_DONOR: ["/profile", "/events", "/donor"],
  ROLE_MEDICAL_STAFF: ["/profile", "/medical-staff"],
  ROLE_DOCTOR: ["/profile", "/doctor"],
  ROLE_VOLUNTEER_MANAGER: ["/profile", "/volunteer-center"],
  ROLE_BLOOD_DIRECTOR: [
    "/profile", 
    "/blood-bank", 
    "/blood-bank/notifications", 
    "/blood-bank/events", 
    "/blood-bank/organization-requests", 
    "/blood-bank/requests", 
    "/blood-bank/reports"
  ],
  ROLE_ADMIN: ["/profile", "/admin"],
};

// Middleware để kiểm tra xác thực
export function AuthMiddleware({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  useEffect(() => {
    if (isLoading) return;
  
    const isSystemPath = systemPaths.includes(pathname);
    if (isSystemPath) return;
  
    const isAuthPath = pathname.startsWith("/auth/");
    const isPublicPath = publicPaths.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    );
    const isProtectedPath = protectedPaths.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    );
  
    const redirectTo = (url: string) => router.push(url);
  
    // Nếu chưa đăng nhập và vào trang protected
    if (isProtectedPath && !isAuthenticated) {
      redirectTo(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
  
    // Nếu đã đăng nhập và ở trang auth (login/register)
    if (isAuthenticated && isAuthPath && user) {
      // Chuyển hướng đến trang mặc định dựa trên vai trò
      redirectTo(roleDefaultPages[user.MaVaiTro] || "/");
      return;
    }
  
    // Nếu đã đăng nhập và vào trang protected nhưng không đúng vai trò
    if (isAuthenticated && user && isProtectedPath) {
      const allowedPaths = rolePathMapping[user.MaVaiTro] || [];
      const hasPermission = allowedPaths.some(
        path => pathname === path || pathname.startsWith(`${path}/`)
      );
  
      if (!hasPermission) {
        redirectTo(roleDefaultPages[user.MaVaiTro] || "/");
        return;
      }
    }
  }, [pathname, isAuthenticated, isLoading, router, user]);
  

  useEffect(() => {
    // Bỏ qua kiểm tra nếu đang tải
    if (isLoading) return;

    // Kiểm tra xem có phải đường dẫn hệ thống (404, v.v.)
    const isSystemPath = systemPaths.some(path => pathname === path);
    if (isSystemPath) {
      return; // Không kiểm tra quyền với các trang hệ thống
    }

    // Kiểm tra xem đường dẫn có phải là public path
    const isPublicPath = publicPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    // Kiểm tra đường dẫn có được bảo vệ không
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    
    // Kiểm tra đường dẫn có là đường dẫn xác thực không
    const isAuthPath = pathname.startsWith("/auth/");

    // Nếu không phải đường dẫn public, protected, hay auth, có thể là đường dẫn không tồn tại
    // Để Next.js xử lý trang 404 tự động
    if (!isPublicPath && !isProtectedPath && !isAuthPath) {
      return;
    }

    // Nếu đường dẫn được bảo vệ và chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (isProtectedPath && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Kiểm tra quyền truy cập trang dựa trên vai trò
    if (isAuthenticated && user && isProtectedPath) {
      const role = user.MaVaiTro;
      const allowedPaths = rolePathMapping[role] || [];
      
      // Kiểm tra xem người dùng có quyền truy cập vào đường dẫn hiện tại không
      const hasPermission = allowedPaths.some(path => pathname.startsWith(path));
      
      if (!hasPermission) {
        // Chuyển hướng đến trang mặc định của vai trò
        router.push(roleDefaultPages[user.MaVaiTro] || "/");
        return;
      }
    }

    // Nếu đã đăng nhập và đang ở trang đăng nhập/đăng ký, chuyển hướng đến trang mặc định của vai trò
    if (isAuthenticated && isAuthPath && user) {
      // Chuyển hướng đến trang mặc định dựa trên vai trò
      router.push(roleDefaultPages[user.MaVaiTro] || "/");
      return;
    }
  }, [pathname, isAuthenticated, isLoading, router, user]);

  return children;
}

// HOC để bảo vệ một component cụ thể
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // Nếu có yêu cầu vai trò cụ thể
      if (requiredRoles && requiredRoles.length > 0 && user) {
        if (!requiredRoles.includes(user.MaVaiTro)) {
          const defaultPage = roleDefaultPages[user.MaVaiTro] || "/";
          router.push(defaultPage);
          return;
        }
      }
    }, [isAuthenticated, user, router]);

    // Nếu chưa xác thực, hiển thị loading hoặc không hiển thị gì
    if (!isAuthenticated) {
      return null;
    }

    // Nếu có yêu cầu vai trò và người dùng không có vai trò được yêu cầu
    if (requiredRoles && requiredRoles.length > 0 && user && !requiredRoles.includes(user.MaVaiTro)) {
      return null;
    }

    return <Component {...props} />;
  };
} 