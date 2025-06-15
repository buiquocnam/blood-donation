const { DANGKIHIENMAU, NGUOIDUNG, DANGKITOCHUCHIENMAU, COSOTINHNGUYEN, DANHMUCDVMAU } = require('../models');
const { Op } = require('sequelize');
const { VAITRO } = require('../models');

/**
 * Lấy danh sách đăng ký hiến máu theo sự kiện
 * Chỉ bác sĩ và nhân viên y tế có quyền xem
 * @param {string} eventId - ID của sự kiện
 * @param {Object} options - Các tùy chọn tìm kiếm và phân trang
 * @param {number} options.limit - Số lượng kết quả mỗi trang
 * @param {number} options.page - Số trang
 * @param {string} options.search - Từ khóa tìm kiếm
 * @param {string} options.status - Trạng thái đăng ký hiến máu
 * @param {string} options.medicalStatus - Trạng thái hiến máu
 * @param {string} currentUserId - ID của người dùng hiện tại đang thực hiện truy vấn
 * @param {string} userRole - Vai trò của người dùng hiện tại
 * @returns {Promise<Object>} - Danh sách đăng ký hiến máu và thông tin phân trang
 */
const getDonationsByEvent = async (eventId, options = {}, currentUserId, userRole) => {
  // Kiểm tra quyền truy cập
  if (![VAITRO.ROLES.MEDICAL_STAFF, VAITRO.ROLES.DOCTOR, VAITRO.ROLES.ADMIN, VAITRO.ROLES.BLOOD_DIRECTOR].includes(userRole)) {
    throw new Error('Bạn không có quyền truy cập tính năng này');
  }

  const {
    limit = 10,
    page = 1,
    search = '',
    status,
    medicalStatus
  } = options;

  // Tính offset cho phân trang
  const offset = (page - 1) * limit;

  // Xây dựng điều kiện tìm kiếm
  const whereConditions = {
    IdSuKien: eventId
  };

  // Thêm điều kiện tìm kiếm theo trạng thái đơn đăng ký nếu có
  if (status) {
    whereConditions.TrangThaiDonDK = status;
  }

  // Thêm điều kiện tìm kiếm theo trạng thái hiến máu nếu có
  if (medicalStatus) {
    whereConditions.TrangThaiHienMau = medicalStatus;
  }

  try {
    // Thực hiện truy vấn với Include để lấy thêm thông tin liên quan
    const { count, rows } = await DANGKIHIENMAU.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      include: [
        {
          model: NGUOIDUNG,
          as: 'NGUOIHIENMAU',
          attributes: ['MaNguoiDung', 'HoTen', 'SDT', 'Email', 'NgaySinh', 'GioiTinh', 'MaNhomMau'],
          where: search ? {
            [Op.or]: [
              { HoTen: { [Op.like]: `%${search}%` } },
              { SDT: { [Op.like]: `%${search}%` } },
              { Email: { [Op.like]: `%${search}%` } }
            ]
          } : undefined
        },
        {
          model: NGUOIDUNG,
          as: 'NVDUYET',
          attributes: ['MaNguoiDung', 'HoTen']
        },
        {
          model: NGUOIDUNG,
          as: 'BACSI',
          attributes: ['MaNguoiDung', 'HoTen']
        },
        {
          model: DANGKITOCHUCHIENMAU,
          as: 'DANGKITOCHUCHIENMAU',
          attributes: ['IdSuKien']
        },
        {
          model: DANHMUCDVMAU,
          as: 'DANHMUCDVMAU',
          attributes: ['IdDanhMucDVHienMau', 'SoLuongMau', 'GhiChu']
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
      donations: rows || [],
      pagination: {
        total: count,
        totalPages: totalPages || 0,
        currentPage: page,
        perPage: limit,
        hasNext,
        hasPrevious
      }
    };
  } catch (error) {
    console.error('Error in getDonationsByEvent:', error);
    
    // Nếu có lỗi, trả về mảng rỗng thay vì ném lỗi
    return {
      donations: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        perPage: limit,
        hasNext: false,
        hasPrevious: false
      }
    };
  }
};

/**
 * Cập nhật trạng thái đơn đăng ký hiến máu
 * Chỉ nhân viên y tế có quyền cập nhật
 * @param {string} donationId - ID của đơn đăng ký hiến máu
 * @param {string} status - Trạng thái mới của đơn đăng ký
 * @param {string} currentUserId - ID của người dùng hiện tại đang thực hiện cập nhật
 * @param {string} userRole - Vai trò của người dùng hiện tại
 * @returns {Promise<Object>} - Đơn đăng ký hiến máu đã cập nhật
 */
const updateDonationStatus = async (donationId, status, currentUserId, userRole) => {
  // Kiểm tra quyền truy cập (chỉ nhân viên y tế)
  if (![VAITRO.ROLES.MEDICAL_STAFF, VAITRO.ROLES.ADMIN, VAITRO.ROLES.BLOOD_DIRECTOR].includes(userRole)) {
    throw new Error('Bạn không có quyền cập nhật trạng thái đơn đăng ký hiến máu');
  }

  // Kiểm tra đơn đăng ký tồn tại
  const donation = await DANGKIHIENMAU.findByPk(donationId);
  if (!donation) {
    throw new Error('Đơn đăng ký hiến máu không tồn tại');
  }

  // Kiểm tra trạng thái hợp lệ
  if (!['CHO_DUYET', 'DA_DUYET', 'TU_CHOI'].includes(status)) {
    throw new Error('Trạng thái không hợp lệ');
  }

  // Cập nhật trạng thái và người duyệt
  await donation.update({
    TrangThaiDonDK: status,
    IDNVDuyet: currentUserId,
    NgaySua: new Date()
  });

  // Lấy đơn đăng ký đã cập nhật với thông tin liên quan
  const updatedDonation = await DANGKIHIENMAU.findByPk(donationId, {
    include: [
      {
        model: NGUOIDUNG,
        as: 'NGUOIHIENMAU',
        attributes: ['MaNguoiDung', 'HoTen', 'SDT', 'Email']
      },
      {
        model: NGUOIDUNG,
        as: 'NVDUYET',
        attributes: ['MaNguoiDung', 'HoTen']
      },
      {
        model: DANGKITOCHUCHIENMAU,
        as: 'DANGKITOCHUCHIENMAU',
        attributes: ['IdSuKien']
      }
    ]
  });

  return updatedDonation;
};

/**
 * Cập nhật thông tin sức khỏe và trạng thái hiến máu
 * Bác sĩ có thể cập nhật tất cả thông tin, nhân viên y tế chỉ có thể cập nhật trạng thái
 * @param {string} donationId - ID của đơn đăng ký hiến máu
 * @param {Object} healthData - Thông tin sức khỏe
 * @param {string} medicalStatus - Trạng thái hiến máu mới
 * @param {string} currentUserId - ID của người dùng hiện tại đang thực hiện cập nhật
 * @param {string} userRole - Vai trò của người dùng hiện tại
 * @returns {Promise<Object>} - Đơn đăng ký hiến máu đã cập nhật
 */
const updateDonationMedicalStatus = async (donationId, healthData, medicalStatus, currentUserId, userRole) => {
  // Kiểm tra quyền truy cập
  if (![VAITRO.ROLES.DOCTOR, VAITRO.ROLES.MEDICAL_STAFF, VAITRO.ROLES.ADMIN].includes(userRole)) {
    throw new Error('Bạn không có quyền cập nhật thông tin sức khỏe và trạng thái hiến máu');
  }

  // Kiểm tra đơn đăng ký tồn tại
  const donation = await DANGKIHIENMAU.findByPk(donationId);
  if (!donation) {
    throw new Error('Đơn đăng ký hiến máu không tồn tại');
  }

  // Kiểm tra trạng thái hiến máu hợp lệ
  if (!['CHO_HIEN', 'DA_HIENMAU', 'TU_CHOI'].includes(medicalStatus)) {
    throw new Error('Trạng thái hiến máu không hợp lệ');
  }

  // Xác định dữ liệu cập nhật dựa trên vai trò
  let updateData = {
    TrangThaiHienMau: medicalStatus,
    NgaySua: new Date()
  };

  // Nếu là bác sĩ hoặc admin, cho phép cập nhật thông tin sức khỏe
  if ([VAITRO.ROLES.DOCTOR, VAITRO.ROLES.ADMIN].includes(userRole)) {
    updateData = {
      ...updateData,
      ...healthData,
      IDBacSi: currentUserId
    };
  } else if (userRole === VAITRO.ROLES.MEDICAL_STAFF) {
    // Nhân viên y tế chỉ có thể cập nhật trạng thái và ghi chú
    if (healthData.GhiChu) {
      updateData.GhiChu = healthData.GhiChu;
    }
  }

  // Cập nhật thông tin
  await donation.update(updateData);

  // Lấy đơn đăng ký đã cập nhật với thông tin liên quan
  const updatedDonation = await DANGKIHIENMAU.findByPk(donationId, {
    include: [
      {
        model: NGUOIDUNG,
        as: 'NGUOIHIENMAU',
        attributes: ['MaNguoiDung', 'HoTen', 'SDT', 'Email']
      },
      {
        model: NGUOIDUNG,
        as: 'BACSI',
        attributes: ['MaNguoiDung', 'HoTen']
      },
      {
        model: DANGKITOCHUCHIENMAU,
        as: 'DANGKITOCHUCHIENMAU',
        attributes: ['IdSuKien']
      }
    ]
  });

  return updatedDonation;
};

/**
 * Đăng ký hiến máu
 * @param {string} eventId - ID của sự kiện hiến máu
 * @param {string} bloodServiceId - ID của gói hiến máu
 * @param {string} userId - ID của người đăng ký hiến máu
 * @returns {Promise<Object>} - Thông tin đăng ký hiến máu
 */
const registerDonation = async (eventId, bloodServiceId, userId) => {
  // Kiểm tra sự kiện tồn tại và đã được duyệt
  const event = await DANGKITOCHUCHIENMAU.findOne({
    where: {
      IdSuKien: eventId,
      TinhTrangDK: 'DA_DUYET'
    }
  });

  if (!event) {
    throw new Error('Sự kiện không tồn tại hoặc chưa được duyệt');
  }

  // Kiểm tra sự kiện còn hiệu lực
  if (event.TrangThaiSuKien === 'DA_KET_THUC' || event.TrangThaiSuKien === 'DA_HUY') {
    throw new Error('Sự kiện đã kết thúc hoặc đã bị hủy');
  }

  // Kiểm tra người dùng đã đăng ký sự kiện này chưa
  const existingDonation = await DANGKIHIENMAU.findOne({
    where: {
      IdSuKien: eventId,
      IDNguoiHienMau: userId
    }
  });

  if (existingDonation) {
    throw new Error('Bạn đã đăng ký hiến máu cho sự kiện này');
  }

  // Kiểm tra gói hiến máu tồn tại
  const bloodService = await DANHMUCDVMAU.findByPk(bloodServiceId);
  if (!bloodService) {
    throw new Error('Gói hiến máu không tồn tại');
  }

  // Tạo mã đăng ký hiến máu mới
  const donationId = await generateDonationId();

  // Tạo đăng ký hiến máu mới
  const donation = await DANGKIHIENMAU.create({
    MaDKiHienMau: donationId,
    IdSuKien: eventId,
    IDNguoiHienMau: userId,
    IdDanhMucDVHienMau: bloodServiceId,
    NgayDangKi: new Date(),
    TrangThaiDonDK: 'CHO_DUYET',
    TrangThaiHienMau: 'CHO_HIEN'
  });

  // Lấy thông tin đầy đủ của đăng ký hiến máu
  const fullDonation = await DANGKIHIENMAU.findByPk(donationId, {
    include: [
      {
        model: NGUOIDUNG,
        as: 'NGUOIHIENMAU',
        attributes: ['MaNguoiDung', 'HoTen', 'SDT', 'Email']
      },
      {
        model: DANGKITOCHUCHIENMAU,
        as: 'DANGKITOCHUCHIENMAU',
        attributes: ['IdSuKien']
      },
      {
        model: DANHMUCDVMAU,
        as: 'DANHMUCDVMAU',
        attributes: ['IdDanhMucDVHienMau', 'SoLuongMau']
      }
    ]
  });

  return fullDonation;
};

/**
 * Tạo mã đăng ký hiến máu mới
 * @returns {Promise<string>} - Mã đăng ký hiến máu mới
 */
const generateDonationId = async () => {
  const prefix = 'DK';
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const donationId = `${prefix}${randomNum}`;

  // Kiểm tra mã đã tồn tại chưa
  const existingDonation = await DANGKIHIENMAU.findByPk(donationId);
  if (existingDonation) {
    // Nếu đã tồn tại, tạo mã mới
    return generateDonationId();
  }

  return donationId;
};

module.exports = {
  getDonationsByEvent,
  updateDonationStatus,
  updateDonationMedicalStatus,
  registerDonation
}; 