const userService = require('../../services/user.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Lấy danh sách người dùng (Admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */ 
const getUsers = async (req, res) => {
  try {
    const { page, limit, search, role, status } = req.query;
    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || '',
      role: role || null,
      status: status !== undefined ? status === 'true' : null
    };
    
    const result = await userService.getUsers(options);
    
    return res.status(200).json(ApiResponse.successWithPagination(
      result.users,
      result.pagination
    ));
  } catch (error) {
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Lấy thông tin người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await userService.getUserById(userId);
    
    return res.status(200).json(ApiResponse.success(user));
  } catch (error) {
    return res.status(404).json(ApiResponse.error(error.message, 404));
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await userService.getUserById(userId);
    
    return res.status(200).json(ApiResponse.success(user));
  } catch (error) {
    return res.status(404).json(ApiResponse.error(error.message, 404));
  }
};

/**
 * Cập nhật thông tin người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    
    // Kiểm tra quyền
    if (req.userId !== userId) {
      const currentUser = await userService.getUserById(req.userId);
      if (currentUser.MaVaiTro !== 'ROLE_ADMIN') {
        return res.status(403).json(ApiResponse.error('Bạn không có quyền cập nhật thông tin người dùng khác', 403));
      }
    }
    
    // Không cho phép cập nhật một số trường nhạy cảm từ API này
    delete userData.Password;
    delete userData.MaVaiTro;
    delete userData.TinhTrang;
    
    const updatedUser = await userService.updateUser(userId, userData);
    
    return res.status(200).json(ApiResponse.success(updatedUser));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * Cập nhật trạng thái người dùng (kích hoạt/khóa) - Admin only
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    if (status === undefined) {
      return res.status(400).json(ApiResponse.error('Trạng thái là bắt buộc', 400));
    }
    
    const updatedUser = await userService.updateUserStatus(userId, status);
    
    return res.status(200).json(ApiResponse.success({
      user: updatedUser,
      message: `Đã ${status ? 'kích hoạt' : 'khóa'} tài khoản thành công`
    }));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * Đổi mật khẩu
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json(ApiResponse.error('Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới', 400));
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json(ApiResponse.error('Mật khẩu mới phải có ít nhất 6 ký tự', 400));
    }
    
    await userService.changePassword(userId, currentPassword, newPassword);
    
    return res.status(200).json(ApiResponse.success({ message: 'Đổi mật khẩu thành công' }));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * Lấy thông tin công khai của người dùng
 * API này không yêu cầu xác thực
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getPublicUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await userService.getPublicUserById(userId);
    
    return res.status(200).json(ApiResponse.success(user));
  } catch (error) {
    return res.status(404).json(ApiResponse.error(error.message, 404));
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserStatus,
  changePassword,
  getPublicUserById
}; 