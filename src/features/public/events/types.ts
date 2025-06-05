import { DANGKITOCHUCHIENMAU_RESPONSE, TrangThaiSuKien } from "@/types";

export interface EventCardProps {
  event: DANGKITOCHUCHIENMAU_RESPONSE;
}

export interface EventListProps {
  events: DANGKITOCHUCHIENMAU_RESPONSE[];
  isLoading?: boolean;
}

export interface EventDetailProps {
  event: DANGKITOCHUCHIENMAU_RESPONSE;
  registrationStatus?: {
    isRegistered: boolean;
    canRegister: boolean;
    message?: string;
  };
}

export interface EventRegistrationFormProps {
  event: DANGKITOCHUCHIENMAU_RESPONSE;
  onSubmit: (data: EventRegistrationFormData) => void;
  isSubmitting?: boolean;
}

export interface EventRegistrationFormData {
  ChieuCao: number;
  CanNang: number;
  DaTungHienMau: boolean;
  TienSuBenh: string;
  MacBenhHienTai: string;
  ThongTin12ThangQua: string;
  ThongTin6ThangQua: string;
  ThongTin1ThangQua: string;
  ThongTin14NgayQua: string;
  Thuoc7Ngay: string;
  ThongTinPhuNu12ThangQua?: string;
}

type StatusConfigType = {
  [K in TrangThaiSuKien]: {
    variant: "default" | "secondary" | "destructive";
    text: string;
    className: string;
  }
};

export const STATUS_CONFIG: StatusConfigType = {
  [TrangThaiSuKien.SAP_DIEN_RA]: { 
    variant: "default", 
    text: "Sắp diễn ra", 
    className: "bg-blue-500" 
  },
  [TrangThaiSuKien.DANG_DIEN_RA]: { 
    variant: "default", 
    text: "Đang diễn ra", 
    className: "bg-green-500" 
  },
  [TrangThaiSuKien.DA_HOAN_THANH]: { 
    variant: "secondary", 
    text: "Đã hoàn thành", 
    className: "" 
  },
  [TrangThaiSuKien.DA_HUY]: {
    variant: "destructive",
    text: "Đã hủy",
    className: ""
  }
}; 