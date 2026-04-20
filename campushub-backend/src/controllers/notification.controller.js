// controllers/notification.controller.js - FULL FIXED VERSION
import Notification from '../models/notification.model.js';
import mongoose from 'mongoose';


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
    // ✅ FIX 1: Use ObjectId for exact match
    const userId = new mongoose.Types.ObjectId(req.user._id);  // Convert to ObjectId
    
    console.log('🔍 GET notifications for user:', userId);

    const notifications = await Notification.find({ 
      user: userId  // ✅ ObjectId matches ObjectId!
    })
    .populate('user', 'fullname avatar')
    .sort({ createdAt: -1 })
    .limit(50);

    console.log('📋 Found notifications:', notifications.length);
    console.log('Notifications:', notifications.map(n => ({ type: n.type, _id: n._id })));

   

    const formatted = notifications.map(n => ({
      _id: n._id,
      title: n.title,
      text: n.message,
      type: n.type,
      time: formatTime(n.createdAt),
      read: n.isRead,
      relatedId: n.relatedId
    }));

    res.json({
      success: true,
      notifications: formatted,
      debug: { 
        userId: req.user._id.toString(), 
        count: notifications.length,
        queryUsed: userId.toString()
      }
    });
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// // 🔥 CREATE NOTIFICATION (Call from like/comment)
// export const createNotification = async (userId, title, message, type, relatedId = null) => {
//   try {
//     console.log('🚀 Creating notification:', { userId, title, type });

//     const notification = new Notification({
//       title,
//       message,
//       type,
//       user: userId,
//       relatedId
//     });
//     await notification.save();
//     console.log('💾 Notification SAVED:', notification._id);


//     // // 🔥 WEBSOCKET EMIT
//     // const notificationData = {
//     //   _id: notification._id,
//     //   title,
//     //   text: message,
//     //   type,
//     //   time: formatTime(notification.createdAt),
//     //   read: false,
//     //   relatedId
//     // };

//     // emitNotification(userId.toString(), notificationData);
//     // console.log(`🔔 Created & emitted: ${type} for user ${userId}`);
//       const io = global.io;
//     if (io) {
//       io.to(`user_${userId}`).emit('new-notification', {
//         _id: notification._id,
//         title,
//         text: message,
//         type,
//         time: formatTime(notification.createdAt),
//           createdAt: notification.createdAt,
//         read: false,
//         relatedId
//       });
//       console.log('📱 SOCKET EMITTED notification');
//     }
    
//     return notification;
//   } catch (error) {
//     console.error('❌ Notification error:', error);
//   }
// };

export const createNotification = async (userId, title, message, type, relatedId = null) => {
  try {
    console.log('🚀 Creating notification:', { userId, title, message, type }); // ✅ Debug

    const notification = new Notification({
      title,
      message: message || title,  // ✅ FIX: Fallback to title
      type,
      user: userId,
      relatedId
    });
    
    await notification.save();
    console.log('💾 Notification SAVED:', notification._id, notification.message); // ✅ Debug

    // ✅ WebSocket emit
    const io = global.io;
    if (io) {
      io.to(`user_${userId}`).emit('new-notification', {
        _id: notification._id,
        title: notification.title,
        text: notification.message,  // ✅ Use SAVED message
        type,
        time: formatTime(notification.createdAt),
        createdAt: notification.createdAt,
        read: false,
        relatedId
      });
    }
    
    return notification;
  } catch (error) {
    console.error('❌ Notification CREATE ERROR:', error); // ✅ Better error logging
    throw error; // ✅ Re-throw so caller knows it failed
  }
};



// 🔥 MARK ALL READ
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔥 MARK SINGLE READ
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};