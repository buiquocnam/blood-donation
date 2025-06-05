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
  ShieldCheck,
  Clock 
} from "lucide-react";
import { isNguoiDung, isCoSoTinhNguyen } from "@/utils/typeGuards";
interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Danh sách menu dựa trên vai trò người dùng
  const sidebarItems: SidebarItem[] = [
    // Mục chung cho tất cả các vai trò
    {
      title: "Bảng điều khiển",
      href: (user?.MaVaiTro === "ROLE_DONOR") ? "/donor/dashboard" :
            (user?.MaVaiTro === "ROLE_DOCTOR") ? "/doctor" :
            (user?.MaVaiTro === "ROLE_VOLUNTEER") ? "/volunteer-center" :
            (user?.MaVaiTro === "ROLE_DIRECTOR") ? "/director/dashboard" :
            (user?.MaVaiTro === "ROLE_ADMIN") ? "/admin/dashboard" : "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: Object.values(UserRole).join(","),
    },
   
    {
      title: "Lịch sử đăng ký",
      href: "/donor/history/registrations",
      icon: <Calendar className="h-5 w-5" />,
      roles: UserRole.ROLE_DONOR,
    },
    {
      title: "Lịch sử hiến máu",
      href: "/donor/history/donations",
      icon: <Clock className="h-5 w-5" />,
      roles: UserRole.ROLE_DONOR,
    },
    {
      title: "Giấy chứng nhận",
      href: "/donor/certificates",
      icon: <FileText className="h-5 w-5" />,
      roles: UserRole.ROLE_DONOR,
    },

    // Nhân viên y tế
    {
      title: "Quản lý đơn đăng ký",
      href: "/medical-staff/registrations",
      icon: <Calendar className="h-5 w-5" />,
      roles: UserRole.ROLE_MEDICAL_STAFF,
    },
    {
      title: "Phản hồi",
      href: "/medical-staff/feedbacks",
      icon: <BellDot className="h-5 w-5" />,
      roles: UserRole.ROLE_MEDICAL_STAFF,
    },

    // Bác sĩ
    {
      title: "Quản lý hiến máu",
      href: "/doctor/events",
      icon: <Users className="h-5 w-5" />,
      roles: UserRole.ROLE_DOCTOR,
    },

    // Trưởng cơ sở tình nguyện
    {
      title: "Thông báo hiến máu",
      href: "/volunteer-center?tab=announcements",
      icon: <BellDot className="h-5 w-5" />,
      roles: UserRole.ROLE_VOLUNTEER_MANAGER,
    },
    {
      title: "Lịch sử đăng ký",
      href: "/volunteer-center?tab=event-registrations",
      icon: <Calendar className="h-5 w-5" />,
      roles: UserRole.ROLE_VOLUNTEER_MANAGER,
    },

    // Giám đốc ngân hàng máu
    {
      title: "Quản lý sự kiện",
      href: "/blood-bank/events",
      icon: <Calendar className="h-5 w-5" />,
      roles: UserRole.ROLE_BLOOD_DIRECTOR,
    },
    {
      title: "Cơ sở tình nguyện",
      href: "/blood-bank/centers",
      icon: <Building className="h-5 w-5" />,
      roles: UserRole.ROLE_BLOOD_DIRECTOR,
    },
    {
      title: "Báo cáo & Thống kê",
      href: "/blood-bank/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: UserRole.ROLE_BLOOD_DIRECTOR,
    },

    // Admin
    {
      title: "Người dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      roles: UserRole.ROLE_ADMIN,
    },
    {
      title: "Đơn vị máu",
      href: "/admin/blood-units",
      icon: <Droplet className="h-5 w-5" />,
      roles: UserRole.ROLE_ADMIN,
    },
    {
      title: "Báo cáo",
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: UserRole.ROLE_ADMIN,
    },
    {
      title: "Cài đặt hệ thống",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: UserRole.ROLE_ADMIN,
    },
    {
      title: "Phân quyền",
      href: "/admin/roles",
      icon: <ShieldCheck className="h-5 w-5" />,
      roles: UserRole.ROLE_ADMIN,
    },

    // Hồ sơ cá nhân
    {
      title: "Hồ sơ cá nhân",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      roles: Object.values(UserRole).join(","),
    },
  ];

  // Lọc menu dựa trên vai trò người dùng
  const filteredItems = sidebarItems.filter((item) => {
    if (!user) return false;
    
    // Xác định vai trò người dùng
    let userRole: keyof typeof UserRole = UserRole.ROLE_DONOR;
    if (isNguoiDung(user)) {
      // Mặc định người dùng có vai trò DONOR
      const maVaiTro = user.MaVaiTro;
      userRole = maVaiTro === UserRole.ROLE_DONOR ? UserRole.ROLE_DONOR : 
                 maVaiTro === UserRole.ROLE_MEDICAL_STAFF ? UserRole.ROLE_MEDICAL_STAFF : 
                 maVaiTro === UserRole.ROLE_DOCTOR ? UserRole.ROLE_DOCTOR : UserRole.ROLE_DONOR;
    } else if (isCoSoTinhNguyen(user)) {
      const maVaiTro = user.MaVaiTro;
      userRole = maVaiTro === UserRole.ROLE_VOLUNTEER_MANAGER ? UserRole.ROLE_VOLUNTEER_MANAGER : 
                 maVaiTro === UserRole.ROLE_BLOOD_DIRECTOR ? UserRole.ROLE_BLOOD_DIRECTOR : UserRole.ROLE_VOLUNTEER_MANAGER;
    }
    
    return item.roles.includes(userRole);
  });

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-white">
      {/* <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </span>
          <span className="text-lg font-bold">BloodDonate</span>
        </Link>
      </div> */}
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
            {isNguoiDung(user) ? user.HoTen?.charAt(0).toUpperCase() : 
             isCoSoTinhNguyen(user) ? user.TenCoSoTinhNguyen?.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">
              {isNguoiDung(user) ? user.HoTen : 
               isCoSoTinhNguyen(user) ? user.TenCoSoTinhNguyen : "Người dùng"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isNguoiDung(user) ? user.Email : 
               isCoSoTinhNguyen(user) ? user.Email : ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
} 