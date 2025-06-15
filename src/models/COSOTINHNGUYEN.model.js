const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const COSOTINHNGUYEN = sequelize.define('COSOTINHNGUYEN', {
  IDCoSoTinhNguyen: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  TenCoSoTinhNguyen: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  MaVaiTro: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  SDT: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  NguoiPhuTrach: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  IdPhuong: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  DiaChi: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  UserName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  MinhChung: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  MatKhau: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  TinhTrang: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'CHUA_DUYET',
    comment: 'CHUA_DUYET: Cơ sở đang chờ được duyệt, DA_DUYET: Cơ sở đã được duyệt, TU_CHOI: Cơ sở đã bị từ chối hoặc bị khóa',
    validate: {
      isIn: [['CHUA_DUYET', 'DA_DUYET', 'TU_CHOI']]
    }
  },
  NgayTao: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'COSOTINHNGUYEN',
  timestamps: false,
});

// Tạo ID cơ sở tình nguyện mới với định dạng CS + số ngẫu nhiên 8 chữ số
COSOTINHNGUYEN.generateCenterId = async function() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const centerId = `CS${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingCenter = await COSOTINHNGUYEN.findByPk(centerId);
  if (existingCenter) {
    // Nếu đã tồn tại, tạo ID mới
    return COSOTINHNGUYEN.generateCenterId();
  }
  
  return centerId;
};

module.exports = COSOTINHNGUYEN; 