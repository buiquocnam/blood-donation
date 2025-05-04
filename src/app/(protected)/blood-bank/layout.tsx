import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Bell, 
  Calendar, 
  Home, 
  Settings, 
  User 
} from "lucide-react";

export default function BloodBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="p-6">
          <h2 className="text-xl font-bold">Ngân hàng Máu</h2>
          <p className="text-sm text-muted-foreground">Hệ thống quản lý</p>
        </div>
        <nav className="px-3 py-2">
          <div className="space-y-1">
            <Link href="/blood-bank" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/blood-bank/notifications" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Thông báo
              </Button>
            </Link>
            <Link href="/blood-bank/events" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Sự kiện
              </Button>
            </Link>
            <Link href="/blood-bank/statistics" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Thống kê
              </Button>
            </Link>
            <Link href="/profile" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Tài khoản
              </Button>
            </Link>
            <Link href="/settings" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </Button>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 