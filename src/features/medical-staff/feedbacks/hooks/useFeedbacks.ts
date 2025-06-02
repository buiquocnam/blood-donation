import { useState, useEffect } from 'react';
import { FeedbackResponse, TrangThaiFeedback } from '../types';
import { feedbackService } from '../services/feedbackService';
import { toast } from 'sonner';

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const data = await feedbackService.getFeedbacks();
      setFeedbacks(data);
      setError(null);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: TrangThaiFeedback) => {
    try {
      await feedbackService.updateStatus(id, status);
      setFeedbacks(feedbacks.map(feedback => 
        feedback.MaFeedback === id ? { ...feedback, TrangThai: status } : feedback
      ));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const replyToFeedback = async (id: string, reply: string) => {
    try {
      await feedbackService.reply(id, reply);
      setFeedbacks(feedbacks.map(feedback => 
        feedback.MaFeedback === id ? { ...feedback, TraLoi: reply } : feedback
      ));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    feedbacks,
    isLoading,
    error,
    updateFeedbackStatus,
    replyToFeedback
  };
} 