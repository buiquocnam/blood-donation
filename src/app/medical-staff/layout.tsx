'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CalendarDays,
  Droplets
} from 'lucide-react';

const MENU_ITEMS = [
  {
    text: 'Tổng quan',
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: '/medical-staff'
  },
  {
    text: 'Sự kiện',
    icon: <CalendarDays className="h-4 w-4" />,
    href: '/medical-staff/events'
  },
  {
    text: 'Phản hồi',
    icon: <ClipboardList className="h-4 w-4" />,
    href: '/medical-staff/feedbacks'
  },
];

export default function MedicalStaffLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Sidebar */}
      <aside className="sticky top-0 z-30 h-full w-64 border-r bg-background">
        <ScrollArea className="h-full">
          <div className="space-y-4 py-4">
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold tracking-tight">
                Quản lý hiến máu
              </h2>
              <p className="text-sm text-muted-foreground">
                NHÂN VIÊN Y TẾ
              </p>
            </div>
            <Separator className="mx-4" />
            <nav className="grid gap-1 px-2">
              {MENU_ITEMS.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 px-4 py-6",
                    pathname === item.href && "bg-secondary"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 