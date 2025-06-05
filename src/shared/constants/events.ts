import { TrangThaiSuKien } from '@/types';

type StatusConfigType = {
  [K in TrangThaiSuKien]: {
    variant: "default" | "secondary" | "destructive" | "outline";
    text: string;
    className: string;
  }
};

export const EVENT_STATUS_CONFIG: StatusConfigType = {
  [TrangThaiSuKien.SAP_DIEN_RA]: {
    variant: 'secondary',
    text: 'Sắp diễn ra',
    className: 'bg-yellow-100 text-yellow-800'
  },
  [TrangThaiSuKien.DANG_DIEN_RA]: {
    variant: 'default',
    text: 'Đang diễn ra',
    className: 'bg-green-100 text-green-800'
  },
  [TrangThaiSuKien.DA_HOAN_THANH]: {
    variant: 'outline',
    text: 'Đã hoàn thành',
    className: 'bg-gray-100 text-gray-800'
  },
  [TrangThaiSuKien.DA_HUY]: {
    variant: 'destructive',
    text: 'Đã hủy',
    className: 'bg-red-100 text-red-800'
  }
} as const; 