import { DANGKIHIENMAU_WithRelations, DANGKITOCHUCHIENMAU } from '@/types/events';
import { TrangThaiDangKy, TrangThaiHienMau, TrangThaiSucKhoe } from '@/types/common';

/**
 * Interface chứa thông tin cập nhật sau khám sức khỏe
 */
export interface CapNhatSucKhoe {
  MaDKiHienMau: string;
  ChieuCao?: number;
  CanNang?: number;
  NhietDo?: number;
  NhipTim?: number;
  HuyetAp?: string;
  TTSKKhamSangLoc: TrangThaiSucKhoe;
  GhiChu?: string;
}

/**
 * Định nghĩa các tab trong trang quản lý hiến máu của bác sĩ
 */
export enum TabBacSi {
  CHO_KHAM = 'cho_kham',
  DA_HIEN_MAU = 'da_hien_mau',
  KHONG_DU_DIEU_KIEN = 'khong_du_dieu_kien'
}

/**
 * Interface lọc danh sách đăng ký hiến máu theo tiêu chí
 */
export interface DanhSachDangKyHienMauFilter {
  IdSuKienHienMau?: string;
  TrangThaiDonDK?: TrangThaiDangKy;
  TrangThaiHienMau?: TrangThaiHienMau;
  TTSKKhamSangLoc?: TrangThaiSucKhoe;
}

export type {
  DANGKIHIENMAU_WithRelations,
  DANGKITOCHUCHIENMAU
}; 