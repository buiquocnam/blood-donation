import { EventRegistrationContainer } from '@/features/public/events/containers/EventRegistrationContainer';
import { Metadata } from 'next';

interface EventRegistrationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Đăng ký hiến máu',
  description: 'Đăng ký tham gia sự kiện hiến máu'
};

export default async function EventRegistrationPage({ params }: EventRegistrationPageProps) {
  const { id } = await params;
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <EventRegistrationContainer eventId={id} />
      </div>
    </div>
  );
} 