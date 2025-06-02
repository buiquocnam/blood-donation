import { DANGKIHIENMAU_WithRelations, TrangThaiDangKy, TrangThaiHienMau, TrangThaiSucKhoe } from '@/types';

// Props Types
export interface RegistrationListProps {
  registrations: RegistrationResponse[];
  onStatusChange: (id: string, status: TrangThaiDangKy) => void;
  onHealthStatusChange: (id: string, status: TrangThaiSucKhoe) => void;
  isLoading: boolean;
}

export interface RegistrationDetailProps {
  registration: RegistrationResponse;
  onStatusChange: (id: string, status: TrangThaiDangKy) => void;
  onHealthStatusChange: (id: string, status: TrangThaiSucKhoe) => void;
  onBloodDonationStatusChange: (id: string, status: TrangThaiHienMau) => void;
  isLoading: boolean;
}

export interface UpdateHealthStatusRequest {
  registrationId: string;
  status: TrangThaiSucKhoe;
  healthData?: {
    chieuCao?: number;
    canNang?: number;
    nhietDo?: number;
    nhipTim?: number;
    huyetAp?: string;
    ghiChu?: string;
  };
}

export interface UpdateBloodDonationStatusRequest {
  registrationId: string;
  status: TrangThaiHienMau;
  note?: string;
} 

export interface RegistrationResponse {
  MaDKiHienMau: string;
  IDNguoiHienMau: string;
  IDNVDuyet: string;
  IDBacSi: string | null;
  IdSuKien: string;
  IdDanhMucDVHienMau: string;
  NgayDangKi: string;
  NgaySua: string;
  DaTungHienMau: boolean;
  MacBenhHienTai: string;
  TienSuBenh: string;
  Thuoc7Ngay: string;
  ThongTin14NgayQua: string;
  ThongTin1ThangQua: string;
  ThongTin6ThangQua: string;
  ThongTin12ThangQua: string;
  ThongTinPhuNu12ThangQua: string;
  GhiChu: string;
  TrangThaiDonDK: string;
  TrangThaiHienMau: string;
  ChieuCao?: number;
  CanNang?: number;
  NhietDo?: number;
  NhipTim?: number;
  HuyetAp?: string;
  TTSKKhamSangLoc: string;
  TTSKSauHien: string | null;
  NGUOIHIENMAU: {
    MaNguoiDung: string;
    HoTen: string;
    SDT: string;
    Email: string;
    NgaySinh: string;
    GioiTinh: boolean;
    tenDiaChi: string;
  };
  NVDUYET: {
    MaNguoiDung: string;
    HoTen: string;
  };
  BACSI: null | {
    MaNguoiDung: string;
    HoTen: string;
  };
  DANHMUCDVMAU: {
    IdDanhMucDVHienMau: string;
    SoLuongMau: number;
    GhiChu: string;
  };
  DANGKITOCHUCHIENMAU: {
    IdSuKien: string;
  };
}
