const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const DANHMUCDVMAU = sequelize.define('DANHMUCDVMAU', {
  IdDanhMucDVHienMau: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  SoLuongMau: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  GhiChu: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'DANHMUCDVMAU',
  timestamps: false,
});

// Tạo ID danh mục dịch vụ máu mới với định dạng DM + số ngẫu nhiên 8 chữ số
DANHMUCDVMAU.generateServiceId = async function() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const serviceId = `DM${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingService = await DANHMUCDVMAU.findByPk(serviceId);
  if (existingService) {
    // Nếu đã tồn tại, tạo ID mới
    return DANHMUCDVMAU.generateServiceId();
  }
  
  return serviceId;
};

module.exports = DANHMUCDVMAU; 