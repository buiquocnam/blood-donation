'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import { UpdateFeedbackStatusDialog } from './UpdateFeedbackStatusDialog';
import { PHANHOI } from '@/types/events';

interface FeedbackActionButtonProps {
  feedback: PHANHOI;
}

/**
 * Client Component hiển thị nút cập nhật trạng thái phản hồi
 * Tuân thủ kiến trúc FFMA: là client component chịu trách nhiệm xử lý tương tác
 * và mở dialog cập nhật trạng thái
 */
export function FeedbackActionButton({ feedback }: FeedbackActionButtonProps) {
  return (
    <UpdateFeedbackStatusDialog feedback={feedback}>
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8"
        title="Cập nhật trạng thái"
      >
        <EditIcon className="h-4 w-4" />
      </Button>
    </UpdateFeedbackStatusDialog>
  );
} 