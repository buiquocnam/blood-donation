const bloodGroupService = require('../../services/blood-group.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Lấy danh sách tất cả nhóm máu
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getBloodGroups = async (req, res) => {
  try {
    const bloodGroups = await bloodGroupService.getBloodGroups();
    return res.status(200).json(ApiResponse.success(bloodGroups));
  } catch (error) {
    return res.status(500).json(ApiResponse.error(error.message, 500));
  }
};

/**
 * Lấy thông tin chi tiết nhóm máu
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getBloodGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const bloodGroup = await bloodGroupService.getBloodGroupById(id);
    return res.status(200).json(ApiResponse.success(bloodGroup));
  } catch (error) {
    return res.status(404).json(ApiResponse.error(error.message, 404));
  }
};

module.exports = {
  getBloodGroups,
  getBloodGroupById
}; 