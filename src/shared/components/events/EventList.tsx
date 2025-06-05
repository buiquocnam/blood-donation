'use client';

import { EventCard } from './EventCard';
import { Loader2 } from 'lucide-react';
import { DANGKITOCHUCHIENMAU_RESPONSE, TrangThaiSuKien } from '@/types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

export interface EventListProps {
  events?: DANGKITOCHUCHIENMAU_RESPONSE[];
  isLoading?: boolean;
  // Filter props
  status?: string;
  onStatusChange?: (value: string) => void;
  // Pagination props
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function EventList({ 
  events = [], 
  isLoading,
  status = 'ALL',
  onStatusChange,
  page = 1,
  totalPages = 1,
  onPageChange,
}: EventListProps) {
  const showFilters = typeof onStatusChange === 'function';
  const showPagination = typeof onPageChange === 'function' && totalPages > 1;

  return (
    <div className="space-y-8">
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value={TrangThaiSuKien.DANG_DIEN_RA}>Đang diễn ra</SelectItem>
                <SelectItem value={TrangThaiSuKien.SAP_DIEN_RA}>Sắp diễn ra</SelectItem>
                <SelectItem value={TrangThaiSuKien.DA_HOAN_THANH}>Đã hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Events List */}
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !events.length ? (
        <div className="text-center py-8 text-muted-foreground">
          Không có sự kiện nào
        </div>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {events.map((event) => (
            <EventCard 
              key={event.IdSuKien} 
              event={event}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showLimitChanger={false}
          className="justify-center"
        />
      )}
    </div>
  );
} 