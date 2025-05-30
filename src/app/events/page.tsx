import { eventsService } from "@/features/public/services/eventsService";
import { EventsClientContainer } from "./client";
import { Metadata } from "next";

interface EventsPageProps {
  searchParams: Promise<{ page?: string; limit?: string; search?: string; status?: string }>
}

export const metadata: Metadata = {
  title: "Sự kiện hiến máu",
  description: "Danh sách các sự kiện hiến máu. Hãy tham gia và góp phần cứu sống những người cần máu."
};

export default async function EventsPage({
  searchParams,
}: EventsPageProps) {
  // Lấy tham số từ URL (đảm bảo đúng kiểu dữ liệu)
  const { page, limit, search, status } = await searchParams;
  
  // Lấy dữ liệu sự kiện từ server
  let eventsData;
  
  try {
    if (search) {
      eventsData = await eventsService.searchEvents(search, page ? parseInt(page, 10) : undefined, limit ? parseInt(limit, 10) : undefined  );
    } else if (status) {
      eventsData = await eventsService.getEventsByStatus(status as any, page ? parseInt(page, 10) : undefined, limit ? parseInt(limit, 10) : undefined);
    } else {
      eventsData = await eventsService.getPublicEvents(page ? parseInt(page, 10) : undefined, limit ? parseInt(limit, 10) : undefined);
    }
    console.log("eventsData", eventsData);
    console.log("eventsData.data", eventsData.data);
    console.log("eventsData.pagination", eventsData.pagination);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sự kiện:", error);
    eventsData = { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10, hasNext: false, hasPrevious: false } };
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Sự kiện hiến máu
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dưới đây là danh sách các sự kiện hiến máu. Hãy tham gia và góp phần cứu sống những người cần máu.
            </p>
          </div>

          <EventsClientContainer 
            initialEvents={eventsData.data} 
            initialPagination={eventsData.pagination} 
            initialSearch={search}
            initialStatus={status}
          />
        </div>
      </div>
    </div>
  );
}