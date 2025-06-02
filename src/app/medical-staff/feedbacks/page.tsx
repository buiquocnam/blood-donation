import { Metadata } from 'next';
import { FeedbacksContainer } from '@/features/medical-staff/feedbacks/containers/FeedbacksContainer';

export const metadata: Metadata = {
  title: 'Quản lý phản hồi | Blood Donation',
  description: 'Quản lý và xem các phản hồi từ người dùng',
};

export default function FeedbacksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý phản hồi</h1>
        <p className="text-muted-foreground">
          Xem và phản hồi các ý kiến từ người dùng
        </p>
      </div>
      <FeedbacksContainer />
    </div>
  );
} 