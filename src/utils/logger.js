const winston = require('winston');
const colors = require('colors/safe');

// Định nghĩa màu sắc cho các level log
colors.setTheme({
  info: 'green',
  debug: 'blue',
  warn: 'yellow',
  error: 'red'
});

// Định nghĩa format cho console ngắn gọn và rõ ràng
const consoleFormat = winston.format.printf(({ level, message, timestamp, requestId, statusCode, method, url, responseTime, error, sql, ...meta }) => {
  // Thêm màu cho level
  let coloredLevel;
  switch (level) {
    case 'info':
      coloredLevel = colors.info(`[${level.toUpperCase()}]`);
      break;
    case 'debug':
      coloredLevel = colors.debug(`[${level.toUpperCase()}]`);
      break;
    case 'warn':
      coloredLevel = colors.warn(`[${level.toUpperCase()}]`);
      break;
    case 'error':
      coloredLevel = colors.error(`[${level.toUpperCase()}]`);
      break;
    default:
      coloredLevel = `[${level.toUpperCase()}]`;
  }

  // Format log dựa vào loại message
  let logMessage = `${coloredLevel} ${timestamp} `;
  
  // Log API request/response theo format ngắn gọn
  if (message.includes('API Request')) {
    logMessage += `${colors.cyan(method || '')} ${url || ''} ${colors.yellow('requestId=')}${requestId || ''}`;
  } 
  else if (message.includes('API Response')) {
    const statusColor = statusCode >= 400 ? colors.error : statusCode >= 300 ? colors.warn : colors.green;
    logMessage += `${colors.cyan(method || '')} ${url || ''} ${statusColor(statusCode || '')} ${colors.yellow(responseTime + 'ms')} ${colors.yellow('requestId=')}${requestId || ''}`;
  }
  else if (message.includes('SQL Query')) {
    // Hiển thị ngắn gọn cho SQL query
    if (sql) {
      const sqlSummary = sql.substring(0, 50) + (sql.length > 50 ? '...' : '');
      logMessage += `${message}: ${colors.blue(sqlSummary)}`;
    } else {
      logMessage += message;
    }
  }
  else if (message.includes('Error')) {
    // Hiển thị lỗi rõ ràng
    logMessage += `${colors.red(message)}`;
    if (error) {
      logMessage += `\n  ${colors.red('→ ' + error)}`;
    }
  }
  else {
    // Log thông thường
    logMessage += message;
  }
  
  // Thêm meta quan trọng (giới hạn)
  const importantMeta = {};
  
  // Lọc và chỉ hiển thị các meta quan trọng
  if (meta.error && typeof meta.error === 'object') importantMeta.error = meta.error.message || 'Unknown error';
  if (meta.stack && level === 'error') importantMeta.stack = meta.stack;
  if (meta.timing) importantMeta.timing = meta.timing;
  
  // Chỉ hiển thị metadata nếu có dữ liệu quan trọng
  if (Object.keys(importantMeta).length > 0) {
    try {
      logMessage += `\n  ${colors.cyan('→')} ${JSON.stringify(importantMeta)}`;
    } catch (e) {
      // Không làm gì nếu có lỗi khi stringify
    }
  }

  return logMessage;
});

// Định nghĩa format json cho file logs
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

// Tạo logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: fileFormat,
  defaultMeta: { service: 'blood-donation-api' },
  transports: [
    // Log lỗi riêng biệt
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error'
    }),
    
    // Log tất cả
    new winston.transports.File({ 
      filename: 'logs/combined.log'
    }),
    
    // Log ra console với format đẹp
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        consoleFormat
      )
    })
  ]
});

// Hàm tiện ích để log API requests (gọn gàng hơn)
logger.logApiRequest = (req, data = {}) => {
  try {
    // Bỏ qua các trường nhạy cảm
    const safeBody = { ...req.body };
    delete safeBody.password;
    delete safeBody.MatKhau;
    
    logger.info(`API Request`, {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      body: Object.keys(safeBody).length > 0 ? safeBody : undefined,
      query: Object.keys(req.query || {}).length > 0 ? req.query : undefined,
      userId: req.user?.id || 'anonymous',
      userRole: req.user?.role || 'anonymous',
      ...data
    });
  } catch (err) {
    // Đảm bảo lỗi trong logging không làm fail request
    console.error('Error in logApiRequest:', err);
  }
};

// Hàm tiện ích để log API responses (gọn gàng hơn)
logger.logApiResponse = (req, res, data = {}) => {
  try {
    logger.info(`API Response`, {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: data.responseTime || 0,
      userId: req.user?.id || 'anonymous',
      userRole: req.user?.role || 'anonymous'
    });
  } catch (err) {
    // Đảm bảo lỗi trong logging không làm fail response
    console.error('Error in logApiResponse:', err);
  }
};

// Hàm tiện ích để log lỗi gọn gàng hơn
logger.logError = (message, error, metadata = {}) => {
  try {
    logger.error(message, {
      error: error.message || error,
      stack: error.stack,
      ...metadata
    });
  } catch (err) {
    console.error('Error in logError:', err);
  }
};

module.exports = logger; 