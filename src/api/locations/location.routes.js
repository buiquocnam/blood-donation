const express = require('express');
const locationController = require('./location.controller');

const router = express.Router();

// Lấy danh sách thành phố
router.get('/cities', locationController.getCities);

// Lấy danh sách quận theo thành phố
router.get('/cities/:cityId/districts', locationController.getDistrictsByCity);

// Lấy danh sách phường theo quận
router.get('/districts/:districtId/wards', locationController.getWardsByDistrict);

// Lấy thông tin đầy đủ của địa chỉ (phường, quận, thành phố)
router.get('/wards/:wardId/full-address', locationController.getFullAddress);

module.exports = router; 