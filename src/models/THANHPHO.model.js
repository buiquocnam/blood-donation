const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const THANHPHO = sequelize.define('THANHPHO', {
  IdThanhPho: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  TenThanhPho: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'THANHPHO',
  timestamps: false,
});

module.exports = THANHPHO; 