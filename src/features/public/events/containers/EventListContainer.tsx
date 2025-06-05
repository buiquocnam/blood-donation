'use client';

import { useState } from 'react';
import { useEvents } from '@/shared/hooks/useEvents';
import { EventList } from '@/shared/components/events/EventList';

export function EventListContainer() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [status, setStatus] = useState<string>('ALL');
  
  const { events, pagination, isLoading } = useEvents(page, perPage, {
    status: status === 'ALL' ? undefined : status
  });

  return (
    <EventList 
      events={events}
      isLoading={isLoading}
      // Filter props
      status={status}
      onStatusChange={setStatus}
      // Pagination props
      page={page}
      totalPages={pagination?.totalPages}
      onPageChange={setPage}
    />
  );
} 