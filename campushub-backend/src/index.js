// require ('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import discussionModel from './models/discussion.model.js';
import Message from './models/message.model.js';
import { app } from './app.js';
import connectDB from './db/connect.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { User } from './models/user.model.js'; // ✅ Import User model


// const app = express();
const httpServer = createServer(app);  // ✅ HTTP server for WebSocket
const io = new Server(httpServer, {     // ✅ Socket.IO server
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
dotenv.config({
    path: './.env'
})

// In your server.js or cron file
setInterval(async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const result = await User.updateMany(
      { isOnline: true, lastActive: { $lt: thirtyMinutesAgo } },
      { isOnline: false, status: 'offline' }
    );
    if (result.modifiedCount > 0) {
      console.log(`🔄 Cleaned ${result.modifiedCount} offline users`);
    }
  } catch (error) {
    console.error('❌ Cron cleanup failed:', error);
  }
}, 5 * 60 * 1000);

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

 
  socket.on('join-user', async (userId) => {
  socket.join(`user_${userId}`);
  socket.userId = userId;
  
  try {
    const user = await User.findById(userId).select('fullname username avatar');
    socket.username = user.fullname || user.username; // 🔥 Store for logging
    
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      socketId: socket.id,
      lastActive: new Date(),
      status: 'online'
    });
    
    console.log(`✅ ${socket.username} (${userId}) is ONLINE`);
    io.emit('active-users-update');
  } catch (error) {
    console.error('❌ Status update failed:', error);
  }
});
  

  socket.on('join-room', async (roomId) => {
  socket.join(`room_${roomId}`);
  socket.currentRoom = roomId;
  
  try {
    // Get user data
    const user = await User.findById(socket.userId)
      .select('fullname username avatar branch semester');
    
    await DiscussionRoom.findByIdAndUpdate(roomId, {
      $addToSet: { participants: socket.userId }
    });
    
    // 🔥 EMIT FULL USER DATA
    socket.to(`room_${roomId}`).emit('user-joined', {
      userId: socket.userId,
      fullname: user.fullname || user.username || 'User',
      username: user.username,
      avatar: user.avatar,
      branch: user.branch,
      semester: user.semester
    });
    
    console.log(`👥 ${user.fullname} joined room ${roomId}`);
  } catch (error) {
    console.error('❌ Room join failed:', error);
  }
});

  // socket.on('room-message', async (data) => {
  //   try {
  //     const message = new Message({
  //       room: data.roomId,
  //       user: socket.userId,
  //       content: data.content,
  //       type: 'text'
  //     });
  //     await message.save();
      
  //     // Broadcast to room
  //     global.io.to(`room_${data.roomId}`).emit('new-message', {
  //       _id: message._id,
  //       content: data.content,
  //       user: { 
  //         _id: socket.userId, 
  //         fullname: socket.username || 'User' 
  //       },
  //       createdAt: message.createdAt
  //     });
      
  //     console.log(`💬 Message in ${data.roomId}: ${data.content.slice(0, 30)}`);
  //   } catch (error) {
  //     console.error('❌ Message save failed:', error);
  //     socket.emit('error', 'Failed to send message');
  //   }
  // });

  // 🔥 Leave room
  socket.on('room-message', async (data) => {
  try {
    // 🔥 GET FULL USER DATA like posts
    const user = await User.findById(socket.userId)
      .select('fullname username avatar branch semester _id');
    
    if (!user) {
      socket.emit('error', 'User not found');
      return;
    }

    const message = new Message({
      room: data.roomId,
      user: socket.userId,
      content: data.content,
      type: 'text'
    });
    await message.save();
    
    // 🔥 EMIT FULL USER DATA EXACTLY like PostCard
    global.io.to(`room_${data.roomId}`).emit('new-message', {
      _id: message._id,
      content: data.content,
      createdAt: message.createdAt,
      sender: {  // 🔥 FULL USER OBJECT
        _id: user._id,
        fullname: user.fullname || user.username || 'User',
        username: user.username,
        avatar: user.avatar,
        branch: user.branch,
        semester: user.semester
      }
    });
    
    console.log(`💬 ${user.fullname} in ${data.roomId}: ${data.content.slice(0, 30)}`);
  } catch (error) {
    console.error('❌ Message save failed:', error);
    socket.emit('error', 'Failed to send message');
  }
});

  socket.on('leave-room', (roomId) => {
    socket.leave(`room_${roomId}`);
    console.log(`👋 ${socket.userId} left ${roomId}`);
  });

    socket.on('update-status', async (status) => {
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, {
        status,
        lastActive: new Date()
      });
      io.emit('active-users-update');
    }
  });

  socket.on('disconnect', async () => {
    console.log('🔌 Socket disconnected:', socket.id);
    
    if (socket.userId) {
      try {
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          socketId: null,
          lastActive: new Date(),
          status: 'offline'
        });
        console.log(`❌ User ${socket.userId} went OFFLINE`);
        io.emit('active-users-update');
      } catch (error) {
        console.error('❌ Disconnect update failed:', error);
      }
    }
  });
});





// 🔥 Make io globally available
global.io = io;

connectDB();
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  httpServer.listen(PORT, () => {  // ✅ Use httpServer!
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io ready on http://localhost:${PORT}`);
    console.log(`🌐 CORS origin: http://localhost:5173`);
  });
});