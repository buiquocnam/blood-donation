const { NHOMMAU } = require('../models');

/**
 * Lấy danh sách nhóm máu
 * @returns {Promise<Array>} - Danh sách nhóm máu
 */
const getBloodGroups = async () => {
  return await NHOMMAU.findAll({
    order: [['MaNhomMau', 'ASC']]
  });
};

/**
 * Lấy thông tin chi tiết nhóm máu
 * @param {string} id - Mã nhóm máu
 * @returns {Promise<Object>} - Thông tin nhóm máu
 */
const getBloodGroupById = async (id) => {
    const bloodGroup = await NHOMMAU.findByPk(id);
  
  if (!bloodGroup) {
    throw new Error('Không tìm thấy nhóm máu');
  }
  
  return bloodGroup;
};

module.exports = {
  getBloodGroups,
  getBloodGroupById
}; 