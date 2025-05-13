import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/sidebar';
export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 