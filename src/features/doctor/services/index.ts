import { CapNhatSucKhoe, DanhSachDangKyHienMauFilter, DANGKIHIENMAU_WithRelations } from '../types';
import { TrangThaiDangKy, TrangThaiSucKhoe } from '@/types/common';
import { mockDangKiHienMau } from '@/mock/events';

/**
 * Lấy danh sách đăng ký hiến máu theo tiêu chí
 * @param filter Các tiêu chí lọc danh sách
 * @returns Danh sách đăng ký hiến máu phù hợp với tiêu chí
 */
export async function getDanhSachDangKyHienMauByFilter(filter: DanhSachDangKyHienMauFilter): Promise<DANGKIHIENMAU_WithRelations[]> {
  // Giả lập API call với mock data
  const filteredList = mockDangKiHienMau.filter(dangKy => {
    // Lọc theo sự kiện hiến máu nếu có
    if (filter.IdSuKienHienMau && dangKy.IdSuKienHienMau !== filter.IdSuKienHienMau) {
      return false;
    }
    // Lọc theo trạng thái đơn đăng ký nếu có
    if (filter.TrangThaiDonDK && dangKy.TrangThaiDonDK !== filter.TrangThaiDonDK) {
      return false;
    }
    // Lọc theo trạng thái hiến máu nếu có
    if (filter.TrangThaiHienMau && dangKy.TrangThaiHienMau !== filter.TrangThaiHienMau) {
      return false;
    }
    // Lọc theo trạng thái sức khỏe sau khám nếu có
    if (filter.TTSKKhamSangLoc && dangKy.TTSKKhamSangLoc !== filter.TTSKKhamSangLoc) {
      return false;
    }
    
    return true;
  });

  // Convert to DANGKIHIENMAU_WithRelations type (in a real scenario, this would include relations)
  return filteredList as DANGKIHIENMAU_WithRelations[];
}

/**
 * Lấy danh sách đăng ký cần khám sức khỏe (đã duyệt, chưa đánh giá sức khỏe)
 * @param idSuKien ID sự kiện hiến máu
 * @returns Danh sách đăng ký cần khám
 */
export async function getDanhSachChoKham(idSuKien: string): Promise<DANGKIHIENMAU_WithRelations[]> {
  return getDanhSachDangKyHienMauByFilter({
    IdSuKienHienMau: idSuKien,
    TrangThaiDonDK: TrangThaiDangKy.DA_DUYET,
    TTSKKhamSangLoc: TrangThaiSucKhoe.CHUA_DANH_GIA
  });
}

/**
 * Lấy danh sách người đã hiến máu thành công
 * @param idSuKien ID sự kiện hiến máu
 * @returns Danh sách đã hiến máu
 */
export async function getDanhSachDaHienMau(idSuKien: string): Promise<DANGKIHIENMAU_WithRelations[]> {
  return getDanhSachDangKyHienMauByFilter({
    IdSuKienHienMau: idSuKien,
    TrangThaiDonDK: TrangThaiDangKy.DA_DUYET,
    TTSKKhamSangLoc: TrangThaiSucKhoe.DU_DIEU_KIEN
  });
}

/**
 * Lấy danh sách người không đủ điều kiện hiến máu
 * @param idSuKien ID sự kiện hiến máu
 * @returns Danh sách không đủ điều kiện
 */
export async function getDanhSachKhongDuDieuKien(idSuKien: string): Promise<DANGKIHIENMAU_WithRelations[]> {
  return getDanhSachDangKyHienMauByFilter({
    IdSuKienHienMau: idSuKien,
    TrangThaiDonDK: TrangThaiDangKy.DA_DUYET,
    TTSKKhamSangLoc: TrangThaiSucKhoe.KHONG_DU_DIEU_KIEN
  });
}

/**
 * Lấy chi tiết đăng ký hiến máu
 * @param maDangKy Mã đăng ký hiến máu
 * @returns Chi tiết đăng ký hiến máu
 */
export async function getChiTietDangKyHienMau(maDangKy: string): Promise<DANGKIHIENMAU_WithRelations | null> {
  // Giả lập API call với mock data
  const dangKy = mockDangKiHienMau.find(dk => dk.MaDKiHienMau === maDangKy);
  if (!dangKy) return null;
  
  // Trả về chi tiết đăng ký (trong thực tế sẽ bao gồm các quan hệ)
  return dangKy as DANGKIHIENMAU_WithRelations;
}

/**
 * Cập nhật thông tin sức khỏe sau khám
 * @param data Dữ liệu cập nhật sức khỏe
 * @returns Đăng ký hiến máu đã cập nhật
 */
export async function capNhatSucKhoeSauKham(data: CapNhatSucKhoe): Promise<DANGKIHIENMAU_WithRelations> {
  // Giả lập API call với mock data
  const index = mockDangKiHienMau.findIndex(dk => dk.MaDKiHienMau === data.MaDKiHienMau);
  if (index === -1) {
    throw new Error('Không tìm thấy đăng ký hiến máu');
  }
  
  // Update mock data (in a real API, this would be a PUT request)
  const updatedDangKy = {
    ...mockDangKiHienMau[index],
    ChieuCao: data.ChieuCao ?? mockDangKiHienMau[index].ChieuCao,
    CanNang: data.CanNang ?? mockDangKiHienMau[index].CanNang,
    NhietDo: data.NhietDo ?? mockDangKiHienMau[index].NhietDo,
    NhipTim: data.NhipTim ?? mockDangKiHienMau[index].NhipTim,
    HuyetAp: data.HuyetAp ?? mockDangKiHienMau[index].HuyetAp,
    TTSKKhamSangLoc: data.TTSKKhamSangLoc,
    GhiChu: data.GhiChu ?? mockDangKiHienMau[index].GhiChu,
    NgaySua: new Date().toISOString()
  };
  
  // Trong thực tế, đây sẽ là kết quả trả về từ API
  return updatedDangKy as DANGKIHIENMAU_WithRelations;
} 