import { COSOTINHNGUYEN, THONGBAODKTOCHUC, DANGKITOCHUCHIENMAU } from '../../../types';
import { mockCoSoTinhNguyen } from '../../../mock/volunteers';
import { mockThongBaoDKToChuc } from '../../../mock/announcements';
import { mockDangKiToChucHienMau } from '../../../mock/events';
import { TrangThaiDangKy, TrangThaiSuKien } from '../../../types/common';

// Lấy danh sách tất cả thông báo
export const fetchAnnouncements = async (): Promise<THONGBAODKTOCHUC[]> => {
  // Trong triển khai thực tế, đây sẽ là một cuộc gọi API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockThongBaoDKToChuc);
    }, 500);
  });
};

// Lấy một thông báo theo ID
export const fetchAnnouncementById = async (id: string): Promise<THONGBAODKTOCHUC | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const announcement = mockThongBaoDKToChuc.find(announcement => announcement.IdThongBaoDK === id);
      resolve(announcement);
    }, 300);
  });
};

// Lấy tất cả đăng ký sự kiện cho một cơ sở tình nguyện
export const fetchEventRegistrations = async (centerId: string): Promise<DANGKITOCHUCHIENMAU[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const registrations = mockDangKiToChucHienMau.filter(
        reg => reg.IDCoSoTinhNguyen === centerId
      );
      resolve(registrations);
    }, 500);
  });
};

// Lấy thông tin cơ sở tình nguyện theo ID
export const fetchVolunteerCenterById = async (id: string): Promise<COSOTINHNGUYEN | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const center = mockCoSoTinhNguyen.find(center => center.IDCoSoTinhNguyen === id);
      resolve(center);
    }, 300);
  });
};

// Đăng ký tổ chức sự kiện
export const registerForEvent = async (
  centerId: string, 
  eventId: string, 
  data: {
    soLuongDK: number;
  }
): Promise<DANGKITOCHUCHIENMAU> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trong ứng dụng thực tế, đây sẽ là một yêu cầu POST
      const newRegistration: DANGKITOCHUCHIENMAU = {
        IdSuKien: `SK${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        IdThongBaoDK: eventId,
        IDCoSoTinhNguyen: centerId,
        NgayDangKi: new Date().toISOString(),
        TinhTrangDK: TrangThaiDangKy.CHO_DUYET,
        SoLuongDK: data.soLuongDK,
        SoLuongDDK: 0,
        TrangThaiSuKien: TrangThaiSuKien.SAP_DIEN_RA, // Sắp diễn ra
        NgayDang: new Date().toISOString(),
        NgaySua: new Date().toISOString(),
        HanDK: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
      };
      resolve(newRegistration);
    }, 700);
  });
};

// Hủy đăng ký sự kiện
export const cancelEventRegistration = async (
  eventId: string
): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trong ứng dụng thực tế, đây sẽ là một yêu cầu DELETE hoặc PATCH để cập nhật trạng thái
      resolve({ success: true });
    }, 500);
  });
}; 