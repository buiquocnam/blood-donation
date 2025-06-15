const { sequelize } = require('../config/db.config');
const NGUOIDUNG = require('./NGUOIDUNG.model');
const VAITRO = require('./VAITRO.model');
const NHOMMAU = require('./NHOMMAU.model');
const THANHPHO = require('./THANHPHO.model');
const QUAN = require('./QUAN.model');
const PHUONG = require('./PHUONG.model');
const COSOTINHNGUYEN = require('./COSOTINHNGUYEN.model');
const DANGKITOCHUCHIENMAU = require('./DANGKITOCHUCHIENMAU.model');
const DANGKIHIENMAU = require('./DANGKIHIENMAU.model');
const DANHMUCDVMAU = require('./DANHMUCDVMAU.model');
const THONGBAODKTOCHUC = require('./THONGBAODKTOCHUC.model');
const GIAYCHUNGNHAN = require('./GIAYCHUNGNHAN.model');
const PHANHOI = require('./PHANHOI.model');

// Định nghĩa mối quan hệ giữa các bảng
// Quan hệ của người dùng
NGUOIDUNG.belongsTo(VAITRO, { foreignKey: 'MaVaiTro', as: 'VAITRO' });
VAITRO.hasMany(NGUOIDUNG, { foreignKey: 'MaVaiTro', as: 'NGUOIDUNG' });

NGUOIDUNG.belongsTo(PHUONG, { foreignKey: 'IdPhuong', as: 'PHUONG' });
PHUONG.hasMany(NGUOIDUNG, { foreignKey: 'IdPhuong', as: 'NGUOIDUNG' });

NGUOIDUNG.belongsTo(NHOMMAU, { foreignKey: 'MaNhomMau', as: 'NHOMMAU' });
NHOMMAU.hasMany(NGUOIDUNG, { foreignKey: 'MaNhomMau', as: 'NGUOIDUNG' });

// Quan hệ của cơ sở tình nguyện
COSOTINHNGUYEN.belongsTo(VAITRO, { foreignKey: 'MaVaiTro', as: 'VAITRO' });
VAITRO.hasMany(COSOTINHNGUYEN, { foreignKey: 'MaVaiTro', as: 'COSOTINHNGUYEN' });

COSOTINHNGUYEN.belongsTo(PHUONG, { foreignKey: 'IdPhuong', as: 'PHUONG' });
PHUONG.hasMany(COSOTINHNGUYEN, { foreignKey: 'IdPhuong', as: 'COSOTINHNGUYEN' });

// Quan hệ của thông báo đăng ký tổ chức
THONGBAODKTOCHUC.belongsTo(NGUOIDUNG, { foreignKey: 'IDNguoiTao', as: 'NGUOITAO' });
NGUOIDUNG.hasMany(THONGBAODKTOCHUC, { foreignKey: 'IDNguoiTao', as: 'THONGBAODKTOCHUC' });

// Quan hệ của đăng ký tổ chức hiến máu
DANGKITOCHUCHIENMAU.belongsTo(COSOTINHNGUYEN, { foreignKey: 'IDCoSoTinhNguyen', as: 'COSOTINHNGUYEN' }); 
COSOTINHNGUYEN.hasMany(DANGKITOCHUCHIENMAU, { foreignKey: 'IDCoSoTinhNguyen', as: 'DANGKITOCHUCHIENMAU' });

DANGKITOCHUCHIENMAU.belongsTo(THONGBAODKTOCHUC, { foreignKey: 'IdThongBaoDK', as: 'THONGBAODKTOCHUC' });
THONGBAODKTOCHUC.hasMany(DANGKITOCHUCHIENMAU, { foreignKey: 'IdThongBaoDK', as: 'DANGKITOCHUCHIENMAU' });

// Quan hệ của đăng ký hiến máu
DANGKIHIENMAU.belongsTo(DANGKITOCHUCHIENMAU, { foreignKey: 'IdSuKien', as: 'DANGKITOCHUCHIENMAU' });
DANGKITOCHUCHIENMAU.hasMany(DANGKIHIENMAU, { foreignKey: 'IdSuKien', as: 'DANGKIHIENMAU' });

DANGKIHIENMAU.belongsTo(NGUOIDUNG, { foreignKey: 'IDNguoiHienMau', as: 'NGUOIHIENMAU' });
NGUOIDUNG.hasMany(DANGKIHIENMAU, { foreignKey: 'IDNguoiHienMau', as: 'DANGKIHIENMAU' });

DANGKIHIENMAU.belongsTo(NGUOIDUNG, { foreignKey: 'IDNVDuyet', as: 'NVDUYET' });
DANGKIHIENMAU.belongsTo(NGUOIDUNG, { foreignKey: 'IDBacSi', as: 'BACSI' });

DANGKIHIENMAU.belongsTo(DANHMUCDVMAU, { foreignKey: 'IdDanhMucDVHienMau', as: 'DANHMUCDVMAU' });
DANHMUCDVMAU.hasMany(DANGKIHIENMAU, { foreignKey: 'IdDanhMucDVHienMau', as: 'DANGKIHIENMAU' });

// Quan hệ của giấy chứng nhận
GIAYCHUNGNHAN.belongsTo(NGUOIDUNG, { foreignKey: 'MaNguoiDung', as: 'NGUOIDUNG' });
NGUOIDUNG.hasMany(GIAYCHUNGNHAN, { foreignKey: 'MaNguoiDung', as: 'GIAYCHUNGNHAN' });

GIAYCHUNGNHAN.belongsTo(DANGKITOCHUCHIENMAU, { foreignKey: 'IdSuKienHienMau', as: 'DANGKITOCHUCHIENMAU' });
DANGKITOCHUCHIENMAU.hasMany(GIAYCHUNGNHAN, { foreignKey: 'IdSuKienHienMau', as: 'GIAYCHUNGNHAN' });

// Quan hệ của phản hồi
PHANHOI.belongsTo(DANGKIHIENMAU, { foreignKey: 'MaDKiHienMau', as: 'DANGKIHIENMAU' });
DANGKIHIENMAU.hasMany(PHANHOI, { foreignKey: 'MaDKiHienMau', as: 'PHANHOI' });

// Quan hệ của vị trí địa lý
QUAN.belongsTo(THANHPHO, { foreignKey: 'IdThanhPho', as: 'THANHPHO' });
THANHPHO.hasMany(QUAN, { foreignKey: 'IdThanhPho', as: 'QUAN' });

PHUONG.belongsTo(QUAN, { foreignKey: 'IdQuan', as: 'QUAN' });
QUAN.hasMany(PHUONG, { foreignKey: 'IdQuan', as: 'PHUONG' });

// Đồng bộ hóa tất cả các mô hình với cơ sở dữ liệu
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('Các mô hình đã được đồng bộ hóa thành công.');
  } catch (error) {
    console.error('Lỗi đồng bộ hóa mô hình:', error);
  }
};

module.exports = {
  sequelize,
  syncModels,
  NGUOIDUNG,
  VAITRO,
  NHOMMAU,
  THANHPHO,
  QUAN,
  PHUONG,
  COSOTINHNGUYEN,
  DANGKITOCHUCHIENMAU,
  DANGKIHIENMAU,
  DANHMUCDVMAU,
  THONGBAODKTOCHUC,
  GIAYCHUNGNHAN,
  PHANHOI
}; 