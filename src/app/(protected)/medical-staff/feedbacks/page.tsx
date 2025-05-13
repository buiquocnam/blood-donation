
import { Metadata } from 'next';
import { FeedbacksList } from '@/features/medical-staff/components';
import { BellRing } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quản lý phản hồi - Hệ thống Hiến máu',
  description: 'Quản lý phản hồi của người hiến máu',
};

export default function FeedbacksPage() {
  return (
   
      <div className="border border-border rounded-md p-6 shadow-sm bg-card">
        <FeedbacksList />
      </div>
  );
} 