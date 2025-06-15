const { THANHPHO, QUAN, PHUONG } = require('../models');

/**
 * Lấy danh sách thành phố
 * @returns {Promise<Array>} - Danh sách thành phố
 */
const getCities = async () => {
  return await THANHPHO.findAll({
    order: [['TenThanhPho', 'ASC']]
  });
};

/**
 * Lấy danh sách quận theo thành phố
 * @param {string} cityId - Mã thành phố
 * @returns {Promise<Array>} - Danh sách quận
 */
const getDistrictsByCity = async (cityId) => {
  return await QUAN.findAll({
    where: { IdThanhPho: cityId },
    order: [['TenQuan', 'ASC']]
  });
};

/**
 * Lấy danh sách phường theo quận
 * @param {string} districtId - Mã quận
 * @returns {Promise<Array>} - Danh sách phường
 */
const getWardsByDistrict = async (districtId) => {
  return await PHUONG.findAll({
    where: { IdQuan: districtId },
    order: [['TenPhuong', 'ASC']]
  });
};

/**
 * Lấy thông tin đầy đủ của một phường (bao gồm quận và thành phố)
 * @param {string} wardId - Mã phường
 * @returns {Promise<Object>} - Thông tin phường, quận, thành phố
 */
const getFullAddressInfo = async (wardId) => {
  const phuong = await PHUONG.findByPk(wardId, {
    include: [
      {
        model: QUAN,
        as: 'QUAN',
        include: [
          {
            model: THANHPHO,
            as: 'THANHPHO'
          }
        ]
      }
    ]
  });
  
  if (!phuong) {
    throw new Error('Không tìm thấy thông tin phường');
  }
  
  return {
    phuong: {
      id: phuong.IdPhuong,
      ten: phuong.TenPhuong
    },
    quan: {
      id: phuong.QUAN.IdQuan,
      ten: phuong.QUAN.TenQuan
    },
    thanhpho: {
      id: phuong.QUAN.THANHPHO.IdThanhPho,
      ten: phuong.QUAN.THANHPHO.TenThanhPho
    }
  };
};

module.exports = {
  getCities,
  getDistrictsByCity,
  getWardsByDistrict,
  getFullAddressInfo
}; 