const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const QUAN = sequelize.define('QUAN', {
  IdQuan: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  IdThanhPho: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  TenQuan: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'QUAN',
  timestamps: false,
});

module.exports = QUAN; 