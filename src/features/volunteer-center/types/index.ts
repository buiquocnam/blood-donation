import { COSOTINHNGUYEN, THONGBAODKTOCHUC, DANGKITOCHUCHIENMAU } from '../../../types';
import { TrangThaiDangKy, TrangThaiSuKien } from '../../../types/common';

// Filter options for volunteer center dashboard
export interface VolunteerFilterOptions {
  searchTerm?: string;
  status?: boolean | null;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
}

// Filter options for event registrations
export interface EventRegistrationFilterOptions {
  searchTerm?: string;
  status?: TrangThaiDangKy | null;
  eventStatus?: TrangThaiSuKien | null;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
}

// Tab types for volunteer center dashboard
export enum VolunteerCenterTabs {
  ANNOUNCEMENTS = 'announcements',
  EVENT_REGISTRATIONS = 'event-registrations',
} 