const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const DANGKIHIENMAU = sequelize.define('DANGKIHIENMAU', {
  MaDKiHienMau: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  IDNguoiHienMau: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  IDNVDuyet: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  IDBacSi: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  IdSuKien: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  IdDanhMucDVHienMau: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  TrangThaiHienMau: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'CHO_HIEN',
    comment: 'CHO_HIEN, DA_HIENMAU, TU_CHOI',
    validate: {
      isIn: [['CHO_HIEN', 'DA_HIENMAU', 'TU_CHOI']]
    }
  },
  TrangThaiDonDK: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'CHO_DUYET',
    comment: 'CHO_DUYET, DA_DUYET, TU_CHOI',
    validate: {
      isIn: [['CHO_DUYET', 'DA_DUYET', 'TU_CHOI']]
    }
  },
  NgayDangKi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  NgaySua: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ChieuCao: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 300
    }
  },
  CanNang: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 500
    }
  },
  NhietDo: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    validate: {
      min: 30,
      max: 45
    }
  },
  NhipTim: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 30,
      max: 200
    }
  },
  HuyetAp: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  DaTungHienMau: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  TienSuBenh: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  MacBenhHienTai: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ThongTin12ThangQua: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ThongTin6ThangQua: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ThongTin1ThangQua: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ThongTin14NgayQua: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Thuoc7Ngay: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ThongTinPhuNu12ThangQua: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  TTSKKhamSangLoc: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  TTSKSauHien: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  GhiChu: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
}, {
  tableName: 'DANGKIHIENMAU',
  timestamps: false,
});

// Tạo ID đăng ký hiến máu mới với định dạng DKM + số ngẫu nhiên 7 chữ số
DANGKIHIENMAU.generateRegistrationId = async function() {
  const randomNum = Math.floor(1000000 + Math.random() * 9000000);
  const registrationId = `DKM${randomNum}`;
  
  // Kiểm tra xem ID đã tồn tại chưa
  const existingRegistration = await DANGKIHIENMAU.findByPk(registrationId);
  if (existingRegistration) {
    // Nếu đã tồn tại, tạo ID mới
    return DANGKIHIENMAU.generateRegistrationId();
  }
  
  return registrationId;
};

module.exports = DANGKIHIENMAU; 