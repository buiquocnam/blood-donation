const locationService = require('../../services/location.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Lấy danh sách thành phố
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getCities = async (req, res) => {
  try {
    const cities = await locationService.getCities();
    res.status(200).json(ApiResponse.success(cities));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Lấy danh sách quận theo thành phố
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getDistrictsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    
    if (!cityId) {
      return res.status(400).json(ApiResponse.error('Vui lòng cung cấp mã thành phố', 400));
    }
    
    const districts = await locationService.getDistrictsByCity(cityId);
    res.status(200).json(ApiResponse.success(districts));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Lấy danh sách phường theo quận
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getWardsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;
    
    if (!districtId) {
      return res.status(400).json(ApiResponse.error('Vui lòng cung cấp mã quận', 400));
    }
    
    const wards = await locationService.getWardsByDistrict(districtId);
    res.status(200).json(ApiResponse.success(wards));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Lấy thông tin đầy đủ của địa chỉ (phường, quận, thành phố)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getFullAddress = async (req, res) => {
  try {
    const { wardId } = req.params;
    
    if (!wardId) {
      return res.status(400).json(ApiResponse.error('Vui lòng cung cấp mã phường', 400));
    }
    
    const addressInfo = await locationService.getFullAddressInfo(wardId);
    res.status(200).json(ApiResponse.success(addressInfo));
  } catch (error) {
    res.status(404).json(ApiResponse.error(error.message, 404));
  }
};

module.exports = {
  getCities,
  getDistrictsByCity,
  getWardsByDistrict,
  getFullAddress
}; 