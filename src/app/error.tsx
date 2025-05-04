"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ghi log lỗi vào console hoặc dịch vụ theo dõi lỗi
    console.error("Lỗi ứng dụng:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h1>
      <p className="text-gray-600 mb-2 max-w-md">
        Đã có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn.
      </p>
      <p className="text-gray-600 mb-8 max-w-md">
        Vui lòng thử lại hoặc liên hệ với quản trị viên nếu lỗi vẫn tiếp tục.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} variant="default">
          Thử lại
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Trang chủ</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-4 text-xs text-gray-400">
          Mã lỗi: {error.digest}
        </p>
      )}
    </div>
  );
} 