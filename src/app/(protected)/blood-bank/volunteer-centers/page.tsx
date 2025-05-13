import { Metadata } from 'next';
import { PageTitle } from '@/components/shared/page-title';
import { VolunteerCenterApprovalList } from '@/features/blood-bank';

export const metadata: Metadata = {
  title: 'Quản lý cơ sở tình nguyện',
  description: 'Phê duyệt và quản lý các cơ sở tình nguyện trong hệ thống hiến máu',
};

export default function VolunteerCentersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageTitle
        title="Quản lý cơ sở tình nguyện"
        description="Phê duyệt và quản lý các cơ sở tình nguyện trong hệ thống"
      />
      
      <VolunteerCenterApprovalList />
    </div>
  );
} 