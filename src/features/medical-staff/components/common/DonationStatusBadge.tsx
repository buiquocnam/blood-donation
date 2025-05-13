import { Badge } from '@/components/ui/badge';
import { TrangThaiHienMau } from '@/types';

interface DonationStatusBadgeProps {
  status: string;
}

/**
 * Component hiển thị trạng thái hiến máu dưới dạng badge
 */
export function DonationStatusBadge({ status }: DonationStatusBadgeProps) {
  switch (status) {
    case TrangThaiHienMau.CHO_HIEN:
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Chờ hiến
        </Badge>
      );
    case TrangThaiHienMau.DA_HOAN_THANH:
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Đã hiến
        </Badge>
      );
    case TrangThaiHienMau.TU_CHOI:
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Từ chối
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          {status}
        </Badge>
      );
  }
} 