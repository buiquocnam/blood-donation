"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LichSuHienMau } from "../types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  Search,
  X,
  Filter,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrangThaiDangKy, TrangThaiHienMau } from "@/types/common";
import { useCancelDonation, useDonationHistory } from "../hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from '@/utils';

interface DonationHistoryTableProps {
  history: LichSuHienMau[];
  isLoading?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  fixedStatusFilter?: TrangThaiHienMau | TrangThaiDangKy | "all";
}

export function DonationHistoryTable({ 
  history, 
  isLoading, 
  onRefresh, 
  emptyMessage,
  fixedStatusFilter
}: DonationHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(fixedStatusFilter || "all");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const queryClient = useQueryClient();
  
  // Reset status filter if fixedStatusFilter changes
  useEffect(() => {
    if (fixedStatusFilter) {
      setStatusFilter(fixedStatusFilter);
    }
  }, [fixedStatusFilter]);
  
  const defaultRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['donor', 'history'] });
  };

  const { mutate: cancel, isPending: isCancelling } = useCancelDonation(onRefresh || defaultRefresh);

  // Function để lọc lịch sử hiến máu
  const filteredHistory = history.filter(item => {
    // Search filter
    const matchesSearch = !searchQuery || 
      (item.SuKien?.ThongBao?.TieuDe || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.SuKien?.CoSoTinhNguyen?.TenCoSoTinhNguyen || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.MaDKiHienMau.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter !== "all") {
      // Kiểm tra xem giá trị filter có phải là một giá trị của TrangThaiDangKy hay không
      const isDangKyStatus = Object.values(TrangThaiDangKy).includes(statusFilter as TrangThaiDangKy);
      
      if (isDangKyStatus) {
        // Nếu là trạng thái đăng ký, lọc theo TrangThaiDonDK
        matchesStatus = item.TrangThaiDonDK === statusFilter;
      } else {
        // Nếu không, giả sử là trạng thái hiến máu, lọc theo TrangThaiHienMau
        matchesStatus = item.TrangThaiHienMau === statusFilter;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  // Function để hủy đăng ký hiến máu
  const handleCancel = (registrationId: string) => {
    // Confirmation before cancellation
    if (window.confirm("Bạn có chắc chắn muốn hủy đăng ký hiến máu này?")) {
      cancel(registrationId);
      toast.success("Đã gửi yêu cầu hủy đăng ký.");
    }
  };

  // Function để hiển thị badge trạng thái với màu tương ứng
  const renderStatusBadge = (item: LichSuHienMau) => {
    // Hiển thị badge cho trạng thái đơn đăng ký
    const donDK = item.TrangThaiDonDK;
    const hienMau = item.TrangThaiHienMau;

    // Ưu tiên hiển thị trạng thái hiến máu nếu đơn đã được duyệt
    if (donDK === TrangThaiDangKy.DA_DUYET) {
      switch (hienMau) {
        case TrangThaiHienMau.DA_HOAN_THANH:
          return <Badge className="bg-green-500">Đã hiến máu</Badge>;
        case TrangThaiHienMau.CHO_HIEN:
          return <Badge className="bg-blue-500">Chờ hiến máu</Badge>;
        case TrangThaiHienMau.TU_CHOI:
          return <Badge variant="destructive">Từ chối hiến máu</Badge>;
      }
    }

    // Hiển thị trạng thái đơn đăng ký
    switch (donDK) {
      case TrangThaiDangKy.CHO_DUYET:
        return <Badge className="bg-yellow-500">Chờ duyệt đơn</Badge>;
      case TrangThaiDangKy.DA_DUYET:
        return <Badge className="bg-blue-500">Đã duyệt đơn</Badge>;
      case TrangThaiDangKy.TU_CHOI:
        return <Badge variant="destructive">Từ chối đơn</Badge>;
      default:
        return <Badge variant="outline">{donDK || "Không xác định"}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {showSearchBar ? (
          <div className="relative w-full md:w-2/3">
            <Input
              placeholder="Tìm kiếm theo mã đăng ký, tên sự kiện, địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={() => setShowSearchBar(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="w-full md:w-2/3 flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowSearchBar(true)}
              className="h-10 w-10"
            >
              <Search className="h-4 w-4" />
            </Button>
            {!fixedStatusFilter && (
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value={TrangThaiDangKy.CHO_DUYET}>Chờ duyệt</SelectItem>
                  <SelectItem value={TrangThaiDangKy.DA_DUYET}>Đã duyệt</SelectItem>
                  <SelectItem value={TrangThaiDangKy.TU_CHOI}>Từ chối đăng ký</SelectItem>
                  <SelectItem value={TrangThaiHienMau.DA_HOAN_THANH}>Đã hiến máu</SelectItem>
                  <SelectItem value={TrangThaiHienMau.CHO_HIEN}>Chờ hiến máu</SelectItem>
                  <SelectItem value={TrangThaiHienMau.TU_CHOI}>Từ chối hiến máu</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">Không có dữ liệu</h3>
          <p className="text-muted-foreground">
            {emptyMessage || "Bạn chưa có đăng ký hiến máu nào hoặc không có kết quả phù hợp với bộ lọc."}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đăng ký</TableHead>
                <TableHead>Sự kiện</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.MaDKiHienMau}>
                  <TableCell className="font-medium">{item.MaDKiHienMau}</TableCell>
                  <TableCell>
                    {item.SuKien?.ThongBao?.TieuDe || "Không có thông tin"}
                    <div className="text-sm text-muted-foreground">
                      {item.SuKien?.CoSoTinhNguyen?.TenCoSoTinhNguyen || ""}
                    </div>
                  </TableCell>
                  <TableCell>{item.ngayHienFormatted || formatDate(item.NgayDangKi)}</TableCell>
                  <TableCell>{renderStatusBadge(item)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/donor/donations/${item.MaDKiHienMau}`} className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" /> Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        
                        {item.SuKien && (
                          <DropdownMenuItem asChild>
                            <Link href={`/events/${item.SuKien.IdSuKien}`} className="flex items-center">
                              <ExternalLink className="mr-2 h-4 w-4" /> Xem sự kiện
                            </Link>
                          </DropdownMenuItem>
                        )}
                        
                        {item.TrangThaiHienMau === TrangThaiHienMau.CHO_HIEN && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleCancel(item.MaDKiHienMau)}
                              disabled={isCancelling}
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" /> Hủy đăng ký
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {item.TrangThaiHienMau === TrangThaiHienMau.DA_HOAN_THANH && !item.PhanHoi?.length && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/donor/feedback/${item.MaDKiHienMau}`}>
                                <AlertTriangle className="mr-2 h-4 w-4" /> Gửi phản hồi
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 