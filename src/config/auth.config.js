module.exports = {
  // Khóa bí mật để tạo và xác thực JWT token
  jwtSecret: process.env.JWT_SECRET || 'hienmau-jwt-secret-key',
  
  // Thời gian hết hạn của token (24 giờ)
  jwtExpiration: process.env.JWT_EXPIRATION || 86400,
  
  // Thời gian hết hạn của refresh token (7 ngày)
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || 604800,
}; 