"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { UserRole } from "@/features/auth/types";

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
const roleDefaultPages: Record<UserRole, string> = {
  donor: "/events",
  medical_staff: "/medical-staff",
  doctor: "/doctor",
  volunteer_center_manager: "/volunteer-center",
  blood_bank_director: "/blood-bank/notifications",
  admin: "/admin",
};

// Ánh xạ vai trò người dùng đến các đường dẫn được phép
const rolePathMapping: Record<UserRole, string[]> = {
  donor: ["/profile", "/events", "/donor"],
  medical_staff: ["/profile", "/medical-staff"],
  doctor: ["/profile", "/doctor"],
  volunteer_center_manager: ["/profile", "/volunteer-center"],
  blood_bank_director: [
    "/profile", 
    "/blood-bank", 
    "/blood-bank/notifications", 
    "/blood-bank/events", 
    "/blood-bank/organization-requests", 
    "/blood-bank/requests", 
    "/blood-bank/reports"
  ],
  admin: ["/profile", "/admin"],
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
      const searchParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      const redirectParam = searchParams.get("redirect") || roleDefaultPages[user.role] || "/";
      
      const allowedPaths = rolePathMapping[user.role] || [];
      const isValidRedirect = protectedPaths.concat(publicPaths).some(
        path => redirectParam === path || redirectParam.startsWith(`${path}/`)
      );
      const isAllowedRedirect = allowedPaths.some(
        path => redirectParam === path || redirectParam.startsWith(`${path}/`)
      );
  
      redirectTo(
        isValidRedirect && isAllowedRedirect
          ? redirectParam
          : roleDefaultPages[user.role] || "/"
      );
      return;
    }
  
    // Nếu đã đăng nhập và vào trang protected nhưng không đúng vai trò
    if (isAuthenticated && user && isProtectedPath) {
      const allowedPaths = rolePathMapping[user.role] || [];
      const hasPermission = allowedPaths.some(
        path => pathname === path || pathname.startsWith(`${path}/`)
      );
  
      if (!hasPermission) {
        redirectTo(roleDefaultPages[user.role] || "/");
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
      const role = user.role;
      const allowedPaths = rolePathMapping[role] || [];
      
      // Kiểm tra xem người dùng có quyền truy cập vào đường dẫn hiện tại không
      const hasPermission = allowedPaths.some(path => pathname.startsWith(path));
      
      if (!hasPermission) {
        // Chuyển hướng đến trang mặc định của vai trò
        const defaultPage = roleDefaultPages[role] || "/";
        router.push(defaultPage);
        return;
      }
    }

    // Nếu đã đăng nhập và đang ở trang đăng nhập/đăng ký, chuyển hướng đến trang mặc định của vai trò
    if (isAuthenticated && isAuthPath && user) {
      // Lấy redirect từ URL nếu có
      const searchParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      const redirectPath = searchParams.get("redirect") || roleDefaultPages[user.role] || "/";
      
      // Kiểm tra xem đường dẫn redirect có tồn tại trong hệ thống không
      const isValidRedirect = 
        protectedPaths.some(path => redirectPath.startsWith(path)) || 
        publicPaths.some(path => redirectPath === path || redirectPath.startsWith(`${path}/`));
      
      if (!isValidRedirect) {
        // Nếu đường dẫn redirect không hợp lệ, chuyển về trang mặc định của vai trò
        router.push(roleDefaultPages[user.role] || "/");
        return;
      }
      
      // Kiểm tra xem đường dẫn redirect có phải là đường dẫn được phép không theo vai trò
      const role = user.role;
      const allowedPaths = rolePathMapping[role] || [];
      const isAllowedRedirect = allowedPaths.some(path => redirectPath.startsWith(path)) || 
                               publicPaths.some(path => redirectPath === path || redirectPath.startsWith(`${path}/`));
      
      // Nếu đường dẫn redirect không được phép, chuyển hướng đến trang mặc định của vai trò
      // Thay vì cố gắng chuyển hướng đến một đường dẫn không được phép
      if (!isAllowedRedirect) {
        router.push(roleDefaultPages[role] || "/");
      } else {
        router.push(redirectPath);
      }
      return;
    }
  }, [pathname, isAuthenticated, isLoading, router, user]);

  return children;
}

// HOC để bảo vệ một component cụ thể
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
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
        if (!requiredRoles.includes(user.role)) {
          const defaultPage = roleDefaultPages[user.role] || "/";
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
    if (requiredRoles && requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
} 