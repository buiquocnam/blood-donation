const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const DANGKITOCHUCHIENMAU = sequelize.define('DANGKITOCHUCHIENMAU', {
  IdSuKien: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  IdThongBaoDK: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  IDCoSoTinhNguyen: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  NgayDangKi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  TinhTrangDK: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'CHUA_DUYET',
    comment: 'CHUA_DUYET, DA_DUYET, TU_CHOI',
    validate: {
      isIn: [['CHUA_DUYET', 'DA_DUYET', 'TU_CHOI']]
    }
  },
  SoLuongDK: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  SoLuongDDK: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  TrangThaiSuKien: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'CHUA_DIEN_RA',
    comment: 'CHUA_DIEN_RA, DANG_DIEN_RA, DA_KET_THUC, DA_HUY',
    validate: {
      isIn: [['CHUA_DIEN_RA', 'DANG_DIEN_RA', 'DA_KET_THUC', 'DA_HUY']]
    }
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
  HanDK: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  }
}, {
  tableName: 'DANGKITOCHUCHIENMAU',
  timestamps: false,
});

// Tạo ID đăng ký tổ chức hiến máu mới với định dạng DK + số ngẫu nhiên 8 chữ số
DANGKITOCHUCHIENMAU.generateEventId = async function() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const eventId = `DK${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingEvent = await DANGKITOCHUCHIENMAU.findByPk(eventId);
  if (existingEvent) {
    // Nếu đã tồn tại, tạo ID mới
    return DANGKITOCHUCHIENMAU.generateEventId();
  }
  
  return eventId;
};

module.exports = DANGKITOCHUCHIENMAU; 