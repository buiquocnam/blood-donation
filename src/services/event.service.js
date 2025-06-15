const { DANGKITOCHUCHIENMAU, COSOTINHNGUYEN, THONGBAODKTOCHUC } = require('../models');
const { Op } = require('sequelize');

/**
 * Lấy danh sách sự kiện đã được phê duyệt
 * @param {Object} options - Các tùy chọn tìm kiếm và phân trang
 * @param {number} options.limit - Số lượng kết quả mỗi trang
 * @param {number} options.page - Số trang
 * @param {string} options.search - Từ khóa tìm kiếm
 * @param {Date} options.fromDate - Ngày bắt đầu tìm kiếm
 * @param {Date} options.toDate - Ngày kết thúc tìm kiếm
 * @param {string} options.status - Trạng thái sự kiện
 * @returns {Promise<Object>} - Danh sách sự kiện và thông tin phân trang
 */
const getApprovedEvents = async (options = {}) => {
  const {
    limit = 10,
    page = 1,
    search = '',
    fromDate,
    toDate,
    status
  } = options;

  // Tính offset cho phân trang
  const offset = (page - 1) * limit;

  // Xây dựng điều kiện tìm kiếm
  const whereConditions = {
    TinhTrangDK: 'DA_DUYET', // Chỉ lấy sự kiện đã được phê duyệt
  };

  // Thêm điều kiện tìm kiếm theo trạng thái nếu có
  if (status) {
    whereConditions.TrangThaiSuKien = status;
  }

  // Thêm điều kiện tìm kiếm theo khoảng thời gian
  if (fromDate && toDate) {
    whereConditions.NgayDangKi = {
      [Op.between]: [new Date(fromDate), new Date(toDate)]
    };
  } else if (fromDate) {
    whereConditions.NgayDangKi = {
      [Op.gte]: new Date(fromDate)
    };
  } else if (toDate) {
    whereConditions.NgayDangKi = {
      [Op.lte]: new Date(toDate)
    };
  }

  // Thêm điều kiện tìm kiếm theo tiêu đề hoặc nội dung
  if (search) {
    whereConditions[Op.or] = [
      { '$THONGBAODKTOCHUC.TieuDe$': { [Op.like]: `%${search}%` } },
      { '$THONGBAODKTOCHUC.NoiDung$': { [Op.like]: `%${search}%` } },
    ];
  }

  // Thực hiện truy vấn với Include để lấy thêm thông tin liên quan
  try {
    const { count, rows } = await DANGKITOCHUCHIENMAU.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      include: [
        {
          model: COSOTINHNGUYEN,
          as: 'COSOTINHNGUYEN',
          attributes: ['IDCoSoTinhNguyen', 'TenCoSoTinhNguyen', 'SDT', 'Email', 'NguoiPhuTrach']
        },
        {
          model: THONGBAODKTOCHUC,
          as: 'THONGBAODKTOCHUC',
          attributes: ['TieuDe', 'NoiDung']
        }
      ],
      order: [
        ['NgayDangKi', 'DESC'] // Sắp xếp theo ngày đăng ký mới nhất
      ]
    });

    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      events: rows,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
        perPage: limit,
        hasNext,
        hasPrevious
      }
    };
  } catch (error) {
    console.error('Error in getApprovedEvents:', error);
    throw new Error(`Lỗi khi lấy danh sách sự kiện: ${error.message}`);
  }
};

/**
 * Lấy chi tiết sự kiện theo ID
 * @param {string} eventId - ID của sự kiện cần lấy
 * @returns {Promise<Object>} - Chi tiết sự kiện
 */
const getEventById = async (eventId) => {
  try {
    const event = await DANGKITOCHUCHIENMAU.findOne({
      where: {
        IdSuKien: eventId,
        TinhTrangDK: 'DA_DUYET' // Chỉ lấy sự kiện đã được phê duyệt
      },
      include: [
        {
          model: COSOTINHNGUYEN,
          as: 'COSOTINHNGUYEN',
          attributes: ['IDCoSoTinhNguyen', 'TenCoSoTinhNguyen', 'SDT', 'Email', 'NguoiPhuTrach', 'DiaChi']
        }
      ]
    });

    if (!event) {
      throw new Error('Sự kiện không tồn tại hoặc chưa được phê duyệt');
    }

    return event;
  } catch (error) {
    console.error('Error in getEventById:', error);
    throw new Error(`Lỗi khi lấy chi tiết sự kiện: ${error.message}`);
  }
};

/**
 * Lấy danh sách sự kiện sắp diễn ra
 * @param {number} limit - Số lượng sự kiện muốn lấy
 * @returns {Promise<Array>} - Danh sách sự kiện sắp diễn ra
 */
const getUpcomingEvents = async (limit = 5) => {
  try {
    const events = await DANGKITOCHUCHIENMAU.findAll({
      where: {
        TinhTrangDK: 'DA_DUYET',
        TrangThaiSuKien: 'CHUA_DIEN_RA'
      },
      limit,
      include: [
        {
          model: COSOTINHNGUYEN,
          as: 'COSOTINHNGUYEN',
          attributes: ['IDCoSoTinhNguyen', 'TenCoSoTinhNguyen']
        }
      ],
      order: [
        ['NgayDangKi', 'DESC'] // Sắp xếp theo ngày đăng ký mới nhất
      ]
    });

    return events;
  } catch (error) {
    console.error('Error in getUpcomingEvents:', error);
    throw new Error(`Lỗi khi lấy danh sách sự kiện sắp diễn ra: ${error.message}`);
  }
};

module.exports = {
  getApprovedEvents,
  getEventById,
  getUpcomingEvents
}; 