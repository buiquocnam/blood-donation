const donationService = require('../../services/donation.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Lấy danh sách đăng ký hiến máu theo sự kiện
 * Chỉ bác sĩ và nhân viên y tế có quyền xem
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getDonationsByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { page = 1, limit = 10, search = '', status, medicalStatus } = req.query;
    
    // Lấy thông tin người dùng từ middleware xác thực
    const currentUserId = req.userId;
    const userRole = req.userRole;

    // Log request để debug
    console.log('Request GET /api/donations/event:', { 
      eventId, 
      query: req.query,
      userId: currentUserId,
      userRole
    });

    // Kiểm tra eventId
    if (!eventId) {
      return res.status(400).json(ApiResponse.error('ID sự kiện không được để trống', 400));
    }

    // Lấy danh sách đăng ký hiến máu
    const result = await donationService.getDonationsByEvent(
      eventId,
      {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        search,
        status,
        medicalStatus
      },
      currentUserId,
      userRole
    );

    return res.status(200).json(ApiResponse.successWithPagination(
      result.donations,
      result.pagination
    ));
  } catch (error) {
    console.error('Lỗi trong controller getDonationsByEvent:', error);
    
    if (error.message && error.message.includes('không có quyền')) {
      return res.status(403).json(ApiResponse.error(error.message, 403));
    }

    // Trả về phản hồi lỗi chuẩn hóa
    return res.status(500).json(ApiResponse.error(
      error.message || 'Lỗi server khi lấy danh sách đăng ký hiến máu', 
      500
    ));
  }
};

/**
 * Cập nhật trạng thái đơn đăng ký hiến máu
 * Chỉ nhân viên y tế có quyền cập nhật
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateDonationStatus = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { status } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!status) {
      return res.status(400).json(ApiResponse.error('Vui lòng cung cấp trạng thái mới', 400));
    }
    
    // Lấy thông tin người dùng từ middleware xác thực
    const currentUserId = req.userId;
    const userRole = req.userRole;

    // Cập nhật trạng thái đơn đăng ký
    const updatedDonation = await donationService.updateDonationStatus(
      donationId,
      status,
      currentUserId,
      userRole
    );

    return res.status(200).json(ApiResponse.success(updatedDonation));
  } catch (error) {
    if (error.message.includes('không có quyền')) {
      return res.status(403).json(ApiResponse.error(error.message, 403));
    }
    if (error.message.includes('không tồn tại') || error.message.includes('không hợp lệ')) {
      return res.status(400).json(ApiResponse.error(error.message, 400));
    }
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Cập nhật thông tin sức khỏe và trạng thái hiến máu
 * Bác sĩ có thể cập nhật tất cả thông tin, nhân viên y tế chỉ có thể cập nhật trạng thái
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateDonationMedicalStatus = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { medicalStatus, ...healthData } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!medicalStatus) {
      return res.status(400).json(ApiResponse.error('Vui lòng cung cấp trạng thái hiến máu mới', 400));
    }

    // Kiểm tra quyền và dữ liệu sức khỏe
    const userRole = req.userRole;
    if (userRole === VAITRO.ROLES.MEDICAL_STAFF && Object.keys(healthData).length > 1) {
      return res.status(403).json(ApiResponse.error('Nhân viên y tế chỉ có thể cập nhật trạng thái và ghi chú', 403));
    }
    
    // Lấy thông tin người dùng từ middleware xác thực
    const currentUserId = req.userId;

    // Cập nhật thông tin sức khỏe và trạng thái hiến máu
    const updatedDonation = await donationService.updateDonationMedicalStatus(
      donationId,
      healthData,
      medicalStatus,
      currentUserId,
      userRole
    );

    return res.status(200).json(ApiResponse.success(updatedDonation));
  } catch (error) {
    if (error.message.includes('không có quyền')) {
      return res.status(403).json(ApiResponse.error(error.message, 403));
    }
    if (error.message.includes('không tồn tại') || error.message.includes('không hợp lệ')) {
      return res.status(400).json(ApiResponse.error(error.message, 400));
    }
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Đăng ký hiến máu
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const registerDonation = async (req, res) => {
  try {
    const { eventId, bloodServiceId } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!eventId) {
      return res.status(400).json(ApiResponse.error('Vui lòng chọn sự kiện hiến máu', 400));
    }

    if (!bloodServiceId) {
      return res.status(400).json(ApiResponse.error('Vui lòng chọn gói hiến máu', 400));
    }

    // Lấy thông tin người dùng từ middleware xác thực
    const currentUserId = req.userId;

    // Đăng ký hiến máu
    const donation = await donationService.registerDonation(
      eventId,
      bloodServiceId,
      currentUserId
    );

    return res.status(201).json(ApiResponse.success(donation));
  } catch (error) {
    console.error('Lỗi trong controller registerDonation:', error);

    if (error.message.includes('đã đăng ký')) {
      return res.status(400).json(ApiResponse.error(error.message, 400));
    }
    if (error.message.includes('không tồn tại')) {
      return res.status(404).json(ApiResponse.error(error.message, 404));
    }
    if (error.message.includes('đã kết thúc') || error.message.includes('chưa được duyệt')) {
      return res.status(400).json(ApiResponse.error(error.message, 400));
    }

    return res.status(500).json(ApiResponse.error(
      error.message || 'Lỗi server khi đăng ký hiến máu',
      500
    ));
  }
};

module.exports = {
  getDonationsByEvent,
  updateDonationStatus,
  updateDonationMedicalStatus,
  registerDonation
}; 