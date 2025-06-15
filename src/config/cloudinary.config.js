const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyzx3s8h1',
  api_key: process.env.CLOUDINARY_API_KEY || '665365955827252',
  api_secret: process.env.CLOUDINARY_API_SECRET || '1gPogxxYiQlO6fOvSLQWqZX2kO0'
});

// Khởi tạo storage engine cho multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hienmau/proofs', // Thư mục lưu file minh chứng
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], // Các định dạng được phép
    transformation: [{ width: 1000, crop: "limit" }] // Giới hạn kích thước ảnh
  }
});

// Khởi tạo middleware multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại file
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh hoặc PDF!'), false);
    }
  }
});

module.exports = {
  cloudinary,
  upload
}; 