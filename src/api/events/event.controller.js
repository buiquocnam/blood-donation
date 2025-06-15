const eventService = require('../../services/event.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Lấy danh sách sự kiện đã được phê duyệt
 * API này ai cũng có thể truy cập (không yêu cầu xác thực)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getApprovedEvents = async (req, res) => {
  try {
    // Lấy các tham số truy vấn
    const { page = 1, limit = 10, search, fromDate, toDate, status } = req.query;

    // Lấy danh sách sự kiện với các tùy chọn tìm kiếm
    const result = await eventService.getApprovedEvents({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      fromDate,
      toDate,
      status
    });

    return res.status(200).json(ApiResponse.successWithPagination(
      result.events,
      result.pagination
    ));
  } catch (error) {
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Lấy chi tiết sự kiện theo ID
 * API này ai cũng có thể truy cập (không yêu cầu xác thực)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Lấy chi tiết sự kiện
    const event = await eventService.getEventById(eventId);

    return res.status(200).json(ApiResponse.success(event));
  } catch (error) {
    // Nếu không tìm thấy sự kiện
    if (error.message.includes('không tồn tại')) {
      return res.status(404).json(ApiResponse.error(error.message, 404));
    }
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Lấy danh sách sự kiện sắp diễn ra
 * API này ai cũng có thể truy cập (không yêu cầu xác thực)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Lấy danh sách sự kiện sắp diễn ra
    const events = await eventService.getUpcomingEvents(parseInt(limit, 10));

    return res.status(200).json(ApiResponse.success(events));
  } catch (error) {
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

module.exports = {
  getApprovedEvents,
  getEventById,
  getUpcomingEvents
}; 