const express = require('express');
const authController = require('./auth.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');
const { upload } = require('../../config/cloudinary.config');

const router = express.Router();

// Đăng ký tài khoản người dùng mới
router.post('/register/user', authController.registerUser);

// Đăng ký cơ sở tình nguyện mới (với upload minh chứng)
router.post('/register/center', upload.single('MinhChung'), authController.registerCenter);

// Đăng nhập (hỗ trợ cả người dùng và cơ sở)
router.post('/login', authController.login);

// Làm mới token
router.post('/refresh-token', authController.refreshToken);

// Cập nhật minh chứng cho cơ sở tình nguyện
router.put('/center/:id/proof', verifyToken, upload.single('MinhChung'), authController.updateProofFile);

// Đăng xuất (yêu cầu xác thực)
router.post('/logout', verifyToken, authController.logout);

module.exports = router; 