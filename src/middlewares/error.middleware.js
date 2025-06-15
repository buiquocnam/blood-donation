const logger = require('../utils/logger');
const ApiResponse = require('../utils/apiResponse');

// Middleware bắt lỗi 404 (Not Found)
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log lỗi với các thông tin liên quan - format rõ ràng hơn
  logger.logError(`API Error: ${statusCode} ${req.method} ${req.originalUrl}`, err, {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id || 'anonymous',
    userRole: req.user?.role || 'anonymous',
    statusCode
  });
  
  // Trả về response với format chuẩn
  res.status(statusCode).json(ApiResponse.error(
    err.message,
    statusCode
  ));
};

module.exports = {
  notFound,
  errorHandler,
}; 