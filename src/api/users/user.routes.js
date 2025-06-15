const express = require('express');
const userController = require('./user.controller');
const { verifyToken, isAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Route công khai không yêu cầu đăng nhập
router.get('/public/:id', userController.getPublicUserById);

// Áp dụng middleware xác thực cho các route còn lại
router.use(verifyToken);

// Routes chỉ dành cho Admin
// Lấy danh sách người dùng
router.get('/', isAdmin, userController.getUsers);

// Routes cho mọi người dùng đã đăng nhập
// Lấy thông tin người dùng hiện tại
router.get('/profile', userController.getCurrentUser);
// Lấy thông tin người dùng khác
router.get('/:id', userController.getUserById);

// Cập nhật thông tin người dùng hiện tại
router.put('/profile', userController.updateUser);
// Admin cập nhật trạng thái người dùng
router.put('/:id/status', isAdmin, userController.updateUserStatus);
// Đổi mật khẩu
router.put('/password', userController.changePassword);

module.exports = router; 