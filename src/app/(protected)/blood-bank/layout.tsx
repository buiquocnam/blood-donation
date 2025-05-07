import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Bell, 
  Calendar, 
  Home, 
  Settings, 
  User, 
  Droplets,
  Activity,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BloodBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Modern Sidebar */}
      <aside className="w-72 border-r bg-background shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-red-600" />
            <div>
              <h2 className="text-xl font-bold">Ngân hàng Máu</h2>
              <p className="text-sm text-muted-foreground">Hệ thống quản lý hiến máu</p>
            </div>
          </div>
        </div>
        
        <nav className="px-4 py-6 flex-1">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
              Dashboard
            </p>
            <NavItem href="/blood-bank" icon={<Home className="mr-2 h-4 w-4" />} label="Tổng quan" />
            <NavItem href="/blood-bank/notifications" icon={<Bell className="mr-2 h-4 w-4" />} label="Thông báo" />
            <NavItem href="/blood-bank/events" icon={<Calendar className="mr-2 h-4 w-4" />} label="Sự kiện" />
            <NavItem href="/blood-bank/statistics" icon={<BarChart3 className="mr-2 h-4 w-4" />} label="Thống kê" />
            
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                Cài đặt người dùng
              </p>
            </div>
            <NavItem href="/profile" icon={<User className="mr-2 h-4 w-4" />} label="Tài khoản" />
            <NavItem href="/settings" icon={<Settings className="mr-2 h-4 w-4" />} label="Cài đặt" />
          </div>
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex h-full">
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

function NavItem({ href, icon, label }: NavItemProps) {
  // We would need to add logic to determine if this is the active route
  const isActive = false; // This should use router to determine if active
  
  return (
    <Link href={href} passHref>
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start py-2 px-3 h-10 font-medium",
          isActive && "bg-muted text-foreground font-medium"
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
} 