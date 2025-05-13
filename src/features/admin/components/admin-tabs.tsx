'use client';

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { AdminTabType } from '../types';
import { UsersPanel } from './users-panel';
import { VolunteerCentersPanel } from './volunteer-centers-panel';
import { DashboardStats } from './dashboard-stats';
import { useAdminTabs } from '../hooks';

/**
 * Component quản lý các tab trong trang Admin
 */
export function AdminTabs() {
  const { activeTab, handleTabChange } = useAdminTabs();

  return (
    <div className="space-y-6">
      <DashboardStats />
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => handleTabChange(value as AdminTabType)}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="volunteer">Cơ sở tình nguyện</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UsersPanel />
        </TabsContent>
        
        <TabsContent value="volunteer" className="space-y-4">
          <VolunteerCentersPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
} 