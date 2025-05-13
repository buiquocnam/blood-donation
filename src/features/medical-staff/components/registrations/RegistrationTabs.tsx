'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRegistrationEvents } from '@/features/medical-staff/hooks';
import { RegistrationsList } from '@/features/medical-staff/components/registrations/RegistrationsList';
import { DonationsList } from '@/features/medical-staff/components/donations/DonationsList';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface RegistrationTabsProps {
  eventId: string;
}

/**
 * Tab hiển thị danh sách đăng ký và danh sách hiến máu cho sự kiện
 */
export function RegistrationTabs({ eventId }: RegistrationTabsProps) {
  const [activeTab, setActiveTab] = useState('registrations');
  const router = useRouter();
  const { events, isLoading } = useRegistrationEvents();
  
  // Tìm sự kiện hiện tại từ danh sách
  const currentEvent = events.find(event => event.IdSuKien === eventId);
  
  const handleGoBack = () => {
    router.push('/medical-staff/registrations');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">
            {isLoading ? 'Đang tải...' : 
              currentEvent ? `Sự kiện: ${currentEvent.IdSuKien}` : 'Không tìm thấy sự kiện'}
          </h2>
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
        
        <TabsContent value="registrations" className="mt-6">
          <RegistrationsList eventId={eventId} />
        </TabsContent>
        
        <TabsContent value="donations" className="mt-6">
          <DonationsList eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 