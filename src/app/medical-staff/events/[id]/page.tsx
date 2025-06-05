import { RegistrationListContainer } from '@/features/medical-staff/registrations/containers/RegistrationListContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách đăng ký sự kiện | Blood Donation',
  description: 'Xem danh sách người đăng ký tham gia sự kiện hiến máu',
};

interface EventRegistrationsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventRegistrationsPage({ params }: EventRegistrationsPageProps) {
  const { id } = await params;
  return <RegistrationListContainer eventId={id} />;
} 