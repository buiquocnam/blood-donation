// Script để chạy seeder từ dòng lệnh
const { seedAll } = require('./seeder');
const { sequelize } = require('../models');

async function runSeeder() {
  try {
    // Kiểm tra kết nối database
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công.');
    
    // Chạy tất cả các seeder
    await seedAll();
    
    console.log('Hoàn tất tạo dữ liệu ban đầu.');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi chạy seeder:', error);
    process.exit(1);
  }
}

// Chạy seeder
runSeeder(); 