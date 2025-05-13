"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function DonorNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Trang không tồn tại</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Trang bạn đang tìm kiếm không tồn tại trong khu vực người hiến máu hoặc có thể đã bị di chuyển.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" asChild>
          <Link href="/donor/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            Quay lại khu vực người hiến máu
          </Link>
        </Button>
        <Button asChild>
          <Link href="/events">
            <Home className="mr-2 h-4 w-4" />
            Xem sự kiện hiến máu
          </Link>
        </Button>
      </div>
    </div>
  );
} 