"use client";

import { useDonationHistory } from "@/features/donor/hooks";
import { DonationHistoryTable } from "@/features/donor/components";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrangThaiHienMau, TrangThaiDangKy } from "@/types/common";

export default function DonationsHistoryPage() {
  const { data: history = [], isLoading } = useDonationHistory();
  
  // Lọc để chỉ hiển thị các đơn đã được duyệt
  const donationHistory = history.filter(item => 
    item.TrangThaiDonDK === TrangThaiDangKy.DA_DUYET
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lịch sử hiến máu</h2>
          <p className="text-muted-foreground">Xem tất cả các đơn đã được duyệt</p>
        </div>
        <Button asChild>
          <Link href="/donor/donations/register">Đăng ký hiến máu</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <h3 className="mt-2 text-lg font-medium">Đang tải dữ liệu...</h3>
            <p className="text-sm text-muted-foreground mt-1">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      ) : (
        <DonationHistoryTable 
          history={donationHistory} 
          isLoading={isLoading}
          emptyMessage="Bạn chưa có đơn đăng ký nào được duyệt"
        />
      )}
    </div>
  );
} 