const express = require('express');
const eventController = require('./event.controller');

const router = express.Router();

// Lấy danh sách sự kiện sắp diễn ra (public - ai cũng truy cập được)
router.get('/upcoming/list', eventController.getUpcomingEvents);

// Lấy danh sách sự kiện đã được phê duyệt (public - ai cũng truy cập được)
router.get('/', eventController.getApprovedEvents);

// Lấy chi tiết sự kiện theo ID (public - ai cũng truy cập được)
router.get('/:id', eventController.getEventById);

module.exports = router; 