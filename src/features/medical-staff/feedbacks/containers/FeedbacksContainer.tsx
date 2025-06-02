'use client';

import { FeedbackList } from '../components/FeedbackList';
import { useFeedbacks } from '../hooks/useFeedbacks';

export function FeedbacksContainer() {
  const {
    feedbacks,
    isLoading,
    error,
    updateFeedbackStatus,
    replyToFeedback
  } = useFeedbacks();

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
    <FeedbackList
      feedbacks={feedbacks}
      onStatusChange={updateFeedbackStatus}
      onReply={replyToFeedback}
    />
  );
} 