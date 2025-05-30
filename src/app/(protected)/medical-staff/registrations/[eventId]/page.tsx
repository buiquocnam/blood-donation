import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
import ClientRegistrationTabs from './client-registration-tabs';
import { notFound } from 'next/navigation';

interface RegistrationsEventPageProps {
  params: Promise<{eventId: string}>
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: 'Quản lý đăng ký hiến máu',
  description: 'Quản lý đăng ký hiến máu cho sự kiện',
};

/**
 * Trang quản lý đăng ký hiến máu cho một sự kiện cụ thể
 * Tuân thủ kiến trúc FFMA: Server Component truyền eventId xuống Client Component
 * để Client Component tự gọi API và xử lý tương tác
 */
export default async function RegistrationsEventPage({ params, searchParams }: RegistrationsEventPageProps) {
  const { eventId } = await params;
  const search = await searchParams;

  try {
    // Lấy dữ liệu từ query parameters (nếu có)
    const eventFromQuery = search.event ? JSON.parse(decodeURIComponent(search.event as string)) : null;
   
    return (
      <div className="space-y-6">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <ClientRegistrationTabs
            eventId={eventId}
            currentEvent={eventFromQuery}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error(`[RegistrationsEventPage] Error loading data for event ${eventId}:`, error);
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
      </div>
    );
  }
}