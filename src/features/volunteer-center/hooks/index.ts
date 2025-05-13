'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAnnouncements, 
  fetchAnnouncementById, 
  fetchEventRegistrations, 
  fetchVolunteerCenterById,
  registerForEvent,
  cancelEventRegistration
} from '../services';
import { useState } from 'react';
import { VolunteerFilterOptions, EventRegistrationFilterOptions } from '../types';
import { THONGBAODKTOCHUC, DANGKITOCHUCHIENMAU } from '../../../types';

// Hook to get all announcements
export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => fetchAnnouncements(),
  });
};

// Hook to get a single announcement by ID
export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => fetchAnnouncementById(id),
    enabled: !!id,
  });
};

// Hook to get event registrations for a volunteer center
export const useEventRegistrations = (centerId: string) => {
  return useQuery({
    queryKey: ['eventRegistrations', centerId],
    queryFn: () => fetchEventRegistrations(centerId),
    enabled: !!centerId,
  });
};

// Hook to get a volunteer center's information
export const useVolunteerCenter = (id: string) => {
  return useQuery({
    queryKey: ['volunteerCenter', id],
    queryFn: () => fetchVolunteerCenterById(id),
    enabled: !!id,
  });
};

// Hook to register for an event
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ centerId, eventId, data }: { 
      centerId: string; 
      eventId: string; 
      data: { soLuongDK: number } 
    }) => registerForEvent(centerId, eventId, data),
    onSuccess: (_, variables) => {
      // Invalidate related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['eventRegistrations', variables.centerId] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

// Hook to cancel an event registration
export const useCancelEventRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, centerId }: { eventId: string; centerId: string }) => 
      cancelEventRegistration(eventId),
    onSuccess: (_, variables) => {
      // Invalidate related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['eventRegistrations', variables.centerId] });
    },
  });
};

// Hook for filtering announcements
export const useFilteredAnnouncements = () => {
  const { data: announcements, isLoading } = useAnnouncements();
  const [filters, setFilters] = useState<VolunteerFilterOptions>({
    searchTerm: '',
    dateRange: {
      from: null,
      to: null,
    },
  });

  const filteredAnnouncements = announcements?.filter((announcement) => {
    // Filter by search term
    if (filters.searchTerm && !announcement.TieuDe.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange?.from) {
      const announcementDate = new Date(announcement.NgayDang);
      if (announcementDate < filters.dateRange.from) {
        return false;
      }
    }

    if (filters.dateRange?.to) {
      const announcementDate = new Date(announcement.NgayDang);
      if (announcementDate > filters.dateRange.to) {
        return false;
      }
    }

    return true;
  });

  return {
    announcements: filteredAnnouncements || [],
    isLoading,
    filters,
    setFilters,
  };
};

// Hook for filtering event registrations
export const useFilteredEventRegistrations = (centerId: string) => {
  const { data: registrations, isLoading } = useEventRegistrations(centerId);
  const [filters, setFilters] = useState<EventRegistrationFilterOptions>({
    searchTerm: '',
    status: null,
    eventStatus: null,
    dateRange: {
      from: null,
      to: null,
    },
  });

  const filteredRegistrations = registrations?.filter((registration) => {
    // Filter by status
    if (filters.status !== null && registration.TinhTrangDK !== filters.status) {
      return false;
    }

    // Filter by event status
    if (filters.eventStatus !== null && registration.TrangThaiSuKien !== filters.eventStatus) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange?.from) {
      const registrationDate = new Date(registration.NgayDangKi);
      if (registrationDate < filters.dateRange.from) {
        return false;
      }
    }

    if (filters.dateRange?.to) {
      const registrationDate = new Date(registration.NgayDangKi);
      if (registrationDate > filters.dateRange.to) {
        return false;
      }
    }

    return true;
  });

  return {
    registrations: filteredRegistrations || [],
    isLoading,
    filters,
    setFilters,
  };
}; 