const jwt = require('jsonwebtoken');
const { NGUOIDUNG, VAITRO, COSOTINHNGUYEN } = require('../models');
const { sequelize } = require('../config/db.config');
const { Op } = require('sequelize');
const authConfig = require('../config/auth.config');

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @returns {Promise<Object>} - Người dùng đã tạo
 */
const registerUser = async (userData) => {
  // Tạo mã người dùng mới
  const maNguoiDung = await NGUOIDUNG.generateUserId();
  
  // Nếu không có vai trò, mặc định là người hiến máu
  if (!userData.MaVaiTro) {
    userData.MaVaiTro = 'ROLE_DONOR';
  }
  
  // Tạo người dùng mới
  const user = await NGUOIDUNG.create({
    MaNguoiDung: maNguoiDung,
    ...userData,
    TinhTrangTK: true
  });
  
  return user;
};

/**
 * Đăng ký cơ sở tình nguyện mới
 * @param {Object} centerData - Thông tin cơ sở tình nguyện
 * @param {Object} file - File minh chứng đã upload lên Cloudinary
 * @returns {Promise<Object>} - Cơ sở tình nguyện đã tạo
 */
const registerCenter = async (centerData, file) => {
  // Tạo mã cơ sở tình nguyện mới
  const maCoso = await COSOTINHNGUYEN.generateCenterId();
  
  // Gán vai trò mặc định là ROLE_VOLUNTEER_MANAGER
  if (!centerData.MaVaiTro) {
    centerData.MaVaiTro = 'ROLE_VOLUNTEER_MANAGER';
  }
  
  // Lấy đường dẫn minh chứng từ file đã upload (nếu có)
  let minhChungPath = null;
  if (file) {
    minhChungPath = file.path || null;
  }
  
  // Mặc định tình trạng là chờ duyệt
  const center = await COSOTINHNGUYEN.create({
    IDCoSoTinhNguyen: maCoso,
    ...centerData,
    MinhChung: minhChungPath,
    TinhTrang: 'CHUA_DUYET' // Chờ duyệt
  });
  
  return center;
};

/**
 * Đăng nhập cho người dùng
 * @param {string} Email - Email người dùng
 * @param {string} MatKhau - Mật khẩu
 * @returns {Promise<Object>} - Thông tin đăng nhập và token
 */
const loginUser = async (Email, MatKhau) => {
  // Tìm người dùng theo email
  const user = await NGUOIDUNG.findOne({
    where: { Email }
  });
  
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }
  
  // Kiểm tra mật khẩu (tạm thời so sánh trực tiếp vì chưa băm)
  if (user.MatKhau !== MatKhau) {
    throw new Error('Mật khẩu không chính xác');
  }
  
  // Kiểm tra tài khoản có bị khóa không
  if (user.TinhTrangTK === false) {
    throw new Error('Tài khoản đã bị khóa');
  }
  
  // Tạo JWT token
  const token = jwt.sign(
    { 
      id: user.MaNguoiDung,
      type: 'user' 
    },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiration }
  );
  
  // Tạo refresh token
  const refreshToken = jwt.sign(
    { 
      id: user.MaNguoiDung,
      type: 'user'
    },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtRefreshExpiration }
  );
  
  return {
    MaNguoiDung: user.MaNguoiDung,
    HoTen: user.HoTen,
    Email: user.Email,
    MaVaiTro: user.MaVaiTro,
    UserType: 'user',
    token,
    refreshToken
  };
};

/**
 * Đăng nhập cho cơ sở tình nguyện
 * @param {string} Email - Email của cơ sở
 * @param {string} MatKhau - Mật khẩu
 * @returns {Promise<Object>} - Thông tin đăng nhập và token
 */
const loginCenter = async (Email, MatKhau) => {
  // Tìm cơ sở theo email
  const center = await COSOTINHNGUYEN.findOne({
    where: { Email }
  });
  
  if (!center) {
    throw new Error('Cơ sở tình nguyện không tồn tại');
  }
  
  // Kiểm tra mật khẩu
  if (center.MatKhau !== MatKhau) {
    throw new Error('Mật khẩu không chính xác');
  }
  
  // Kiểm tra tài khoản đã được duyệt chưa
  if (center.TinhTrang !== 'DA_DUYET') {
    throw new Error('Tài khoản đang chờ duyệt hoặc đã bị từ chối');
  }
  
  // Tạo JWT token
  const token = jwt.sign(
    { 
      id: center.IDCoSoTinhNguyen,
      type: 'center'
    },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiration }
  );
  
  // Tạo refresh token
  const refreshToken = jwt.sign(
    { 
      id: center.IDCoSoTinhNguyen,
      type: 'center'
    },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtRefreshExpiration }
  );
  
  return {
    IDCoSoTinhNguyen: center.IDCoSoTinhNguyen,
    TenCoSoTinhNguyen: center.TenCoSoTinhNguyen,
    Email: center.Email,
    MaVaiTro: center.MaVaiTro,
    UserType: 'center',
    token,
    refreshToken
  };
};

/**
 * Đăng nhập chung cho cả người dùng và cơ sở tình nguyện
 * @param {string} Email - Email của người dùng hoặc cơ sở
 * @param {string} MatKhau - Mật khẩu
 * @param {string} loginType - Loại đăng nhập ('user' hoặc 'center')
 * @returns {Promise<Object>} - Thông tin đăng nhập và token
 */
const login = async (Email, MatKhau, loginType = 'user') => {
  try {
    if (loginType === 'user') {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      return await loginUser(Email, MatKhau);
    } else if (loginType === 'center') {
      return await loginCenter(Email, MatKhau);
    } else {
      throw new Error('Loại đăng nhập không hợp lệ');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Làm mới token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - Token mới
 */
const refreshToken = async (refreshToken) => {
  try {
    // Xác thực refresh token
    const decoded = jwt.verify(refreshToken, authConfig.jwtSecret);
    
    // Tạo token mới
    const newToken = jwt.sign(
      { 
        id: decoded.id,
        type: decoded.type || 'user'
      },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiration }
    );
    
    return {
      accessToken: newToken
    };
  } catch (error) {
    throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
  }
};

/**
 * Cập nhật file minh chứng cho cơ sở tình nguyện
 * @param {string} centerId - ID cơ sở tình nguyện 
 * @param {Object} file - File minh chứng mới
 * @returns {Promise<Object>} - Cơ sở tình nguyện sau khi cập nhật
 */
const updateProofFile = async (centerId, file) => {
  const center = await COSOTINHNGUYEN.findByPk(centerId);
  
  if (!center) {
    throw new Error('Không tìm thấy cơ sở tình nguyện');
  }
  
  // Lấy đường dẫn minh chứng từ file đã upload (nếu có)
  let minhChungPath = null;
  if (file) {
    minhChungPath = file.path || null;
  }
  
  // Cập nhật minh chứng
  await center.update({
    MinhChung: minhChungPath
  });
  
  return center;
};

module.exports = {
  registerUser,
  registerCenter,
  login,
  refreshToken,
  updateProofFile
}; 