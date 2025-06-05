import { EventsListContainer } from '@/features/medical-staff/registrations/containers/EventsListContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý sự kiện | Blood Donation',
  description: 'Quản lý và theo dõi các sự kiện hiến máu',
};

export default function EventsPage() {
  return <EventsListContainer  />;
} 