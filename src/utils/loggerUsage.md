# Hướng dẫn sử dụng Logger

Hệ thống logging đã được thiết lập để ghi lại thông tin của tất cả API requests, responses và các hoạt động khác trong hệ thống. Dưới đây là cách sử dụng logger trong dự án.

## Cài đặt các dependency

```bash
npm install winston morgan colors morgan-json uuid
```

## Cách sử dụng Logger trong code

### 1. Import logger

```javascript
const logger = require('../utils/logger');
```

### 2. Các level log

Logger hỗ trợ các level sau:

```javascript
logger.error('Đây là thông báo lỗi nghiêm trọng');
logger.warn('Đây là cảnh báo');
logger.info('Đây là thông tin thông thường');
logger.debug('Đây là thông tin debug');
```

### 3. Log với metadata

```javascript
logger.info('Đăng ký thành công', {
  userId: 'ND12345',
  email: 'user@example.com',
  role: 'ROLE_DONOR'
});
```

### 4. Log API requests/responses

Requests và responses sẽ được log tự động với middleware đã được cài đặt. Tuy nhiên, bạn cũng có thể chủ động log:

```javascript
// Log request 
logger.logApiRequest(req, { additionalData: 'any value' });

// Log response
logger.logApiResponse(req, res, { responseTime: 123 });
```

### 5. Log lỗi với stack trace

```javascript
try {
  // Some code that might throw an error
} catch (error) {
  logger.error(`Lỗi xảy ra: ${error.message}`, {
    stack: error.stack,
    additionalInfo: 'More context about the error'
  });
}
```

## Format log

### Logs trong console

Logs trong console sẽ có màu sắc tùy theo level:
- ERROR: màu đỏ
- WARN: màu vàng
- INFO: màu xanh lá
- DEBUG: màu xanh dương

### Logs trong file

Logs được lưu trong thư mục `/logs`:
- `combined.log`: Tất cả logs
- `error.log`: Chỉ logs ở level error

## Các metadata được log tự động

### API Requests
- requestId: ID duy nhất cho mỗi request
- ip: IP của client
- userId: ID của người dùng đang thực hiện request (nếu đã đăng nhập)
- userRole: Vai trò của người dùng
- method: HTTP method
- url: URL của request
- body: Body của request (đã loại bỏ thông tin nhạy cảm như mật khẩu)
- query: Query parameters
- headers: Headers (đã loại bỏ authorization token)

### API Responses
- requestId: ID của request tương ứng
- statusCode: HTTP status code
- responseTime: Thời gian xử lý request (ms)
- userId: ID của người dùng
- userRole: Vai trò của người dùng

## Kết hợp với các công cụ giám sát

Logger đã được cấu hình để sử dụng định dạng JSON, rất phù hợp để tích hợp với các công cụ giám sát như ELK Stack, CloudWatch, Datadog, etc.

## Các lưu ý bảo mật

- Không bao giờ log thông tin nhạy cảm như mật khẩu, token
- Trong môi trường production, logs level debug sẽ bị tắt
- Thông tin stack trace chỉ được hiển thị trong môi trường development 