import { NGUOIDUNG, FormDuLieuSucKhoe } from '@/types';

export interface DANGKIHIENMAU {
  MaDKiHienMau: string;
  IdNguoiHienMau: string;
  IdSuKienHienMau: string;
  TrangThaiDangKy: 'pending' | 'approved' | 'rejected' | 'completed';
  NgayDangKy: string;
  NgayHenHien?: string;
  KetQuaKhamSucKhoe?: FormDuLieuSucKhoe;
  GhiChu?: string;
  NgayTao: string;
  NgaySua: string;
}

export interface PHANHOI {
  MaPhanHoi: string;
  IdNguoiHienMau: string;
  MaDKiHienMau: string;
  TinhTrangMoTa: string;
  DanhGia: number;
  TraLoi?: string;
  NgayTraLoi?: string;
  NgayTao: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  completedRegistrations: number;
  totalFeedbacks: number;
  averageRating: number;
}

export interface DashboardStatsProps {
  stats: DashboardStats;
}

export interface RegistrationListProps {
  registrations: DANGKIHIENMAU[];
  onStatusChange: (id: string, status: DANGKIHIENMAU['TrangThaiDangKy']) => void;
}

export interface FeedbackListProps {
  feedbacks: PHANHOI[];
  onRespond: (id: string, response: string) => void;
}

export interface DonationRegistrationResponse extends DANGKIHIENMAU {
  NguoiHienMau?: NGUOIDUNG;
}

export interface PhanHoiWithUserInfo extends PHANHOI {
  NguoiHienMau?: NGUOIDUNG;
} 