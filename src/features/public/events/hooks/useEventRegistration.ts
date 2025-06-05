import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventRegistrationService, EventRegistrationData } from '../services/eventRegistrationService';
import { toast } from 'sonner';

export const useEventRegistration = (eventId: string) => {
  const queryClient = useQueryClient();

  // Đăng ký tham gia sự kiện
  const registerMutation = useMutation({
    mutationFn: (data: Omit<EventRegistrationData, 'eventId'>) =>
      eventRegistrationService.register({ ...data, eventId }),
    onSuccess: () => {
      toast.success('Đăng ký tham gia sự kiện thành công');
      queryClient.invalidateQueries({ queryKey: ['event-registration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký sự kiện'
      );
    }
  });

  // Hủy đăng ký tham gia sự kiện
  const cancelMutation = useMutation({
    mutationFn: () => eventRegistrationService.cancelRegistration(eventId),
    onSuccess: () => {
      toast.success('Hủy đăng ký thành công');
      queryClient.invalidateQueries({ queryKey: ['event-registration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi hủy đăng ký'
      );
    }
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    cancelRegistration: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending
  };
}; 