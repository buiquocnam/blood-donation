"use client";

import { useDonationHistory } from "@/features/donor/hooks";
import { DonationHistoryTable } from "@/features/donor/components";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AllHistoryPage() {
  const { data: history = [], isLoading } = useDonationHistory();
  const router = useRouter();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lịch sử hiến máu</h2>
          <p className="text-muted-foreground">Xem tất cả lịch sử đăng ký và hiến máu của bạn</p>
        </div>
        <Button asChild>
          <Link href="/donor/donations/register">Đăng ký hiến máu</Link>
        </Button>
      </div>

      <div className="flex items-center space-x-4 pb-4 border-b">
        <Button 
          variant="default" 
          className="relative"
        >
          Tất cả
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => router.push("/donor/history/registrations")}
        >
          Đang đăng ký
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => router.push("/donor/history/donations")}
        >
          Đã hiến máu
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
          history={history} 
          isLoading={isLoading}
          emptyMessage="Bạn chưa có lịch sử hiến máu nào"
        />
      )}
    </div>
  );
} 