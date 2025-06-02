'use client';

import { useEffect } from 'react';
import { FeedbackList } from '../components/FeedbackList';
import { useFeedbacks } from '../hooks/useFeedbacks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const FeedbackListContainer = () => {
  const {
    feedbacks,
    isLoading,
    error,
    fetchFeedbacks,
    replyToFeedback
  } = useFeedbacks();

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Có lỗi xảy ra khi tải dữ liệu
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phản hồi từ người dùng</CardTitle>
      </CardHeader>
      <CardContent>
        <FeedbackList
          feedbacks={feedbacks}
          onReplySubmit={replyToFeedback}
        />
      </CardContent>
    </Card>
  );
}; 