const express = require('express');
const donationController = require('./donation.controller');
const { verifyToken, checkRoles } = require('../../middlewares/auth.middleware');
const { VAITRO } = require('../../models');

const router = express.Router();

// Đăng ký hiến máu (Yêu cầu đăng nhập)
router.post('/register', verifyToken, donationController.registerDonation);

// Lấy danh sách đăng ký hiến máu theo sự kiện (Yêu cầu xác thực và phân quyền)
router.get('/event/:eventId', 
  verifyToken, 
  checkRoles([VAITRO.ROLES.MEDICAL_STAFF, VAITRO.ROLES.DOCTOR, VAITRO.ROLES.ADMIN, VAITRO.ROLES.BLOOD_DIRECTOR]), 
  donationController.getDonationsByEvent
);

// Cập nhật trạng thái đơn đăng ký hiến máu (Chỉ nhân viên y tế, director và admin)
router.put('/:id/status', 
  verifyToken, 
  checkRoles([VAITRO.ROLES.MEDICAL_STAFF, VAITRO.ROLES.ADMIN, VAITRO.ROLES.BLOOD_DIRECTOR]), 
  donationController.updateDonationStatus
);

// Cập nhật thông tin sức khỏe và trạng thái hiến máu (Bác sĩ, nhân viên y tế và admin)
router.put('/:id/medical-status', 
  verifyToken, 
  checkRoles([VAITRO.ROLES.DOCTOR, VAITRO.ROLES.MEDICAL_STAFF, VAITRO.ROLES.ADMIN]), 
  donationController.updateDonationMedicalStatus
);

module.exports = router; 