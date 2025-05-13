'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrangThaiPhanHoi } from '@/features/medical-staff/types';

interface FeedbackStatusBadgeProps {
  status: TrangThaiPhanHoi;
}

/**
 * Component hiển thị trạng thái phản hồi
 * @param status Trạng thái phản hồi
 * @returns Component Badge hiển thị trạng thái
 */
export function FeedbackStatusBadge({ status }: FeedbackStatusBadgeProps) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  let label = 'Không xác định';
  
  switch (status) {
    case TrangThaiPhanHoi.CHUA_XU_LY:
      variant = 'outline';
      label = 'Chưa xử lý';
      break;
    case TrangThaiPhanHoi.DANG_XU_LY:
      variant = 'secondary';
      label = 'Đang xử lý';
      break;
    case TrangThaiPhanHoi.DA_XU_LY:
      variant = 'default';
      label = 'Đã xử lý';
      break;
    default:
      break;
  }
  
  return <Badge variant={variant}>{label}</Badge>;
} 