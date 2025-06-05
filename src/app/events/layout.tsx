import Link from 'next/link';
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

export default function EventsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-6 px-4 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}