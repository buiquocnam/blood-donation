import axios from '@/lib/axios';
import { FeedbackResponse, TrangThaiFeedback } from '../types';

// Mock data
const mockFeedbacks: FeedbackResponse[] = [
  {
    MaFeedback: '1',
    NoiDung: 'Tôi rất hài lòng với dịch vụ hiến máu. Nhân viên rất nhiệt tình và chuyên nghiệp.',
    ThoiGian: '2024-03-15T08:00:00Z',
    TrangThai: TrangThaiFeedback.DA_XU_LY,
    TraLoi: 'Cảm ơn bạn đã đánh giá tích cực. Chúng tôi sẽ tiếp tục cải thiện dịch vụ.',
    NGUOIDUNG: {
      HoTen: 'Nguyễn Văn A',
      Email: 'nguyenvana@example.com',
      SDT: '0901234567',
    }
  },
  {
    MaFeedback: '2',
    NoiDung: 'Tôi muốn đóng góp ý kiến về việc cải thiện quy trình đăng ký hiến máu trực tuyến.',
    ThoiGian: '2024-03-16T09:30:00Z',
    TrangThai: TrangThaiFeedback.CHO_XU_LY,
    NGUOIDUNG: {
      HoTen: 'Trần Thị B',
      Email: 'tranthib@example.com',
      SDT: '0909876543',
    }
  },
  {
    MaFeedback: '3',
    NoiDung: 'Cần bổ sung thêm địa điểm hiến máu ở khu vực quận 9.',
    ThoiGian: '2024-03-16T14:20:00Z',
    TrangThai: TrangThaiFeedback.CHO_XU_LY,
    NGUOIDUNG: {
      HoTen: 'Lê Văn C',
      Email: 'levanc@example.com',
      SDT: '0905555666',
    }
  },
  {
    MaFeedback: '4',
    NoiDung: 'Đề xuất tổ chức thêm các buổi tư vấn về hiến máu định kỳ.',
    ThoiGian: '2024-03-14T10:15:00Z',
    TrangThai: TrangThaiFeedback.DA_XU_LY,
    TraLoi: 'Cảm ơn đề xuất của bạn. Chúng tôi sẽ xem xét tổ chức trong thời gian tới.',
    NGUOIDUNG: {
      HoTen: 'Phạm Thị D',
      Email: 'phamthid@example.com',
      SDT: '0907777888',
    }
  },
  {
    MaFeedback: '5',
    NoiDung: 'Website thỉnh thoảng bị lỗi khi đăng ký hiến máu.',
    ThoiGian: '2024-03-17T11:45:00Z',
    TrangThai: TrangThaiFeedback.CHO_XU_LY,
    NGUOIDUNG: {
      HoTen: 'Hoàng Văn E',
      Email: 'hoangvane@example.com',
      SDT: '0903333444',
    }
  }
];

class FeedbackService {
  // Giả lập delay của API
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getFeedbacks(): Promise<FeedbackResponse[]> {
    // Giả lập delay 1s
    await this.delay(1000);
    return mockFeedbacks;
  }

  async updateStatus(id: string, status: TrangThaiFeedback): Promise<void> {
    await this.delay(500);
    const feedbackIndex = mockFeedbacks.findIndex(f => f.MaFeedback === id);
    if (feedbackIndex !== -1) {
      mockFeedbacks[feedbackIndex].TrangThai = status;
    }
  }

  async reply(id: string, reply: string): Promise<void> {
    await this.delay(500);
    const feedbackIndex = mockFeedbacks.findIndex(f => f.MaFeedback === id);
    if (feedbackIndex !== -1) {
      mockFeedbacks[feedbackIndex].TraLoi = reply;
      mockFeedbacks[feedbackIndex].TrangThai = TrangThaiFeedback.DA_XU_LY;
    }
  }
}

export const feedbackService = new FeedbackService(); 