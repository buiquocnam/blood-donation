'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchFilter } from './search-filter';
import { VolunteersTable } from './volunteers-table';
import { useAdminVolunteers } from '../hooks';
import { COSOTINHNGUYEN_WithLocation } from '@/types';

interface VolunteerCentersPanelProps {
  initialVolunteerCenters: COSOTINHNGUYEN_WithLocation[];
}

/**
 * Panel quản lý cơ sở tình nguyện
 */
export function VolunteerCentersPanel({ initialVolunteerCenters }: VolunteerCentersPanelProps) {
  const {
    volunteerCenters,
    isLoading,
    filter,
    setFilter,
    updateStatus,
    deleteCenter
  } = useAdminVolunteers(initialVolunteerCenters);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý cơ sở tình nguyện</CardTitle>
        <CardDescription>
          Quản lý thông tin cơ sở tình nguyện trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchFilter
          showRoleFilter={false}
          onFilterChange={setFilter}
        />
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <VolunteersTable
            volunteerCenters={volunteerCenters}
            onUpdateStatus={updateStatus}
            onDeleteCenter={deleteCenter}
          />
        )}
      </CardContent>
    </Card>
  );
} 