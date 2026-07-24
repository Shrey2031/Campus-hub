import Notification from '../models/notification.model.js';

const formatTime = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
};

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('user', 'fullname avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    const formatted = notifications.map(n => ({
      _id: n._id,
      title: n.title,
      text: n.message,
      type: n.type,
      time: formatTime(n.createdAt),
   
      createdAt: n.createdAt,
      read: n.isRead,
      relatedId: n.relatedId
    }));

    res.json({
      success: true,
      notifications: formatted
    });
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createNotification = async (userId, title, message, type, relatedId = null) => {
  try {
    const notification = new Notification({
      title,
      message: message || title,
      type,
      user: userId,
      relatedId
    });

    await notification.save();

    const io = global.io;
    if (io) {
      io.to(`user_${userId}`).emit('new-notification', {
        _id: notification._id,
        title: notification.title,
        text: notification.message,
        type,
        time: formatTime(notification.createdAt),
        createdAt: notification.createdAt,
        read: false,
        relatedId
      });
    }

    return notification;
  } catch (error) {
    console.error('❌ Notification CREATE ERROR:', error);
    throw error;
  }
};

export const markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;


    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};