'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VolunteerCenterTabs as TabTypes } from '../types';
import { AnnouncementsList } from './AnnouncementsList';
import { EventRegistrationsList } from './EventRegistrationsList';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface VolunteerCenterTabsProps {
  centerId: string;
}

export function VolunteerCenterTabs({ centerId }: VolunteerCenterTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get the active tab from URL or default to announcements
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get('tab') || TabTypes.ANNOUNCEMENTS
  );

  // Update the URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Update active tab if URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && Object.values(TabTypes).includes(tab as TabTypes)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value={TabTypes.ANNOUNCEMENTS}>Thông báo hiến máu</TabsTrigger>
        <TabsTrigger value={TabTypes.EVENT_REGISTRATIONS}>Lịch sử đăng ký</TabsTrigger>
      </TabsList>
      
      <TabsContent value={TabTypes.ANNOUNCEMENTS} className="mt-6">
        <AnnouncementsList centerId={centerId} />
      </TabsContent>
      
      <TabsContent value={TabTypes.EVENT_REGISTRATIONS} className="mt-6">
        <EventRegistrationsList centerId={centerId} />
      </TabsContent>
    </Tabs>
  );
} 