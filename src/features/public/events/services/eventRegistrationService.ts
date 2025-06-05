import { apiClient } from '@/shared/services/api/client';
import axios from 'axios';

export interface EventRegistrationData {
  eventId: string;
  userId: string;
  bloodType?: string;
  weight?: number;
  height?: number;
  healthNote?: string;
}

export const eventRegistrationService = {
    // Đăng ký tham gia sự kiện
  async register(data: EventRegistrationData) {
    const response = await apiClient.post(`/events/${data.eventId}/register`, data);
    return response;
  },

  // Hủy đăng ký tham gia sự kiện
  async cancelRegistration(eventId: string) {
    const response = await apiClient.delete(`/events/${eventId}/register`);
    return response;
  },
}; 