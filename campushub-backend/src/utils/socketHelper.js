// utils/socket.js
// utils/socketHelper.js - ESM VERSION
import { Socket } from "socket.io";
import {User} from '../models/user.model.js'; // ✅ Import User model
export const emitNotification = (userId, notificationData) => {
  if (global.io) {
    global.io.to(`user_${userId}`).emit('new-notification', notificationData);
    console.log(`📱 SENT to user_${userId}:`, notificationData.title);
  } else {
    console.log('❌ Socket.io not available');
  }
};

// In your existing socketHelper.js
// 🔥 FULL SOCKET HANDLER FUNCTION
export const handleUserConnection = async (socket) => {
  console.log('🔥 Socket handler called for:', socket.id);
  
  // ✅ JOIN USER ROOM
  socket.on('join-user', async (userId) => {
    socket.join(`user_${userId}`);
    socket.userId = userId;
    
    try {
      // 🔥 UPDATE ONLINE STATUS
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        socketId: socket.id,
        lastActive: new Date(),
        status: 'online'
      });
      
      console.log(`✅ User ${userId} (${socket.id}) is ONLINE`);
      
      // 🔥 Broadcast active users update
      if (global.io) {
        global.io.emit('active-users-update');
      }
    } catch (error) {
      console.error('❌ User status update failed:', error);
    }
  });

  // 🔥 STATUS UPDATE (away/busy)
  socket.on('update-status', async (status) => {
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, {
        status,
        lastActive: new Date()
      });
      global.io.emit('active-users-update');
    }
  });

  // 🔥 DISCONNECT HANDLER (move here from server.js)
  socket.on('disconnect', async () => {
    if (socket.userId) {
      try {
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          socketId: null,
          lastActive: new Date(),
          status: 'offline'
        });
        console.log(`❌ User ${socket.userId} (${socket.id}) is OFFLINE`);
        global.io.emit('active-users-update');
      } catch (error) {
        console.error('❌ Disconnect update failed:', error);
      }
    }
  });
};