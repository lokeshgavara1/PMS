const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/users/:userId', verifyToken, notificationController.getUserNotifications);
router.patch('/:notificationId/read', verifyToken, notificationController.markAsRead);
router.patch('/users/:userId/read-all', verifyToken, notificationController.markAllAsRead);
router.delete('/:notificationId', verifyToken, notificationController.deleteNotification);

module.exports = router;
