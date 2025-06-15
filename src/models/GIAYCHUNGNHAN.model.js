const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const GIAYCHUNGNHAN = sequelize.define('GIAYCHUNGNHAN', {
  IdGiayChungNhan: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  MaNguoiDung: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  IdSuKienHienMau: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  NgayCap: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'GIAYCHUNGNHAN',
  timestamps: false,
});

// Tạo ID giấy chứng nhận mới với định dạng GCN + số ngẫu nhiên 7 chữ số
GIAYCHUNGNHAN.generateCertificateId = async function() {
  const randomNum = Math.floor(1000000 + Math.random() * 9000000);
  const certificateId = `GCN${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingCertificate = await GIAYCHUNGNHAN.findByPk(certificateId);
  if (existingCertificate) {
    // Nếu đã tồn tại, tạo ID mới
    return GIAYCHUNGNHAN.generateCertificateId();
  }
  
  return certificateId;
};

module.exports = GIAYCHUNGNHAN; 