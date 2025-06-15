const authService = require('../../services/auth.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Đăng ký người dùng mới
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!userData.HoTen || !userData.Email || !userData.MatKhau || !userData.NgaySinh) {
      return res.status(400).json(ApiResponse.error(
        'Vui lòng cung cấp đầy đủ thông tin: họ tên, email, mật khẩu và ngày sinh',
        400
      ));
    }
    
    // Tạo người dùng mới
    const user = await authService.registerUser(userData);
    
    return res.status(201).json(ApiResponse.success({
      id: user.MaNguoiDung,
      ho_ten: user.HoTen,
      email: user.Email
    }, 201));
  } catch (error) {
    // Xử lý lỗi email đã tồn tại
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(ApiResponse.error('Email đã được sử dụng', 400));
    }
    
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Đăng ký cơ sở tình nguyện mới
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const registerCenter = async (req, res) => {
  try {
    const centerData = req.body;
    const file = req.file; // Lấy file từ multer
    
    // Kiểm tra dữ liệu đầu vào
    if (!centerData.TenCoSoTinhNguyen || !centerData.Email || !centerData.MatKhau || !centerData.SDT || !centerData.NguoiPhuTrach) {
      return res.status(400).json(ApiResponse.error(
        'Vui lòng cung cấp đầy đủ thông tin: tên cơ sở, email, mật khẩu, số điện thoại và người phụ trách',
        400
      ));
    }
    
    // Tạo cơ sở tình nguyện mới với file minh chứng
    const center = await authService.registerCenter(centerData, file);
    
    return res.status(201).json(ApiResponse.success({
      IDCoSoTinhNguyen: center.IDCoSoTinhNguyen,
      TenCoSoTinhNguyen: center.TenCoSoTinhNguyen,
      Email: center.Email,
      TinhTrang: center.TinhTrang,
      MinhChung: center.MinhChung,
      message: 'Đăng ký thành công. Cơ sở tình nguyện của bạn đang chờ được phê duyệt.'
    }, 201));
  } catch (error) {
    // Xử lý lỗi email hoặc username đã tồn tại
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(ApiResponse.error('Email hoặc tên đăng nhập đã được sử dụng', 400));
    }
    
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Đăng nhập
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const login = async (req, res) => {
  try {
    const { Email, MatKhau, isCenter } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!Email || !MatKhau) {
      return res.status(400).json(ApiResponse.error('Vui lòng cung cấp Email và MatKhau', 400));
    }
    
    // Xác định loại đăng nhập dựa vào isCenter
    const loginType = isCenter ? 'center' : 'user';
    
    // Xác thực đăng nhập
    const loginData = await authService.login(Email, MatKhau, loginType);
    
    return res.status(200).json(ApiResponse.success(loginData));
  } catch (error) {
    return res.status(401).json(ApiResponse.error(error.message, 401));
  }
};

/**
 * Làm mới token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json(ApiResponse.error('Refresh token là bắt buộc', 400));
    }
    
    // Làm mới token
    const newToken = await authService.refreshToken(refreshToken);
    
    return res.status(200).json(ApiResponse.success(newToken));
  } catch (error) {
    return res.status(401).json(ApiResponse.error(error.message, 401));
  }
};

/**
 * Cập nhật minh chứng cho cơ sở tình nguyện
 * @param {Object} req - Request object
 * @param {Object} res - Response object 
 */
const updateProofFile = async (req, res) => {
  try {
    const centerId = req.params.id;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json(ApiResponse.error('Vui lòng tải lên file minh chứng', 400));
    }
    
    // Cập nhật minh chứng
    const center = await authService.updateProofFile(centerId, file);
    
    return res.status(200).json(ApiResponse.success({
      id: center.IDCoSoTinhNguyen,
      ten: center.TenCoSoTinhNguyen,
      minh_chung: center.MinhChung
    }));
  } catch (error) {
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Đăng xuất
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const logout = (req, res) => {
  // Trong kiến trúc stateless JWT, chỉ cần client xóa token
  return res.status(200).json(ApiResponse.success({ message: 'Đăng xuất thành công' }));
};

module.exports = {
  registerUser,
  registerCenter,
  login,
  refreshToken,
  logout,
  updateProofFile
}; 