'use client';

import { useRouter } from 'next/navigation';
import { EventRegistrationForm } from '../components/EventRegistrationForm';
import { useEventRegistration } from '../hooks/useEventRegistration';
import { useEvent } from '@/shared/hooks/useEvents';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EventRegistrationFormData } from '../types';
import { NGUOIDUNG } from '@/types';

interface EventRegistrationContainerProps {
  eventId: string;
}

export function EventRegistrationContainer({ eventId }: EventRegistrationContainerProps) {
  const router = useRouter();
  const { event, isLoading: isLoadingEvent } = useEvent(eventId);
  const { register, isRegistering } = useEventRegistration(eventId);
  const { isAuthenticated, user } = useAuthStore();

  if (isLoadingEvent) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Không tìm thấy sự kiện này
          <Button 
            variant="link" 
            className="pl-2"
            onClick={() => router.push('/events')}
          >
            Quay lại danh sách sự kiện
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAuthenticated || !user || !(user as NGUOIDUNG).MaNguoiDung) {
    router.push(`/auth/login?redirect=/events/${eventId}/register`);
    return null;
  }

  const handleSubmit = (data: EventRegistrationFormData) => {
    register({
      ...data,
      userId: (user as NGUOIDUNG).MaNguoiDung
    });
  };

  return (
    <div className=" mx-auto">
      <EventRegistrationForm
        event={event}
        onSubmit={handleSubmit}
        isSubmitting={isRegistering}
      />
    </div>
  );
} 