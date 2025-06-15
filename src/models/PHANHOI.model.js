const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const PHANHOI = sequelize.define('PHANHOI', {
  MaPhanHoi: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  MaDKiHienMau: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  TinhTrangMoTa: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  NgayPhanHoi: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'PHANHOI',
  timestamps: false,
});

// Tạo mã phản hồi mới với định dạng PH + số ngẫu nhiên 8 chữ số
PHANHOI.generateFeedbackId = async function() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const feedbackId = `PH${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingFeedback = await PHANHOI.findByPk(feedbackId);
  if (existingFeedback) {
    // Nếu đã tồn tại, tạo ID mới
    return PHANHOI.generateFeedbackId();
  }
  
  return feedbackId;
};

module.exports = PHANHOI; 