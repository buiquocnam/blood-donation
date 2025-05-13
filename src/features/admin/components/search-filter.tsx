'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { VAITRO } from '@/types';
import { Search, FilterX } from 'lucide-react';

interface SearchFilterProps {
  roles?: VAITRO[];
  showRoleFilter?: boolean;
  showStatusFilter?: boolean;
  onFilterChange: (filters: { role?: string; status?: boolean; searchTerm?: string }) => void;
}

/**
 * Component cung cấp chức năng tìm kiếm và lọc
 */
export function SearchFilter({
  roles = [],
  showRoleFilter = true,
  showStatusFilter = true,
  onFilterChange
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term để tránh gọi lại filter quá nhiều
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Áp dụng filter khi các giá trị thay đổi
  useEffect(() => {
    const filters: { role?: string; status?: boolean; searchTerm?: string } = {};
    
    if (selectedRole && selectedRole !== 'all') {
      filters.role = selectedRole;
    }
    
    if (selectedStatus) {
      if (selectedStatus === 'active') {
        filters.status = true;
      } else if (selectedStatus === 'inactive') {
        filters.status = false;
      }
    }
    
    if (debouncedSearchTerm) {
      filters.searchTerm = debouncedSearchTerm;
    }
    
    onFilterChange(filters);
  }, [debouncedSearchTerm, selectedRole, selectedStatus, onFilterChange]);

  // Reset tất cả filter
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole(null);
    setSelectedStatus(null);
    onFilterChange({});
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {showRoleFilter && (
        <Select
          value={selectedRole || undefined}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.MaVaiTro} value={role.MaVaiTro}>
                {role.TenVaiTro}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {showStatusFilter && (
        <Select
          value={selectedStatus || undefined}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Bị khóa</SelectItem>
          </SelectContent>
        </Select>
      )}
      
      <Button 
        variant="outline" 
        onClick={handleResetFilters}
        className="flex gap-2 items-center"
      >
        <FilterX className="h-4 w-4" />
        Xóa bộ lọc
      </Button>
    </div>
  );
} 