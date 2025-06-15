const jwt = require('jsonwebtoken');
const models = require('../models');
const authConfig = require('../config/auth.config');

// Lấy models từ đối tượng models để đảm bảo đúng tên
const { NGUOIDUNG, COSOTINHNGUYEN, VAITRO } = models;

// Middleware xác thực JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Không có token được cung cấp!' });
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    req.userId = decoded.id;
    req.userType = decoded.type || 'user'; // Mặc định là user nếu không có type
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Không được phép! Token không hợp lệ hoặc đã hết hạn.' });
  }
};

// Middleware kiểm tra vai trò người dùng
const checkRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (req.userType !== 'user') {
        return res.status(403).json({ message: 'Chỉ tài khoản người dùng mới có quyền truy cập!' });
      }
      
      const user = await NGUOIDUNG.findByPk(req.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
      }
      
      if (allowedRoles.includes(user.MaVaiTro)) {
        // Lưu vai trò của người dùng để sử dụng trong controller
        req.userRole = user.MaVaiTro;
        return next();
      }
      
      return res.status(403).json({ 
        message: 'Bạn không có quyền truy cập tính năng này!',
        requiredRoles: allowedRoles,
        currentRole: user.MaVaiTro
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};

// Middleware kiểm tra là người dùng (không phải cơ sở)
const isUser = async (req, res, next) => {
  if (req.userType !== 'user') {
    return res.status(403).json({ message: 'Chỉ người dùng cá nhân mới có quyền truy cập!' });
  }
  
  try {
    const user = await NGUOIDUNG.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Middleware kiểm tra là cơ sở tình nguyện
const isVolunteerCenter = async (req, res, next) => {
  if (req.userType !== 'center') {
    return res.status(403).json({ message: 'Chỉ cơ sở tình nguyện mới có quyền truy cập!' });
  }
  
  try {
    const center = await COSOTINHNGUYEN.findByPk(req.userId);
    
    if (!center) {
      return res.status(404).json({ message: 'Không tìm thấy cơ sở tình nguyện!' });
    }
    
    if (center.TinhTrang !== 'DA_DUYET') {
      return res.status(403).json({ message: 'Cơ sở tình nguyện chưa được phê duyệt!' });
    }
    
    req.center = center;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Middleware kiểm tra vai trò Admin
const isAdmin = async (req, res, next) => {
  if (req.userType !== 'user') {
    return res.status(403).json({ message: 'Không có quyền Admin!' });
  }
  
  try {
    const user = await NGUOIDUNG.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }
    
    if (user.MaVaiTro === 'ROLE_ADMIN') {
      return next();
    }
    
    return res.status(403).json({ message: 'Yêu cầu quyền Admin!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Middleware kiểm tra vai trò Bác sĩ
const isDoctor = async (req, res, next) => {
  if (req.userType !== 'user') {
    return res.status(403).json({ message: 'Không có quyền Bác sĩ!' });
  }
  
  try {
    const user = await NGUOIDUNG.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }
    
    if (user.MaVaiTro === 'ROLE_DOCTOR') {
      return next();
    }
    
    return res.status(403).json({ message: 'Yêu cầu quyền Bác sĩ!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Middleware kiểm tra vai trò Nhân viên y tế
const isMedicalStaff = async (req, res, next) => {
  if (req.userType !== 'user') {
    return res.status(403).json({ message: 'Không có quyền Nhân viên y tế!' });
  }
  
  try {
    const user = await NGUOIDUNG.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }
    
    if (user.MaVaiTro === 'ROLE_MEDICAL_STAFF' || user.MaVaiTro === 'ROLE_DOCTOR') {
      return next();
    }
    
    return res.status(403).json({ message: 'Yêu cầu quyền Nhân viên y tế!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Middleware kiểm tra vai trò Giám đốc ngân hàng máu
const isBloodDirector = async (req, res, next) => {
  if (req.userType !== 'user') {
    return res.status(403).json({ message: 'Không có quyền Giám đốc ngân hàng máu!' });
  }
  
  try {
    const user = await NGUOIDUNG.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }
    
    if (user.MaVaiTro === 'ROLE_BLOOD_DIRECTOR') {
      return next();
    }
    
    return res.status(403).json({ message: 'Yêu cầu quyền Giám đốc ngân hàng máu!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Middleware kiểm tra vai trò Quản lý cơ sở tình nguyện
const isVolunteerManager = async (req, res, next) => {
  if (req.userType !== 'center') {
    return res.status(403).json({ message: 'Không có quyền Quản lý cơ sở tình nguyện!' });
  }
  
  try {
    const center = await COSOTINHNGUYEN.findByPk(req.userId);
    
    if (!center) {
      return res.status(404).json({ message: 'Không tìm thấy cơ sở tình nguyện!' });
    }
    
    if (center.MaVaiTro === 'ROLE_VOLUNTEER_MANAGER' && center.TinhTrang === 'DA_DUYET') {
      return next();
    }
    
    return res.status(403).json({ message: 'Yêu cầu quyền Quản lý cơ sở tình nguyện đã được phê duyệt!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const authMiddleware = {
  verifyToken,
  checkRoles,
  isUser,
  isVolunteerCenter,
  isAdmin,
  isDoctor,
  isMedicalStaff,
  isBloodDirector,
  isVolunteerManager
};

module.exports = authMiddleware; 