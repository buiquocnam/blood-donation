import { PHANHOI_WithRelations, DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien, NGUOIDUNG } from '@/types';

export interface FeedbackListProps {
  feedbacks: PHANHOI_WithRelations[];
  onReplySubmit: (feedbackId: string, reply: string) => Promise<void>;
}

export interface FeedbackCardProps {
  feedback: PHANHOI_WithRelations;
  onReplySubmit: (reply: string) => Promise<void>;
}

export interface EventsListContainerProps {
  onEventSelect?: (eventId: string) => void;
}

export interface EventsListProps {
  events: DANGKITOCHUCHIENMAU_WithRelations[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onFilterStatus?: (status: TrangThaiSuKien | null) => void;
  onEventSelect?: (eventId: string) => void;
}

export enum TrangThaiFeedback {
  CHO_XU_LY = "Chờ xử lý",
  DA_XU_LY = "Đã xử lý"
}

// Simplified user type for mock data
export interface NguoiDungInfo {
  HoTen: string;
  Email: string;
  SDT: string;
}

export interface FeedbackResponse {
  MaFeedback: string;
  NoiDung: string;
  ThoiGian: string;
  TrangThai: TrangThaiFeedback;
  TraLoi?: string;
  NGUOIDUNG?: NguoiDungInfo;
}

export interface FeedbackDetailDialogProps {
  feedback: FeedbackResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: TrangThaiFeedback) => void;
  onReply: (id: string, reply: string) => void;
} 