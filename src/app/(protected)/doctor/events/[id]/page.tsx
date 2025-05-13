import { QuanLyHienMauPage } from '@/features/doctor';
import { Suspense } from 'react';

interface QuanLyHienMauPageProps {
  params: {
    id: string;
  };
}

/**
 * Trang quản lý hiến máu của sự kiện theo id
 */
export default function QuanLyHienMauPageRoute({ params }: QuanLyHienMauPageProps) {
  return (
    <main className="container mx-auto py-6">
      <Suspense fallback={<p>Đang tải...</p>}>
        <QuanLyHienMauPage idSuKien={params.id} tenSuKien={`Sự kiện #${params.id}`} />
      </Suspense>
    </main>
  );
} 