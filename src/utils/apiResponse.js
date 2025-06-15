/**
 * Lớp tiện ích cho việc chuẩn hóa phản hồi API
 * Cung cấp các phương thức tạo phản hồi với cấu trúc nhất quán: code và result
 */
class ApiResponse {
  /**
   * Tạo đối tượng phản hồi thành công
   * @param {any} data - Dữ liệu trả về
   * @param {number} code - Mã trạng thái HTTP
   * @returns {Object} - Đối tượng phản hồi chuẩn hóa
   */
  static success(data = null, code = 200) {
    return {
      code,
      result: data
    };
  }

  /**
   * Tạo đối tượng phản hồi thất bại
   * @param {string} message - Thông báo lỗi
   * @param {number} code - Mã trạng thái HTTP
   * @returns {Object} - Đối tượng phản hồi chuẩn hóa
   */
  static error(message = 'Đã xảy ra lỗi', code = 500) {
    return {
      code,
      result: { error: message }
    };
  }

  /**
   * Tạo đối tượng phản hồi với dữ liệu phân trang
   * @param {Array} data - Mảng dữ liệu
   * @param {Object} pagination - Thông tin phân trang
   * @param {number} code - Mã trạng thái HTTP
   * @returns {Object} - Đối tượng phản hồi chuẩn hóa với phân trang
   */
  static successWithPagination(data = [], pagination = {}, code = 200) {
    return {
      code,
      result: {
        data,
        pagination
      }
    };
  }
}

module.exports = ApiResponse; 