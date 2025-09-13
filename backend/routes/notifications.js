const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect: auth, authorize } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread = false } = req.query;
    
    const filter = { user: req.user.id };
    if (unread === 'true') filter.read = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });

    res.json({
      success: true,
      data: {
        notifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

/**
 * @route   POST /api/notifications/send
 * @desc    Send notification to users (Admin only)
 * @access  Private (Admin)
 */
router.post('/send', 
  auth,
  authorize('admin'),
  [
    body('title').notEmpty().withMessage('Notification title is required'),
    body('message').notEmpty().withMessage('Notification message is required'),
    body('type').isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
    body('recipients').isArray().withMessage('Recipients must be an array')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { title, message, type, recipients, actionUrl } = req.body;

      // If recipients is empty, send to all users
      let userIds = recipients;
      if (recipients.length === 0 || recipients.includes('all')) {
        const allUsers = await User.find({ isActive: true }, '_id');
        userIds = allUsers.map(user => user._id);
      }

      // Create notifications for all recipients
      const notifications = userIds.map(userId => ({
        user: userId,
        title,
        message,
        type,
        actionUrl,
        sender: req.user.id
      }));

      await Notification.insertMany(notifications);

      res.json({
        success: true,
        message: `Notification sent to ${userIds.length} users`,
        data: {
          recipientCount: userIds.length
        }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while sending notification'
      });
    }
  }
);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification'
    });
  }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notifications'
    });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
});

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notifications count
 * @access  Private
 */
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching unread count'
    });
  }
});

module.exports = router;
