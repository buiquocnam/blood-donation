import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PhanHoiWithUserInfo } from '@/features/medical-staff/types';
import { formatDate } from '@/utils';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';
import { ClientFeedbackSearchBar } from './client-feedback-search-bar';
import { FeedbackActionButton } from './FeedbackActionButton';

interface FeedbacksListProps {
  feedbacks: PhanHoiWithUserInfo[];
  searchQuery?: string;
}

/**
 * Server Component hiển thị danh sách phản hồi của người hiến máu
 * Không có 'use client' - đây là Server Component để giảm JavaScript gửi đến client
 * Tuân thủ kiến trúc FFMA: chỉ hiển thị dữ liệu, các phần tương tác được tách ra thành Client Components
 */
export function FeedbacksList({ feedbacks, searchQuery }: FeedbacksListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-medium whitespace-nowrap">
          Phản hồi của người hiến máu ({feedbacks.length})
          {searchQuery && <span className="text-sm ml-2 text-muted-foreground">Tìm: "{searchQuery}"</span>}
        </h3>
        {/* ClientFeedbackSearchBar là Client Component riêng biệt để xử lý tìm kiếm */}
        <ClientFeedbackSearchBar />
      </div>
      
      {feedbacks.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          {searchQuery 
            ? `Không tìm thấy phản hồi phù hợp với từ khóa "${searchQuery}"`
            : "Không có phản hồi nào"}
        </div>
      ) : (
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã phản hồi</TableHead>
                <TableHead>Người hiến máu</TableHead>
                <TableHead>Mã đăng ký</TableHead>
                <TableHead>Ngày phản hồi</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback: PhanHoiWithUserInfo) => (
                <TableRow key={feedback.MaPhanHoi}>
                  <TableCell className="font-medium">
                    {feedback.MaPhanHoi}
                  </TableCell>
                  <TableCell>
                    {feedback.NguoiHienMau?.HoTen || 'Không xác định'}
                  </TableCell>
                  <TableCell>
                    {feedback.DangKyHienMau?.MaDKiHienMau}
                  </TableCell>
                  <TableCell>
                    {formatDate(feedback.NgayPhanHoi)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {feedback.TinhTrangMoTa}
                  </TableCell>
                  <TableCell>
                    <FeedbackStatusBadge status={feedback.TrangThaiXuLy} />
                  </TableCell>
                  <TableCell className="text-right">
                    {/* FeedbackActionButton là Client Component riêng biệt để xử lý tương tác */}
                    <FeedbackActionButton feedback={feedback} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 