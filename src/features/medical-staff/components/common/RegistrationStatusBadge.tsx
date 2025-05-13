import { Badge } from '@/components/ui/badge';
import { TrangThaiDangKy } from '@/types';

interface RegistrationStatusBadgeProps {
  status: string;
}

/**
 * Component hiển thị trạng thái đơn đăng ký dưới dạng badge
 */
export function RegistrationStatusBadge({ status }: RegistrationStatusBadgeProps) {
  switch (status) {
    case TrangThaiDangKy.CHO_DUYET:
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Chờ duyệt
        </Badge>
      );
    case TrangThaiDangKy.DA_DUYET:
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Đã duyệt
        </Badge>
      );
    case TrangThaiDangKy.TU_CHOI:
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