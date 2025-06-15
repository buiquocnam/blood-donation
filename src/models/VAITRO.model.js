const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const VAITRO = sequelize.define('VAITRO', {
  MaVaiTro: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  TenVaiTro: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  MoTa: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'VAITRO',
  timestamps: false,
});

// Định nghĩa các hằng số vai trò hệ thống
VAITRO.ROLES = {
  GUEST: 'ROLE_GUEST',         // Khách vãng lai
  DONOR: 'ROLE_DONOR',         // Người hiến máu
  MEDICAL_STAFF: 'ROLE_MEDICAL_STAFF', // Nhân viên y tế
  DOCTOR: 'ROLE_DOCTOR',       // Bác sĩ
  VOLUNTEER_MANAGER: 'ROLE_VOLUNTEER_MANAGER', // Trưởng cơ sở tình nguyện
  BLOOD_DIRECTOR: 'ROLE_BLOOD_DIRECTOR', // Giám đốc ngân hàng máu
  ADMIN: 'ROLE_ADMIN',         // Quản trị viên hệ thống
};

module.exports = VAITRO; 