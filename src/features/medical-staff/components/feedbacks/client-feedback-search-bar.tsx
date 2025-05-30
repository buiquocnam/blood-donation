"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

/**
 * Component thanh tìm kiếm phản hồi của nhân viên y tế
 * Lưu kết quả tìm kiếm vào URL để có thể chia sẻ hoặc tải lại trang
 */
export function ClientFeedbackSearchBar({ searchQuery = "" }: { searchQuery?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchQuery);
  const debouncedValue = useDebounce(value, 500);

  // Cập nhật URL khi người dùng nhập từ khóa tìm kiếm
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Cập nhật URL khi giá trị debounced thay đổi
  useEffect(() => {
    router.push(`${pathname}?${createQueryString("q", debouncedValue)}`);
  }, [debouncedValue, pathname, router, createQueryString]);

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString("q", value)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm theo mã phản hồi, mã đăng ký, tên người hiến máu..."
        className="pl-8 pr-12"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button 
        type="submit" 
        size="sm"
        variant="ghost"
        className="absolute right-0 top-0 h-9 rounded-l-none"
      >
        Tìm
      </Button>
    </form>
  );
} 