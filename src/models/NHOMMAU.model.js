const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const NHOMMAU = sequelize.define('NHOMMAU', {
  MaNhomMau: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  MoTaNhomMau: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  DoPhoBien: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Độ phổ biến (%)',
  },
  GhiChu: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Thông tin về nhóm máu có thể cho/nhận',
  },
  NgayTao: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  NgaySua: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'NHOMMAU',
  timestamps: false,
});

module.exports = NHOMMAU; 