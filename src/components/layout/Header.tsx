"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Button } from "@/components/ui/button";
import { AuthUser, UserRole } from "@/features/auth/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { isNguoiDung } from "@/utils/typeGuards";

// Get display name based on user type
function getDisplayName(user: AuthUser | null): string {
  if (!user) return 'Tài khoản';
  return isNguoiDung(user) ? user.HoTen : 'Tài khoản';
}

interface NavItem {
  label: string;
  href: string;
  roles?: string[];
}

interface MenuItem {
  label: string;
  href: string;
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Đóng mobile menu khi resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems: NavItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Sự kiện", href: "/events" },
    { label: "Về chúng tôi", href: "/about" },
    { label: "Liên hệ", href: "/contact" },
  ];

  // Lọc các mục menu dựa trên vai trò
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true; // Hiển thị cho tất cả người dùng
    if (!isAuthenticated) return false; // Ẩn với khách
    return item.roles.includes(user?.MaVaiTro || '');
  });

  // Lấy danh sách menu quản lý theo vai trò
  const getManagementMenuItems = (): MenuItem[] => {
    if (!isAuthenticated || !user) return [];

    switch (user.MaVaiTro) {
      case UserRole.ROLE_BLOOD_DIRECTOR:
        return [
          { label: "Quản lý thông báo", href: "/blood-bank/notifications" },
          { label: "Quản lý sự kiện", href: "/blood-bank/events" },
          { label: "Quản lý yêu cầu", href: "/blood-bank/requests" },
          { label: "Báo cáo & thống kê", href: "/blood-bank/reports" },
        ];
      case UserRole.ROLE_VOLUNTEER_MANAGER:
        return [
          { label: "Quản lý tình nguyện viên", href: "/volunteer-center/volunteers" },
          { label: "Quản lý sự kiện", href: "/volunteer-center/events" },
        ];
      case UserRole.ROLE_MEDICAL_STAFF:
        return [
          { label: "Quản lý hiến máu", href: "/medical-staff" },
          { label: "Quản lý phản hồi", href: "/medical-staff/feedback" },
        ];
      case UserRole.ROLE_DOCTOR:
        return [
          { label: "Quản lý hiến máu", href: "/doctor" },
        ];
      case UserRole.ROLE_ADMIN:
        return [
          { label: "Quản lý người dùng", href: "/admin/users" },
          { label: "Quản lý bệnh viện", href: "/admin/hospitals" },
          { label: "Cài đặt hệ thống", href: "/admin/settings" },
        ];
      case UserRole.ROLE_DONOR:
        return [
          { label: "Khu vực người hiến máu", href: "/donor/dashboard" },
          { label: "Đăng ký hiến máu", href: "/donor/donations/register" },
        ];
      default:
        return [];
    }
  };

  // Render role-specific management dropdown
  const renderManagementDropdown = () => {
    const menuItems = getManagementMenuItems();
    
    if (menuItems.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1 px-3">
            Quản lý <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Hệ thống quản lý</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Get default page based on user role
  const getUserHomePage = () => {
    if (!user) return "/";
    
    switch (user.MaVaiTro) {
      case UserRole.ROLE_DONOR:
        return "/donor/dashboard";
      case UserRole.ROLE_MEDICAL_STAFF:
        return "/medical-staff";
      case UserRole.ROLE_DOCTOR:
        return "/doctor";
      case UserRole.ROLE_VOLUNTEER_MANAGER:
        return "/volunteer-center";
      case UserRole.ROLE_BLOOD_DIRECTOR:
        return "/blood-bank/notifications";
      case UserRole.ROLE_ADMIN:
        return "/admin";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href={isAuthenticated ? getUserHomePage() : "/"} className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </span>
            <span className="text-lg font-bold">BloodDonate</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          {renderManagementDropdown()}
        </nav>

        {/* Auth buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 min-w-[120px] justify-between px-3">
                  <span className="truncate">{getDisplayName(user)}</span> <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile`}>Thông tin tài khoản</Link>
                </DropdownMenuItem>
                {user?.MaVaiTro === "ROLE_DIRECTOR" && (
                  <DropdownMenuItem asChild>
                    <Link href="/blood-bank/notifications/create">Tạo thông báo mới</Link>
                  </DropdownMenuItem>
                )}
                {user?.MaVaiTro === "ROLE_DONOR" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/donor/dashboard">Khu vực người hiến máu</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/donor/donations/register">Đăng ký hiến máu</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Management links for mobile */}
            {isAuthenticated && user && (
              <>
                <div className="border-t pt-3 mt-3">
                  <div className="text-sm font-semibold mb-2">Quản lý</div>
                  {getManagementMenuItems().map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className="block text-sm py-1 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
            
            <div className="border-t pt-3 mt-3 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    Xin chào, {getDisplayName(user)}
                  </div>
                  <Link 
                    href={`/profile`}
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>
                  {user?.MaVaiTro === "ROLE_DIRECTOR" && (
                    <Link 
                      href="/blood-bank/notifications/create"
                      className="block text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Tạo thông báo mới
                    </Link>
                  )}
                  {user?.MaVaiTro === "ROLE_DONOR" && (
                    <>
                      <Link 
                        href="/donor/dashboard"
                        className="block text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Khu vực người hiến máu
                      </Link>
                      <Link 
                        href="/donor/donations/register"
                        className="block text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng ký hiến máu
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" className="w-full" onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}>
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/auth/login">Đăng nhập</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/auth/register">Đăng ký</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
