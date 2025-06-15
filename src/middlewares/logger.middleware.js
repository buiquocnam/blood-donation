const morgan = require('morgan');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Tạo token request ID cho mỗi request
morgan.token('id', (req) => req.id);

// Tạo token user ID từ user trong request
morgan.token('userId', (req) => req.user ? req.user.id : 'anonymous');

// Tạo token user role từ user trong request
morgan.token('userRole', (req) => req.user ? req.user.role : 'anonymous');

// Tạo token cho response time - sửa lỗi process.hrtime
morgan.token('response-time', (req, res) => {
  // Sử dụng responseTime đã được tính toán và lưu trữ
  return res.responseTime ? res.responseTime.toFixed(2) : '0.00';
});

// Format JSON cho morgan
const jsonFormat = (tokens, req, res) => {
  return JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    'time': tokens['date'](req, res, 'iso'),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'request-id': tokens['id'](req, res),
    'user-id': tokens['userId'](req, res),
    'user-role': tokens['userRole'](req, res),
    'response-time': `${tokens['response-time'](req, res)} ms`
  });
};

// Middleware để gán request ID và start time
const requestLogger = (req, res, next) => {
  // Gán unique ID cho mỗi request
  req.id = uuidv4();
  
  // Lưu thời gian bắt đầu request
  const startHrTime = process.hrtime();
  
  // Lưu method và URL ban đầu
  req._method = req.method;
  req._url = req.originalUrl;

  // Log request
  logger.logApiRequest(req);

  // Lắng nghe sự kiện "finish" để log response
  res.on('finish', () => {
    // Tính thời gian phản hồi
    const endHrTime = process.hrtime(startHrTime);
    const responseTimeMs = endHrTime[0] * 1000 + endHrTime[1] / 1000000;
    
    // Lưu responseTime vào res để token response-time có thể sử dụng
    res.responseTime = responseTimeMs;
    
    // Log response
    logger.logApiResponse(req, res, { responseTime: responseTimeMs.toFixed(2) });
  });
  
  next();
};

// Middleware để log database operations
const dbLogger = (sequelize) => {
  if (process.env.NODE_ENV !== 'production') {
    // Log queries trong development mode - format gọn hơn
    sequelize.options.logging = (sql, timing) => {
      try {
        // Trích xuất loại query (SELECT, INSERT, UPDATE, DELETE)
        const queryType = sql.trim().substring(0, 10).split(' ')[0];
        const table = sql.includes('FROM') 
          ? sql.split('FROM')[1].split(' ')[1].replace(/[\[\]]/g, '')
          : sql.includes('INTO') 
            ? sql.split('INTO')[1].split(' ')[1].replace(/[\[\]]/g, '')
            : sql.includes('UPDATE') 
              ? sql.split('UPDATE')[1].split(' ')[1].replace(/[\[\]]/g, '')
              : 'unknown';
              
        logger.debug(`SQL Query Executed`, {
          sql: sql,
          queryType,
          table,
          timing: typeof timing === 'object' ? 'N/A' : (timing ? `${timing}ms` : 'N/A')
        });
      } catch (error) {
        // Nếu không thể parse được SQL, sử dụng phương pháp đơn giản
        logger.debug(`SQL Query Executed`, {
          sql: sql.slice(0, 100) + (sql.length > 100 ? '...' : ''),
          timing: typeof timing === 'object' ? 'N/A' : (timing ? `${timing}ms` : 'N/A')
        });
      }
    };
  } else {
    // Trong production mode, chỉ log timing nhưng không log query text
    sequelize.options.logging = (sql, timing) => {
      if (timing > 100) { // Chỉ log những query chậm > 100ms
        logger.debug(`Slow SQL Query Detected`, {
          timing: `${timing}ms`
        });
      }
    };
  }
};

// Simple morgan format đơn giản hơn
const morganFormat = ':method :url :status :response-time ms';

module.exports = {
  requestLogger,
  dbLogger,
  morganLogger: morgan(morganFormat, {
    skip: (req, res) => {
      // Bỏ qua logging với morgan nếu chúng ta đã sử dụng winston
      return true;
    }
  })
}; 