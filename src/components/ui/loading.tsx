"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props cho component Loading
 */
interface LoadingProps {
  /**
   * Biến thể của component loading
   * @default "spinner"
   */
  variant?: "spinner" | "dots" | "skeleton";
  
  /**
   * Kích thước của component loading
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * Class CSS bổ sung
   */
  className?: string;
  
  /**
   * Văn bản hiển thị cùng với chỉ báo loading
   */
  text?: string;
  
  /**
   * Đối với biến thể skeleton, số lượng mục hiển thị
   * @default 3
   */
  count?: number;
  
  /**
   * Đối với biến thể skeleton, chiều cao của mỗi mục
   * @default "20px"
   */
  height?: string;
}

/**
 * Component Loading để chỉ báo rằng nội dung đang được tải
 */
export function Loading({
  variant = "spinner",
  size = "md",
  className,
  text,
  count = 3,
  height = "20px"
}: LoadingProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  
  const variants = {
    skeleton: (
      <div className={cn("w-full space-y-2", className)}>
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index}
            className="animate-pulse bg-muted rounded"
            style={{ height, width: `${100 - index * 10}%` }}
          />
        ))}
      </div>
    ),
    
    spinner: (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn("animate-spin rounded-full border-t-transparent border-4 border-primary", sizes[size])} />
        {text && <span className="ml-3 text-sm font-medium">{text}</span>}
      </div>
    ),
    
    dots: (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "animate-bounce rounded-full bg-primary",
                size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
                {
                  "animation-delay-200": i === 1,
                  "animation-delay-400": i === 2,
                }
              )}
              style={{ 
                animationDelay: `${i * 150}ms`,
                animationDuration: "0.8s"
              }}
            />
          ))}
        </div>
        {text && <span className="ml-3 text-sm font-medium">{text}</span>}
      </div>
    )
  };
  
  return variants[variant];
}

/**
 * Component loading trang hiển thị phủ toàn màn hình
 */
export function PageLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <Loading variant="spinner" size="lg" />
        <p className="mt-4 text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}

/**
 * Component loading nhỏ gọn hiển thị trong nội dung
 */
export function InlineLoading({ text = "Đang tải..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <Loading variant="dots" size="sm" text={text} />
    </div>
  );
}

/**
 * Component skeleton cho card
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <div className="h-5 w-1/3 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />
        <div className="h-20 w-full rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Hàng các skeleton card
 */
export function CardRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
} 