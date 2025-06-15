const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const NGUOIDUNG = sequelize.define('NGUOIDUNG', {
  MaNguoiDung: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  MaVaiTro: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  IdPhuong: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  MaNhomMau: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  HoTen: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  NgaySinh: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  SDT: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  MatKhau: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  GioiTinh: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: '0: Female, 1: Male',
  },
  tenDiaChi: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  CCCD: {
    type: DataTypes.STRING(12),
    allowNull: true,
  },
  AnhDaiDien: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  TinhTrangTK: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    comment: '0: Inactive, 1: Active',
  },
  NgayTao: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  NgayKhoa: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'NGUOIDUNG',
  timestamps: false,
});

// Tạo mã người dùng mới với định dạng ND + số ngẫu nhiên 8 chữ số
NGUOIDUNG.generateUserId = async function() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const userId = `ND${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingUser = await NGUOIDUNG.findByPk(userId);
  if (existingUser) {
    // Nếu đã tồn tại, tạo ID mới
    return NGUOIDUNG.generateUserId();
  }
  
  return userId;
};

module.exports = NGUOIDUNG; 