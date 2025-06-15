const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const PHUONG = sequelize.define('PHUONG', {
  IdPhuong: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  IdQuan: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  TenPhuong: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'PHUONG',
  timestamps: false,
});

module.exports = PHUONG; 