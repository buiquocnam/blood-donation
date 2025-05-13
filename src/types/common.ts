// Các enum và hằng số trạng thái giao diện người dùng
export enum TrangThaiSuKien {
  SAP_DIEN_RA = 'upcoming',
  DANG_DIEN_RA = 'ongoing',
  DA_HOAN_THANH = 'completed',
  DA_HUY = 'canceled'
}

export enum TrangThaiDangKy {
  CHO_DUYET = 'pending',
  DA_DUYET = 'approved',
  TU_CHOI = 'rejected'
}

export enum TrangThaiHienMau {
  DA_HOAN_THANH = 'completed',
  CHO_HIEN = 'pending',
  TU_CHOI = 'rejected'
}

export enum TrangThaiSucKhoe {
  DU_DIEU_KIEN = 'eligible',
  KHONG_DU_DIEU_KIEN = 'not_eligible',
  CHUA_DANH_GIA = 'pending'
}

// Ánh xạ giữa trạng thái số trong cơ sở dữ liệu và enum trạng thái giao diện người dùng
export const MAP_TRANG_THAI_DANG_KY = {
  'pending': TrangThaiDangKy.CHO_DUYET,
  'approved': TrangThaiDangKy.DA_DUYET,
  'rejected': TrangThaiDangKy.TU_CHOI
};

export const MAP_TRANG_THAI_HIEN_MAU = {
  'pending': TrangThaiHienMau.CHO_HIEN,
  'completed': TrangThaiHienMau.DA_HOAN_THANH,
  'rejected': TrangThaiHienMau.TU_CHOI
}; 