import { mockDangKiToChucHienMau, mockCoSoTinhNguyen, mockThongBaoDKToChuc } from '@/mock';
import { DANGKITOCHUCHIENMAU_WithRelations, DANGKITOCHUCHIENMAU, TrangThaiSuKien, TrangThaiDangKy } from '@/types';

/**
 * Service for handling public events
 */
export const eventsService = {
  /**
   * Get all public events
   * Chỉ trả về các sự kiện đã được duyệt (TinhTrangDK = "approved")
   */
  async getPublicEvents(): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    const publicEvents = mockDangKiToChucHienMau
      .filter(event => event.TinhTrangDK === TrangThaiDangKy.DA_DUYET && event.TrangThaiSuKien == TrangThaiSuKien.SAP_DIEN_RA || event.TrangThaiSuKien == TrangThaiSuKien.DANG_DIEN_RA)
      .map(event => enrichEventWithRelations(event));
    return Promise.resolve(publicEvents);
  },

  /**
   * Get public events by status
   * @param status Trạng thái sự kiện (upcoming, ongoing, completed)
   */
  async getEventsByStatus(status: TrangThaiSuKien): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    const filteredEvents = mockDangKiToChucHienMau
      .filter(
        event => event.TinhTrangDK === TrangThaiDangKy.DA_DUYET && event.TrangThaiSuKien === status
      )
      .map(event => enrichEventWithRelations(event));
    return Promise.resolve(filteredEvents);
  },

  /**
   * Get a public event by ID
   */
  async getEventById(id: string): Promise<DANGKITOCHUCHIENMAU_WithRelations | undefined> {
    const event = mockDangKiToChucHienMau.find(
      event => event.IdSuKien === id && event.TinhTrangDK === TrangThaiDangKy.DA_DUYET
    );
    
    if (!event) return Promise.resolve(undefined);
    
    return Promise.resolve(enrichEventWithRelations(event));
  },

  /**
   * Search public events by text
   * @param query Từ khóa tìm kiếm
   */
  async searchEvents(query: string): Promise<DANGKITOCHUCHIENMAU_WithRelations[]> {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Enrich events with data from related tables
    const eventsWithRelations = mockDangKiToChucHienMau
      .filter(event => event.TinhTrangDK === TrangThaiDangKy.DA_DUYET)
      .map(event => enrichEventWithRelations(event));
    
    // Now search in the enriched data
    const filteredEvents = eventsWithRelations.filter(event => 
      // Tìm trong thông tin cơ sở
      (event.CoSoTinhNguyen?.TenCoSoTinhNguyen?.toLowerCase().includes(normalizedQuery)) ||
      // Tìm trong nội dung thông báo
      (event.ThongBao?.TieuDe?.toLowerCase().includes(normalizedQuery)) ||
      (event.ThongBao?.NoiDung?.toLowerCase().includes(normalizedQuery))
    );
    
    return Promise.resolve(filteredEvents);
  },

  /**
   * Lấy thông tin tổng quát về các sự kiện hiến máu
   */
  async getEventsSummary() {
    const publicEvents = mockDangKiToChucHienMau
      .filter(event => event.TinhTrangDK === TrangThaiDangKy.DA_DUYET)
      .map(event => enrichEventWithRelations(event));
    
    return {
      total: publicEvents.length,
      upcoming: publicEvents.filter(e => e.TrangThaiSuKien === TrangThaiSuKien.SAP_DIEN_RA).length,
      ongoing: publicEvents.filter(e => e.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA).length,
      completed: publicEvents.filter(e => e.TrangThaiSuKien === TrangThaiSuKien.DA_HOAN_THANH).length,
      recentEvents: publicEvents.slice(0, 3) // 3 sự kiện gần nhất
    };
  }
};

/**
 * Thêm dữ liệu quan hệ cho sự kiện
 * @param event Sự kiện cần thêm dữ liệu quan hệ
 */
function enrichEventWithRelations(event: DANGKITOCHUCHIENMAU): DANGKITOCHUCHIENMAU_WithRelations {
  // Thêm thông tin cơ sở tình nguyện
  const coSoTinhNguyen = mockCoSoTinhNguyen.find(
    cs => cs.IDCoSoTinhNguyen === event.IDCoSoTinhNguyen
  );
  
  // Thêm thông tin thông báo
  const thongBao = mockThongBaoDKToChuc.find(
    tb => tb.IdThongBaoDK === event.IdThongBaoDK
  );
  
  return {
    ...event,
    CoSoTinhNguyen: coSoTinhNguyen,
    ThongBao: thongBao
  };
} 