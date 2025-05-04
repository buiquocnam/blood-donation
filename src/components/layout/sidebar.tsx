"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { UserRole } from "@/features/auth/types";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Droplet, 
  Calendar, 
  Home, 
  User, 
  Settings, 
  FileText, 
  BellDot, 
  Building, 
  BarChart3, 
  ShieldCheck
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Danh sách menu dựa trên vai trò người dùng
  const sidebarItems: SidebarItem[] = [
    // Mục chung cho tất cả các vai trò
    {
      title: "Bảng điều khiển",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["donor", "medical_staff", "doctor", "volunteer_center_manager", "blood_bank_director", "admin"],
    },
    {
      title: "Hồ sơ cá nhân",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      roles: ["donor", "medical_staff", "doctor", "volunteer_center_manager", "blood_bank_director", "admin"],
    },

    // Người hiến máu
    {
      title: "Sự kiện hiến máu",
      href: "/donor/events",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["donor"],
    },
    {
      title: "Lịch sử hiến máu",
      href: "/donor/history",
      icon: <FileText className="h-5 w-5" />,
      roles: ["donor"],
    },

    // Nhân viên y tế
    {
      title: "Đăng ký hiến máu",
      href: "/medical-staff/registrations",
      icon: <FileText className="h-5 w-5" />,
      roles: ["medical_staff"],
    },
    {
      title: "Phản hồi",
      href: "/medical-staff/feedbacks",
      icon: <BellDot className="h-5 w-5" />,
      roles: ["medical_staff"],
    },

    // Bác sĩ
    {
      title: "Danh sách hiến máu",
      href: "/doctor/donors",
      icon: <Users className="h-5 w-5" />,
      roles: ["doctor"],
    },
    {
      title: "Hồ sơ hiến máu",
      href: "/doctor/records",
      icon: <FileText className="h-5 w-5" />,
      roles: ["doctor"],
    },

    // Trưởng cơ sở tình nguyện
    {
      title: "Thông báo",
      href: "/volunteer-center/notifications",
      icon: <BellDot className="h-5 w-5" />,
      roles: ["volunteer_center_manager"],
    },
    {
      title: "Đăng ký tổ chức",
      href: "/volunteer-center/events",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["volunteer_center_manager"],
    },

    // Giám đốc ngân hàng máu
    {
      title: "Quản lý sự kiện",
      href: "/blood-bank/events",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["blood_bank_director"],
    },
    {
      title: "Cơ sở tình nguyện",
      href: "/blood-bank/centers",
      icon: <Building className="h-5 w-5" />,
      roles: ["blood_bank_director"],
    },
    {
      title: "Báo cáo & Thống kê",
      href: "/blood-bank/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["blood_bank_director"],
    },

    // Admin
    {
      title: "Người dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Đơn vị máu",
      href: "/admin/blood-units",
      icon: <Droplet className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Báo cáo",
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Cài đặt hệ thống",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Phân quyền",
      href: "/admin/roles",
      icon: <ShieldCheck className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];

  // Lọc menu dựa trên vai trò người dùng
  const filteredItems = sidebarItems.filter((item) => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-white">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </span>
          <span className="text-lg font-bold">BloodDonate</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
} 