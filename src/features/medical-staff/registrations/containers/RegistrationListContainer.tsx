'use client';

import { RegistrationList } from '../components/RegistrationList';
import { useRegistrations } from '../hooks/useRegistrations';
import { Loader2 } from 'lucide-react';
import { DANGKIHIENMAU_WithRelations } from '@/types';
export const RegistrationListContainer = ({ eventId }: { eventId: string }) => {
  const { 
    registrations,
    isLoading,
    error,
    updateStatus,
    updateBloodDonationStatus,
    isUpdating
  } = useRegistrations({
    filters: {
      eventId: eventId
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Có lỗi xảy ra khi tải dữ liệu
      </div>
    );
  }

  return (
    <RegistrationList
      registrations={registrations}
      isLoading={isLoading}
      onStatusChange={updateStatus}
      onBloodDonationStatusChange={updateBloodDonationStatus}
    />
  );
}; 