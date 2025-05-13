import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { RegistrationTabs } from '@/features/medical-staff';

interface RegistrationsEventPageProps {
  params: Promise<{ eventId: string }>; // Cập nhật type để phản ánh params là Promise
}

/**
 * Trang quản lý đăng ký hiến máu cho một sự kiện cụ thể
 */
export default async function RegistrationsEventPage({ 
  params 
}: RegistrationsEventPageProps) {
  const { eventId } = await params; // Await params để lấy eventId

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>}>
        <RegistrationTabs eventId={eventId} />
      </Suspense>
    </div>
  );
}