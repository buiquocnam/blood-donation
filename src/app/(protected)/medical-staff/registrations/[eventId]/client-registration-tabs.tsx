'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DANGKIHIENMAU, TrangThaiDangKy, TrangThaiHienMau } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RegistrationsList } from '@/features/medical-staff/components/registrations/RegistrationsList';
import { DonationsList } from '@/features/medical-staff/components/donations/DonationsList';
import { useQuery } from '@tanstack/react-query';
import { MedicalStaffService } from '@/features/medical-staff/services';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientRegistrationTabsProps {
  eventId: string;
  currentEvent: any;  
}

/**
 * Client component hiển thị tab đăng ký và hiến máu
 * Tuân thủ kiến trúc FFMA: Client Component tự gọi API và xử lý tương tác
 */
export default function ClientRegistrationTabs({ 
  eventId, 
  currentEvent
}: ClientRegistrationTabsProps) {
  const [activeTab, setActiveTab] = useState('registrations');
  const router = useRouter();
  
  // Sử dụng React Query để lấy dữ liệu
  const { 
    data: registrations = [], 
    isLoading: isLoadingRegistrations 
  } = useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => MedicalStaffService.getRegistrationsByEvent(eventId)
  });
  
  const { 
    data: donations = [], 
    isLoading: isLoadingDonations 
  } = useQuery({
    queryKey: ['donations', eventId],
    queryFn: () => MedicalStaffService.getDonationsByEvent(eventId)
  });
  
  // Phân loại đăng ký theo trạng thái
  const pendingRegistrations = registrations.filter(
    reg => reg.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET
  );
  
 
  
  const handleGoBack = () => {
    router.push('/medical-staff/registrations');
  };
  
  // Hiển thị ID của sự kiện an toàn từ eventId hoặc từ currentEvent nếu có
  const eventDisplayName = currentEvent?.IdSuKien || 
                          (Array.isArray(currentEvent) && currentEvent[0]?.IdSuKien) || 
                          eventId || 
                          'Không tìm thấy sự kiện';
  
  if (isLoadingRegistrations || isLoadingDonations) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">
            Sự kiện: {eventDisplayName}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm bg-muted px-3 py-1 rounded-full">
            Đăng ký: <span className="font-semibold">{registrations.length}</span>
          </div>
          <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            Chờ duyệt: <span className="font-semibold">{pendingRegistrations.length}</span>
          </div>
          <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
            Đã hiến máu: <span className="font-semibold">{donations.length}</span>
          </div>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registrations">Danh sách đăng ký</TabsTrigger>
          <TabsTrigger value="donations">Danh sách hiến máu</TabsTrigger>
        </TabsList>
        
        {/* Danh sách đăng ký */}
        <TabsContent value="registrations" className="mt-6">
          <RegistrationsList 
            eventId={eventId} 
            initialRegistrations={registrations} 
          />
        </TabsContent>
        
        {/* Danh sách hiến máu */}
        <TabsContent value="donations" className="mt-6">
          <DonationsList 
            eventId={eventId} 
            initialDonations={donations} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 