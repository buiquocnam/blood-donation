"use client"

import { useState } from "react";
import { usePublicEvents } from "@/features/public/hooks";
import { EventsList } from "@/features/public/components";
import { TrangThaiSuKien } from "@/types";
import { motion } from "framer-motion";
import { Droplet, Heart, Users, Calendar } from "lucide-react";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TrangThaiSuKien | null>(null);

  const { 
    filteredEvents, 
    isEventsLoading,
    setSearchQuery: setApiSearchQuery,
    setStatusFilter: setApiStatusFilter
  } = usePublicEvents();

  // Xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setApiSearchQuery(query);
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilter = (status: TrangThaiSuKien | null) => {
    setStatusFilter(status);
    setApiStatusFilter(status);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Sự kiện hiến máu
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dưới đây là danh sách các sự kiện hiến máu. Hãy tham gia và góp phần cứu sống những người cần máu.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <EventsList 
              events={filteredEvents || []} 
              isLoading={isEventsLoading}
              onSearch={handleSearch}
              onFilterStatus={handleStatusFilter}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}