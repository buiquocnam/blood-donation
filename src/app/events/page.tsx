import { EventListContainer } from '@/features/public/events/containers/EventListContainer';
import { Metadata } from "next";
import { CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Sự kiện hiến máu",
  description: "Danh sách các sự kiện hiến máu. Hãy tham gia và góp phần cứu sống những người cần máu."
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-12">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Sự kiện hiến máu</h1>
            <p className="text-xl text-muted-foreground">
              Tham gia các sự kiện hiến máu và góp phần cứu sống những người cần máu
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              Đang diễn ra
              <span className="flex h-2 w-2 rounded-full bg-yellow-400"></span>
              Sắp diễn ra
              <span className="flex h-2 w-2 rounded-full bg-gray-400"></span>
              Đã kết thúc
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 h-[40rem] w-[80rem] -translate-x-[50%] opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
            </div>
          </div>
        </div>
      </div>

      {/* Events List Section */}
      <div className="container py-12">
        <EventListContainer />
      </div>
    </div>
  );
}