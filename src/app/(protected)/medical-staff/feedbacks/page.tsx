import { Metadata } from 'next';
import { MedicalStaffService } from '@/features/medical-staff/services';
import { FeedbacksList } from '@/features/medical-staff/components/feedbacks';
import { PhanHoiWithUserInfo } from '@/features/medical-staff/types';

export const metadata: Metadata = {
  title: 'Quản lý phản hồi - Nhân viên y tế',
  description: 'Quản lý phản hồi của người hiến máu',
};

/**
 * Lọc phản hồi dựa trên từ khóa tìm kiếm
 */
function filterFeedbacks(feedbacks: PhanHoiWithUserInfo[], searchTerm: string): PhanHoiWithUserInfo[] {
  if (!searchTerm.trim()) return feedbacks;
  
  return feedbacks.filter((feedback) => {
    return feedback.MaPhanHoi.toLowerCase().includes(searchTerm.toLowerCase()) ||
           feedback.MaDKiKienMau.toLowerCase().includes(searchTerm.toLowerCase()) ||
           feedback.NguoiHienMau?.HoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           feedback.TinhTrangMoTa.toLowerCase().includes(searchTerm.toLowerCase());
  });
}

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

/**
 * Trang quản lý phản hồi của người hiến máu
 * Tuân thủ nguyên tắc FFMA: lấy dữ liệu ở cấp trang (Page-level) và 
 * tách biệt giữa logic lấy dữ liệu và giao diện
 */
export default async function FeedbacksPage({ searchParams }: PageProps) {
  // Lấy dữ liệu phản hồi từ server-side theo nguyên tắc FFMA
  const allFeedbacks = await MedicalStaffService.getFeedbacks();
  
  // Await searchParams trước khi sử dụng
  const params = await searchParams;
  
  // Lọc phản hồi dựa trên query param (nếu có)
  const searchTerm = params.q || '';
  const filteredFeedbacks = filterFeedbacks(allFeedbacks, searchTerm);
  
  return (
    <div className="border border-border rounded-md p-6 shadow-sm bg-card">
      <FeedbacksList feedbacks={filteredFeedbacks} />
    </div>
  );
} 