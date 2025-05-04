"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Trang không tồn tại</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">Trang chủ</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/events">Xem sự kiện</Link>
        </Button>
      </div>
    </div>
  );
} 