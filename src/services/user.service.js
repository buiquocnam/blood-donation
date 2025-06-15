const { NGUOIDUNG } = require('../models');
const { Op } = require('sequelize');

/**
 * Lấy danh sách người dùng với phân trang và lọc
 * @param {Object} options - Tùy chọn truy vấn
 * @returns {Promise<Object>} - Danh sách người dùng và thông tin phân trang
 */
const getUsers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    role = null,
    status = null
  } = options;

  // Tính toán offset cho phân trang
  const offset = (page - 1) * limit;

  // Xây dựng điều kiện tìm kiếm
  const where = {};

  if (search) {
    where[Op.or] = [
      { HoTen: { [Op.like]: `%${search}%` } },
      { Email: { [Op.like]: `%${search}%` } },
      { SDT: { [Op.like]: `%${search}%` } }
    ];
  }

  if (role) {
    where.MaVaiTro = role;
  }

  if (status !== null) {
    where.TinhTrangTK = status;
  }

  // Thực hiện truy vấn
  const { count, rows } = await NguoiDung.findAndCountAll({
    where,
    limit,
    offset,
    order: [['NgayTao', 'DESC']]
  });

  // Tính toán thông tin phân trang
  const totalPages = Math.ceil(count / limit);

  return {
    users: rows,
    pagination: {
      total: count,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    }
  };
};

/**
 * Lấy thông tin chi tiết người dùng
 * @param {string} userId - Mã người dùng
 * @returns {Promise<Object>} - Thông tin người dùng
 */
const getUserById = async (userId) => {
  const user = await NGUOIDUNG.findByPk(userId);

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

/**
 * Lấy thông tin công khai của người dùng
 * @param {string} userId - Mã người dùng
 * @returns {Promise<Object>} - Thông tin công khai của người dùng
 */
const getPublicUserById = async (userId) => {
  const user = await NGUOIDUNG.findByPk(userId, {
    attributes: ['MaNguoiDung', 'HoTen', 'MaNhomMau',  'AnhDaiDien', 'NgaySinh', 'GioiTinh', 'SDT', 'Email', 'tenDiaChi', 'CCCD']
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  return user;
};

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - Mã người dùng
 * @param {Object} userData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Người dùng đã cập nhật
 */
const updateUser = async (userId, userData) => {
  const user = await NGUOIDUNG.findByPk(userId);

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // Cập nhật thông tin
  await user.update(userData);

  return user;
};

/**
 * Thay đổi trạng thái hoạt động của người dùng
 * @param {string} userId - Mã người dùng
 * @param {boolean} status - Trạng thái mới
 * @returns {Promise<Object>} - Người dùng đã cập nhật
 */
const updateUserStatus = async (userId, status) => {
  const user = await NGUOIDUNG.findByPk(userId);

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // Cập nhật trạng thái
  await user.update({
    TinhTrangTK: status,
    NgayKhoa: status ? null : new Date()
  });

  return user;
};

/**
 * Đổi mật khẩu người dùng
 * @param {string} userId - Mã người dùng
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise<boolean>} - Kết quả
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await NguoiDung.findByPk(userId);

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // Kiểm tra mật khẩu hiện tại (tạm thời so sánh trực tiếp)
  if (user.MatKhau !== currentPassword) {
    throw new Error('Mật khẩu hiện tại không chính xác');
  }

  // Cập nhật mật khẩu mới
  await user.update({ MatKhau: newPassword });

  return true;
};

module.exports = {
  getUsers,
  getUserById,
  getPublicUserById,
  updateUser,
  updateUserStatus,
  changePassword
}; 