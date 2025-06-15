// Import dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
// Import error middlewares
const { notFound, errorHandler } = require('./middlewares/error.middleware');
// Import logger và middleware
const logger = require('./utils/logger');
const { requestLogger, dbLogger } = require('./middlewares/logger.middleware');

// Load environment variables
dotenv.config();

// Tạo thư mục logs nếu không tồn tại
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Import database models and connect
const { sequelize, syncModels } = require('./models');

// Áp dụng logger cho database
dbLogger(sequelize);

// Import routes
const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/users/user.routes');
const locationRoutes = require('./api/locations/location.routes');
const bloodGroupRoutes = require('./api/blood-groups/blood-group.routes');
const eventRoutes = require('./api/events/event.routes');
const donationRoutes = require('./api/donations/donation.routes');
// Các routes khác sẽ được bổ sung sau

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3001", // Chỉ định rõ origin của frontend
  credentials: true // Cho phép credentials (cookies, authorization headers)
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Áp dụng logging middleware
app.use(requestLogger);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/blood-groups', bloodGroupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
// Các routes khác sẽ được bổ sung sau

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng đến với API Hệ thống Quản lý Hiến máu' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Kết nối database và khởi động server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    // Kiểm tra kết nối database
    await sequelize.authenticate();
    logger.info(`Kết nối cơ sở dữ liệu thành công`);
    
    // Đồng bộ hóa các model (không tạo bảng mới)
    await syncModels();
     
    // Khởi động server
    app.listen(PORT, () => {
      logger.info(`✅ Server đang chạy trên cổng ${PORT}`);
    });
  } catch (error) {
    logger.logError('Không thể kết nối cơ sở dữ liệu', error);
    process.exit(1);
  }
};

// Khởi động server
startServer();

module.exports = app; 