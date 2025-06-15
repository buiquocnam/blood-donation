const { Role, BloodGroup, User, VolunteerCenter } = require('../models');

// Tạo dữ liệu vai trò
const seedRoles = async () => {
  try {
    const count = await Role.count();
    
    if (count === 0) {
      await Role.bulkCreate([
        { MAVAITRO: 'ROLE_DONOR', TENVAITRO: 'Người hiến máu', MOTA: 'Người hiến máu đã đăng ký' },
        { MAVAITRO: 'ROLE_MEDICAL_STAFF', TENVAITRO: 'Nhân viên y tế', MOTA: 'Nhân viên y tế tại trung tâm máu' },
        { MAVAITRO: 'ROLE_DOCTOR', TENVAITRO: 'Bác sĩ', MOTA: 'Bác sĩ tại trung tâm máu' },
        { MAVAITRO: 'ROLE_VOLUNTEER_MANAGER', TENVAITRO: 'Trưởng cơ sở tình nguyện', MOTA: 'Quản lý cơ sở tình nguyện' },
        { MAVAITRO: 'ROLE_BLOOD_DIRECTOR', TENVAITRO: 'Giám đốc ngân hàng máu', MOTA: 'Quản lý cao cấp trung tâm máu' },
        { MAVAITRO: 'ROLE_ADMIN', TENVAITRO: 'Quản trị viên', MOTA: 'Quản trị viên hệ thống' }
      ]);
      
      console.log('Đã tạo dữ liệu vai trò thành công!');
    } else {
      console.log('Dữ liệu vai trò đã tồn tại.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu vai trò:', error);
  }
};

// Tạo dữ liệu nhóm máu
const seedBloodGroups = async () => {
  try {
    const count = await BloodGroup.count();
    
    if (count === 0) {
      await BloodGroup.bulkCreate([
        { MANHOMMAU: 'A+', MOTANHOMMAU: 'Nhóm máu A dương', DOPHOBIEN: 35.7, GHICHU: 'Có thể cho máu đến A+ và AB+. Có thể nhận máu từ A+, A-, O+ và O-' },
        { MANHOMMAU: 'A-', MOTANHOMMAU: 'Nhóm máu A âm', DOPHOBIEN: 6.3, GHICHU: 'Có thể cho máu đến A+, A-, AB+ và AB-. Có thể nhận máu từ A- và O-' },
        { MANHOMMAU: 'B+', MOTANHOMMAU: 'Nhóm máu B dương', DOPHOBIEN: 28.5, GHICHU: 'Có thể cho máu đến B+ và AB+. Có thể nhận máu từ B+, B-, O+ và O-' },
        { MANHOMMAU: 'B-', MOTANHOMMAU: 'Nhóm máu B âm', DOPHOBIEN: 1.5, GHICHU: 'Có thể cho máu đến B+, B-, AB+ và AB-. Có thể nhận máu từ B- và O-' },
        { MANHOMMAU: 'AB+', MOTANHOMMAU: 'Nhóm máu AB dương', DOPHOBIEN: 3.4, GHICHU: 'Có thể cho máu đến AB+. Có thể nhận máu từ tất cả các nhóm' },
        { MANHOMMAU: 'AB-', MOTANHOMMAU: 'Nhóm máu AB âm', DOPHOBIEN: 0.6, GHICHU: 'Có thể cho máu đến AB+ và AB-. Có thể nhận máu từ A-, B-, AB- và O-' },
        { MANHOMMAU: 'O+', MOTANHOMMAU: 'Nhóm máu O dương', DOPHOBIEN: 20.0, GHICHU: 'Có thể cho máu đến A+, B+, AB+ và O+. Có thể nhận máu từ O+ và O-' },
        { MANHOMMAU: 'O-', MOTANHOMMAU: 'Nhóm máu O âm', DOPHOBIEN: 4.0, GHICHU: 'Có thể cho máu đến tất cả các nhóm. Chỉ có thể nhận máu từ O-' }
      ]);
      
      console.log('Đã tạo dữ liệu nhóm máu thành công!');
    } else {
      console.log('Dữ liệu nhóm máu đã tồn tại.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu nhóm máu:', error);
  }
};

// Tạo tài khoản Admin mặc định
const seedAdminAccount = async () => {
  try {
    const adminExists = await User.findOne({
      where: { EMAIL: 'admin@hienmau.com' }
    });
    
    if (!adminExists) {
      await User.create({
        MANGUOIDUNG: 'ADMIN01',
        MAVAITRO: 'ROLE_ADMIN',
        HOTEN: 'Quản trị viên',
        NGAYSINH: '1990-01-01',
        EMAIL: 'admin@hienmau.com',
        PASSWORD: 'Admin@123',
        GIOITINH: true,
        TINHTRANG: true,
        NGAYTAO: new Date()
      });
      
      console.log('Đã tạo tài khoản Admin thành công!');
    } else {
      console.log('Tài khoản Admin đã tồn tại.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản Admin:', error);
  }
};

// Tạo dữ liệu mẫu cho cơ sở tình nguyện
const seedVolunteerCenters = async () => {
  try {
    const centerCount = await VolunteerCenter.count();
    
    if (centerCount === 0) {
      // Cơ sở tình nguyện đã được phê duyệt
      await VolunteerCenter.create({
        IDCOSOTINHNGUYEN: 'CS12345678',
        TENCOSOTINHNGUYEN: 'Đại học Y Dược TP.HCM',
        MAVAITRO: 'ROLE_VOLUNTEER_MANAGER',
        SDT: '02838558411',
        EMAIL: 'hienmau@yds.edu.vn',
        NGUOIPHUTRACH: 'TS. Nguyễn Văn A',
        USERNAME: 'yduoc_tphcm',
        PASSWORD: 'YDuoc@123',
        DIACHI: '217 Hồng Bàng, Phường 11, Quận 5',
        TINHTRANG: true, // Đã được phê duyệt
        NGAYTAO: new Date()
      });
      
      // Cơ sở tình nguyện đang chờ duyệt
      await VolunteerCenter.create({
        IDCOSOTINHNGUYEN: 'CS87654321',
        TENCOSOTINHNGUYEN: 'Đại học Bách Khoa TP.HCM',
        MAVAITRO: 'ROLE_VOLUNTEER_MANAGER',
        SDT: '02838654087',
        EMAIL: 'hienmau@hcmut.edu.vn',
        NGUOIPHUTRACH: 'ThS. Trần Văn B',
        USERNAME: 'bachkhoa_tphcm',
        PASSWORD: 'BachKhoa@123',
        DIACHI: '268 Lý Thường Kiệt, Phường 14, Quận 10',
        TINHTRANG: false, // Đang chờ phê duyệt
        NGAYTAO: new Date()
      });
      
      console.log('Đã tạo dữ liệu mẫu cho cơ sở tình nguyện thành công!');
    } else {
      console.log('Dữ liệu cơ sở tình nguyện đã tồn tại.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu cơ sở tình nguyện:', error);
  }
};

// Chạy tất cả các seeder
const seedAll = async () => {
  await seedRoles();
  await seedBloodGroups();
  await seedAdminAccount();
  await seedVolunteerCenters();
  
  console.log('Đã hoàn thành việc tạo dữ liệu mẫu!');
};

module.exports = {
  seedRoles,
  seedBloodGroups,
  seedAdminAccount,
  seedVolunteerCenters,
  seedAll
}; 