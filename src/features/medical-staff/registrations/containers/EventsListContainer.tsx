'use client';

import { EventsList } from '@/components/event/EventsList';
import { useEvents } from '@/shared/hooks/useEvents';
import { EventsListContainerProps } from '../../feedbacks/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { DANGKITOCHUCHIENMAU_WithRelations } from '@/types';

export const EventsListContainer = ({ onEventSelect }: EventsListContainerProps) => {
  const {
    events,
    isLoading,
    error,
    pagination,
    setSearchQuery,
    setStatusFilter,
    goToPage,
    changeLimit
  } = useEvents();

  if (error) {
    return (
      <div className="text-center text-destructive">
        Có lỗi xảy ra khi tải dữ liệu
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Danh sách sự kiện hiến máu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        <EventsList
          events={events as DANGKITOCHUCHIENMAU_WithRelations[]}
          isLoading={isLoading}
          onSearch={setSearchQuery}
          onFilterStatus={(status) => setStatusFilter(status || undefined)}
          role="staff"
        />

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={goToPage}
            showLimitChanger
            perPage={pagination.perPage}
            onLimitChange={changeLimit}
          />
        )}
      </CardContent>
    </Card>
  );
}; 