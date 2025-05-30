"use client"

import * as React from "react";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  // Pagination limit properties
  showLimitChanger?: boolean;
  perPage?: number;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showLimitChanger = false,
  perPage = 10,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const generatePages = () => {
    // Always show first and last page
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Show all pages if less than 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push(null); // Ellipsis
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(null); // Ellipsis
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pages = generatePages();
  
  const handleLimitChange = (value: string) => {
    onLimitChange?.(parseInt(value, 10));
  };
  
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      <div className="flex items-center justify-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </Button>
        
        {pages.map((page, index) => 
          page === null ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </Button>
      </div>
      
      {showLimitChanger && onLimitChange && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Hiển thị:</span>
          <Select
            value={perPage.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue placeholder={perPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
} 