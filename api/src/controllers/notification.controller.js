const { Notification, User } = require('../models');
const { Op } = require('sequelize');

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { unread_only } = req.query;

    const where = { user_id: userId };
    if (unread_only === 'true') {
      where.read_at = null;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    const unreadCount = await Notification.count({
      where: { user_id: userId, read_at: null },
    });

    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_NOTIFICATIONS_ERROR', message: error.message },
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found' },
      });
    }

    await notification.update({ read_at: new Date() });

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'MARK_READ_ERROR', message: error.message },
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.update(
      { read_at: new Date() },
      { where: { user_id: userId, read_at: null } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'MARK_ALL_READ_ERROR', message: error.message },
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found' },
      });
    }

    await notification.destroy();

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_NOTIFICATION_ERROR', message: error.message },
    });
  }
};

// Internal function to create notification (called from other controllers)
exports.createNotification = async (userId, type, message, relatedEntityId) => {
  try {
    return await Notification.create({
      user_id: userId,
      type,
      message,
      related_entity_id: relatedEntityId,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};
