"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/features/auth/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  roles?: UserRole[];
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
    return item.roles.includes(user?.role as UserRole);
  });

  // Render role-specific management dropdown
  const renderManagementDropdown = () => {
    if (!isAuthenticated || !user) return null;

    let menuItems = [];

    switch (user.role) {
      case "blood_bank_director":
        menuItems = [
          { label: "Quản lý thông báo", href: "/blood-bank/notifications" },
          { label: "Quản lý sự kiện", href: "/blood-bank/events" },
          { label: "Quản lý yêu cầu", href: "/blood-bank/requests" },
          { label: "Báo cáo & thống kê", href: "/blood-bank/reports" },
        ];
        break;
      case "volunteer_center_manager":
        menuItems = [
          { label: "Quản lý tình nguyện viên", href: "/volunteer-center/volunteers" },
          { label: "Quản lý sự kiện", href: "/volunteer-center/events" },
        ];
        break;
      case "medical_staff":
        menuItems = [
          { label: "Quản lý hiến máu", href: "/medical-staff/donations" },
          { label: "Quản lý sự kiện", href: "/medical-staff/events" },
        ];
        break;
      case "doctor":
        menuItems = [
          { label: "Đánh giá máu", href: "/doctor/evaluations" },
          { label: "Lịch sử hiến máu", href: "/doctor/donation-history" },
        ];
        break;
      case "admin":
        menuItems = [
          { label: "Quản lý người dùng", href: "/admin/users" },
          { label: "Quản lý bệnh viện", href: "/admin/hospitals" },
          { label: "Cài đặt hệ thống", href: "/admin/settings" },
        ];
        break;
      default:
        return null;
    }

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
    
    switch (user.role) {
      case "donor":
        return "/events";
      case "medical_staff":
        return "/medical-staff";
      case "doctor":
        return "/doctor";
      case "volunteer_center_manager":
        return "/volunteer-center";
      case "blood_bank_director":
        return "/blood-bank/notifications";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
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
                  <span className="truncate">{user?.name}</span> <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile`}>Thông tin tài khoản</Link>
                </DropdownMenuItem>
                {user?.role === "blood_bank_director" && (
                  <DropdownMenuItem asChild>
                    <Link href="/blood-bank/notifications/create">Tạo thông báo mới</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === "donor" && (
                  <DropdownMenuItem asChild>
                    <Link href="/donor/donation-history">Lịch sử hiến máu</Link>
                  </DropdownMenuItem>
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
        <div className="md:hidden border-t">
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
                  {user.role === "blood_bank_director" && (
                    <>
                      <Link href="/blood-bank/notifications" className="block text-sm py-1 hover:text-primary">Quản lý thông báo</Link>
                      <Link href="/blood-bank/events" className="block text-sm py-1 hover:text-primary">Quản lý sự kiện</Link>
                      <Link href="/blood-bank/requests" className="block text-sm py-1 hover:text-primary">Quản lý yêu cầu</Link>
                      <Link href="/blood-bank/reports" className="block text-sm py-1 hover:text-primary">Báo cáo & thống kê</Link>
                    </>
                  )}
                  {user.role === "volunteer_center_manager" && (
                    <>
                      <Link href="/volunteer-center/volunteers" className="block text-sm py-1 hover:text-primary">Quản lý tình nguyện viên</Link>
                      <Link href="/volunteer-center/events" className="block text-sm py-1 hover:text-primary">Quản lý sự kiện</Link>
                    </>
                  )}
                  {user.role === "medical_staff" && (
                    <>
                      <Link href="/medical-staff/donations" className="block text-sm py-1 hover:text-primary">Quản lý hiến máu</Link>
                      <Link href="/medical-staff/events" className="block text-sm py-1 hover:text-primary">Quản lý sự kiện</Link>
                    </>
                  )}
                  {user.role === "doctor" && (
                    <>
                      <Link href="/doctor/evaluations" className="block text-sm py-1 hover:text-primary">Đánh giá máu</Link>
                      <Link href="/doctor/donation-history" className="block text-sm py-1 hover:text-primary">Lịch sử hiến máu</Link>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <Link href="/admin/users" className="block text-sm py-1 hover:text-primary">Quản lý người dùng</Link>
                      <Link href="/admin/hospitals" className="block text-sm py-1 hover:text-primary">Quản lý bệnh viện</Link>
                      <Link href="/admin/settings" className="block text-sm py-1 hover:text-primary">Cài đặt hệ thống</Link>
                    </>
                  )}
                </div>
              </>
            )}
            
            <div className="border-t pt-3 mt-3 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    Xin chào, {user?.name}
                  </div>
                  <Link 
                    href={`/profile`}
                    className="block text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>
                  {user?.role === "blood_bank_director" && (
                    <Link 
                      href="/blood-bank/notifications/create"
                      className="block text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Tạo thông báo mới
                    </Link>
                  )}
                  {user?.role === "donor" && (
                    <Link 
                      href="/donor/donation-history"
                      className="block text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Lịch sử hiến máu
                    </Link>
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