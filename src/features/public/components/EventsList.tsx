"use client"

import { useState } from "react";
import { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien } from "@/types";
import { EventCard } from "./EventCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Calendar, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventsListProps {
  events: DANGKITOCHUCHIENMAU_WithRelations[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onFilterStatus?: (status: TrangThaiSuKien | null) => void;
}

export function EventsList({ events = [], isLoading, onSearch, onFilterStatus }: EventsListProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [localFilter, setLocalFilter] = useState<string>("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Đảm bảo events luôn là một mảng
  const safeEvents = Array.isArray(events) ? events : [];

  // Xử lý tìm kiếm local nếu không có onSearch
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearch(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Xử lý lọc local nếu không có onFilterStatus
  const handleFilter = (value: string) => {
    setLocalFilter(value);
    if (onFilterStatus) {
      if (value === "all") {
        onFilterStatus(null);
      } else {
        onFilterStatus(value as TrangThaiSuKien);
      }
    }
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
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Lọc sự kiện local nếu không có onFilterStatus và onSearch
  const filteredEvents = !onFilterStatus || !onSearch
    ? safeEvents.filter(event => {
        const matchesSearch = !localSearch || 
          (event.ThongBao?.TieuDe?.toLowerCase() || "").includes(localSearch.toLowerCase()) ||
          (event.CoSoTinhNguyen?.TenCoSoTinhNguyen?.toLowerCase() || "").includes(localSearch.toLowerCase()) ||
          (event.CoSoTinhNguyen?.DiaChi?.toLowerCase() || "").includes(localSearch.toLowerCase());
        
        const matchesFilter = localFilter === "all" || event.TrangThaiSuKien === localFilter;
        
        return matchesSearch && matchesFilter;
      })
    : safeEvents;

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Đang tải danh sách sự kiện...</p>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card shadow-sm rounded-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Tìm kiếm sự kiện</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Filter className="h-4 w-4" />
            {isSearchExpanded ? "Thu gọn" : "Mở rộng"}
          </Button>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm theo tên sự kiện, địa điểm..." 
              className="pl-9"
              value={localSearch}
              onChange={handleSearch}
            />
        </div>

          <AnimatePresence>
            {isSearchExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2">
          <Label htmlFor="filter" className="mb-1.5 block">Trạng thái</Label>
                  <Select 
            value={localFilter}
                    onValueChange={handleFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value={TrangThaiSuKien.SAP_DIEN_RA}>Sắp diễn ra</SelectItem>
                      <SelectItem value={TrangThaiSuKien.DANG_DIEN_RA}>Đang diễn ra</SelectItem>
                      <SelectItem value={TrangThaiSuKien.DA_HOAN_THANH}>Đã hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {localFilter !== "all" && (
          <div className="mt-4 flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Đang lọc:</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {localFilter === TrangThaiSuKien.SAP_DIEN_RA && "Sắp diễn ra"}
              {localFilter === TrangThaiSuKien.DANG_DIEN_RA && "Đang diễn ra"}
              {localFilter === TrangThaiSuKien.DA_HOAN_THANH && "Đã hoàn thành"}
              <button 
                className="ml-1 h-3 w-3 rounded-full text-primary hover:bg-primary/20"
                onClick={() => handleFilter("all")}
              >
                ×
              </button>
            </Badge>
      </div>
        )}
      </motion.div>

      {filteredEvents.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 text-center bg-card shadow-sm rounded-lg"
        >
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Không tìm thấy sự kiện nào</h3>
          <p className="text-muted-foreground mb-6">
            Không có sự kiện nào phù hợp với tiêu chí tìm kiếm.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setLocalSearch("");
              setLocalFilter("all");
              if (onSearch) onSearch("");
              if (onFilterStatus) onFilterStatus(null);
            }}
          >
            Xóa bộ lọc
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6"
        >
          {filteredEvents.map((event, index) => (
            <motion.div key={event.IdSuKien || `event-${index}`} variants={item}>
              <EventCard event={event}  />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 