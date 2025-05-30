"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventsList } from "@/features/public/components";
import { Pagination } from "@/components/ui/pagination";
import { TrangThaiSuKien } from "@/types";
import { DANGKITOCHUCHIENMAU_WithRelations } from "@/types";
import { motion } from "framer-motion";
import { PaginatedResponse } from "@/features/public/services/eventsService";

interface EventsClientContainerProps {
  initialEvents: DANGKITOCHUCHIENMAU_WithRelations[];
  initialPagination: PaginatedResponse<DANGKITOCHUCHIENMAU_WithRelations>["pagination"];
  initialSearch?: string;
  initialStatus?: string | null;
}

export function EventsClientContainer({
  initialEvents,
  initialPagination,
  initialSearch = "",
  initialStatus = null
}: EventsClientContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [events, setEvents] = useState<DANGKITOCHUCHIENMAU_WithRelations[]>(initialEvents || []);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [statusFilter, setStatusFilter] = useState<TrangThaiSuKien | null>(
    initialStatus ? (initialStatus as TrangThaiSuKien) : null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Đảm bảo cập nhật state khi props thay đổi
  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents);
    }
    if (initialPagination) {
      setPagination(initialPagination);
    }
  }, [initialEvents, initialPagination]);

  // Cập nhật URL khi thay đổi tham số
  const updateUrl = (newParams: { page?: number; limit?: number; search?: string; status?: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Cập nhật các tham số
    if (newParams.page) params.set("page", newParams.page.toString());
    if (newParams.limit) params.set("limit", newParams.limit.toString());
    
    if (newParams.search !== undefined) {
      if (newParams.search) params.set("search", newParams.search);
      else params.delete("search");
    }
    
    if (newParams.status !== undefined) {
      if (newParams.status) params.set("status", newParams.status);
      else params.delete("status");
    }
    
    setIsLoading(true); // Bắt đầu loading
    router.push(`/events?${params.toString()}`);
  };

  // Xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateUrl({ search: query, page: 1 });
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilter = (status: TrangThaiSuKien | null) => {
    setStatusFilter(status);
    updateUrl({ status: status, page: 1 });
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    updateUrl({ page });
  };

  // Xử lý thay đổi số lượng hiển thị
  const handleLimitChange = (limit: number) => {
    updateUrl({ limit, page: 1 });
  };

  // Cập nhật trạng thái loading khi chuyển hướng hoàn tất
  useEffect(() => {
    setIsLoading(false);
  }, [events]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <EventsList 
          events={events} 
          isLoading={isLoading}
          onSearch={handleSearch}
          onFilterStatus={handleStatusFilter}
        />

        {pagination && events.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              showLimitChanger
              perPage={pagination.perPage}
              onLimitChange={handleLimitChange}
              limitOptions={[10, 20, 50]}
            />
          </div>
        )}
      </motion.div>
    </>
  );
} 