import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterEventForm } from '@/features/volunteer-center';
import { mockCoSoTinhNguyen } from '@/mock/volunteers';
import { fetchAnnouncementById } from '@/features/volunteer-center/services';
import { CalendarIcon, Clock, Users, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClientAnnouncementDetail from './client-page';

interface AnnouncementDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AnnouncementDetailPageProps): Promise<Metadata> {
  const id = params.id;
  const announcement = await fetchAnnouncementById(id);
  
  if (!announcement) {
    return {
      title: 'Thông báo không tồn tại',
    };
  }
  
  return {
    title: `${announcement.TieuDe} | Thông báo hiến máu`,
    description: announcement.NoiDung.substring(0, 160),
  };
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  const id = params.id;
  // Sử dụng service để lấy dữ liệu thông báo theo FFMA
  const announcement = await fetchAnnouncementById(id);
  
  // Use the first volunteer center from mock data (in a real app, this would be the current user)
  const centerId = mockCoSoTinhNguyen[0].IDCoSoTinhNguyen;
  
  if (!announcement) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Link 
        href="/volunteer-center" 
        className="flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Quay lại danh sách thông báo
      </Link>
      
      <ClientAnnouncementDetail 
        announcement={announcement}
        centerId={centerId}
      />
    </div>
  );
} 