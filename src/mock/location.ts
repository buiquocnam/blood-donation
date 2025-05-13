import { THANHPHO, QUAN, PHUONG } from '../types';

// Mock data for THANHPHO (Cities)
export const mockThanhPho: THANHPHO[] = [
  {
    IdThanhPho: "TP01",
    TenThanhPho: "Hồ Chí Minh"
  },
  {
    IdThanhPho: "TP02",
    TenThanhPho: "Hà Nội"
  },
  {
    IdThanhPho: "TP03",
    TenThanhPho: "Đà Nẵng"
  },
  {
    IdThanhPho: "TP04",
    TenThanhPho: "Cần Thơ"
  }
];

// Mock data for QUAN (Districts)
export const mockQuan: QUAN[] = [
  {
    IdQuan: "Q01",
    IdThanhPho: "TP01",
    TenQuan: "Quận 1"
  },
  {
    IdQuan: "Q02",
    IdThanhPho: "TP01",
    TenQuan: "Quận 2"
  },
  {
    IdQuan: "Q03",
    IdThanhPho: "TP01",
    TenQuan: "Quận 3"
  },
  {
    IdQuan: "Q04",
    IdThanhPho: "TP02",
    TenQuan: "Quận Ba Đình"
  },
  {
    IdQuan: "Q05",
    IdThanhPho: "TP02",
    TenQuan: "Quận Hoàn Kiếm"
  },
  {
    IdQuan: "Q06",
    IdThanhPho: "TP03",
    TenQuan: "Quận Hải Châu"
  },
  {
    IdQuan: "Q07",
    IdThanhPho: "TP04",
    TenQuan: "Quận Ninh Kiều"
  }
];

// Mock data for PHUONG (Wards)
export const mockPhuong: PHUONG[] = [
  {
    IdPhuong: "P01",
    IdQuan: "Q01",
    TenPhuong: "Phường Bến Nghé"
  },
  {
    IdPhuong: "P02",
    IdQuan: "Q01",
    TenPhuong: "Phường Bến Thành"
  },
  {
    IdPhuong: "P03",
    IdQuan: "Q02",
    TenPhuong: "Phường Thảo Điền"
  },
  {
    IdPhuong: "P04",
    IdQuan: "Q04",
    TenPhuong: "Phường Trúc Bạch"
  },
  {
    IdPhuong: "P05",
    IdQuan: "Q06",
    TenPhuong: "Phường Thanh Bình"
  },
  {
    IdPhuong: "P06",
    IdQuan: "Q07",
    TenPhuong: "Phường Tân An"
  }
]; 