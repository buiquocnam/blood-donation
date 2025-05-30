'use client';

import { Input } from '@/components/ui/input';
import { AnnouncementCard } from './AnnouncementCard';
import { VolunteerFilterOptions } from '../types';
import { useRegisterForEvent } from '../hooks';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RegisterEventForm } from './RegisterEventForm';
import { THONGBAODKTOCHUC } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

interface AnnouncementsListProps {
  centerId: string;
  initialAnnouncements: THONGBAODKTOCHUC[];
}

export function AnnouncementsList({ centerId, initialAnnouncements }: AnnouncementsListProps) {
  const [announcements, setAnnouncements] = useState<THONGBAODKTOCHUC[]>(initialAnnouncements);
  const [filters, setFilters] = useState<VolunteerFilterOptions>({
    searchTerm: '',
    dateRange: {
      from: null,
      to: null,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const { mutate: registerForEvent, isPending } = useRegisterForEvent();
  const queryClient = useQueryClient();
  
  // Apply filters to announcements
  useEffect(() => {
    // Only apply client-side filtering without network requests
    const filteredAnnouncements = initialAnnouncements.filter((announcement) => {
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

    setAnnouncements(filteredAnnouncements);
  }, [filters, initialAnnouncements]);

  // Handler for search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };

  // Handler for register button click
  const handleRegisterClick = (announcementId: string) => {
    setSelectedAnnouncementId(announcementId);
  };

  // Get the selected announcement for the form
  const selectedAnnouncement = announcements.find(a => a.IdThongBaoDK === selectedAnnouncementId);

  // Handler for form submission
  const handleRegisterSubmit = (values: { soLuongDK: number }) => {
    if (selectedAnnouncementId) {
      registerForEvent({
        centerId,
        eventId: selectedAnnouncementId,
        data: values
      }, {
        onSuccess: () => {
          // Close the dialog on success
          setSelectedAnnouncementId(null);
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['eventRegistrations', centerId] });
          queryClient.invalidateQueries({ queryKey: ['announcements'] });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Tìm kiếm thông báo..."
          className="w-full md:w-1/3"
          value={filters.searchTerm}
          onChange={handleSearch}
        />
        <div className="text-sm text-muted-foreground md:w-1/3">
          Tính năng lọc theo ngày đang được cập nhật
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[300px] w-full" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex justify-center p-8 text-center">
          <p className="text-muted-foreground">Không tìm thấy thông báo nào phù hợp với tiêu chí tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.IdThongBaoDK}
              announcement={announcement}
              onRegister={handleRegisterClick}
            />
          ))}
        </div>
      )}

      {/* Register Event Dialog */}
      <Dialog 
        open={!!selectedAnnouncementId} 
        onOpenChange={(open) => !open && setSelectedAnnouncementId(null)}
      >
        {selectedAnnouncement && (
          <DialogContent className="sm:max-w-[500px]">
            <RegisterEventForm
              announcement={selectedAnnouncement}
              onSubmit={handleRegisterSubmit}
              isLoading={isPending}
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
} 