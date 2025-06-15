const express = require('express');
const bloodGroupController = require('./blood-group.controller');

const router = express.Router();

// Lấy danh sách nhóm máu
router.get('/', bloodGroupController.getBloodGroups);

// Lấy thông tin chi tiết nhóm máu
router.get('/:id', bloodGroupController.getBloodGroupById);

module.exports = router; 