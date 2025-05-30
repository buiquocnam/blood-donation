'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PhanHoiWithUserInfo } from '@/features/medical-staff/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * Client Component cho tính năng tìm kiếm phản hồi
 * Sử dụng URL Search Params để lưu trạng thái tìm kiếm
 */
export function FeedbackSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearchTerm = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm);

  // Xử lý tìm kiếm bằng cách cập nhật URL query params
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // Tạo một URLSearchParams mới từ params hiện tại
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    
    // Cập nhật URL với query mới (không làm mới trang)
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <Input
        placeholder="Tìm kiếm theo mã phản hồi, tên..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onBlur={() => handleSearch(searchTerm)}
        className="max-w-sm"
      />
    </form>
  );
} 