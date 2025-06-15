const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const THONGBAODKTOCHUC = sequelize.define('THONGBAODKTOCHUC', {
  IdThongBaoDK: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  IDNguoiTao: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  TieuDe: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  NoiDung: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  SoLuongMauHien: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  HanDangKi: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  TgBatDauDK: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  TgKetThucDK: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  HanDK: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  NgayDang: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  NgaySua: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  TgBatDauSK: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  TgKetThucSK: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'THONGBAODKTOCHUC',
  timestamps: false,
});

// Tạo ID thông báo mới với định dạng TB + số ngẫu nhiên 8 chữ số
THONGBAODKTOCHUC.generateNotificationId = async function() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const notificationId = `TB${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingNotification = await THONGBAODKTOCHUC.findByPk(notificationId);
  if (existingNotification) {
    // Nếu đã tồn tại, tạo ID mới
    return THONGBAODKTOCHUC.generateNotificationId();
  }
  
  return notificationId;
};

module.exports = THONGBAODKTOCHUC; 