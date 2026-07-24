import 'dotenv/config';

import jwt from 'jsonwebtoken';
import DiscussionRoom from './models/discussion.model.js';
import Message from './models/message.model.js';
import { app } from './app.js';
import connectDB from './db/connect.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { User } from './models/user.model.js';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});


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
    console.error(' Cron cleanup failed:', error);
  }
}, 5 * 60 * 1000);


io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select('fullname username avatar branch semester');
    if (!user) return next(new Error('User not found'));

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id} (${socket.user.fullname || socket.user.username})`);


  socket.on('join-user', async () => {
    socket.join(`user_${socket.userId}`);

    try {
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
        socketId: socket.id,
        lastActive: new Date(),
        status: 'online'
      });

      console.log(` ${socket.user.fullname || socket.user.username} (${socket.userId}) is ONLINE`);
      io.emit('active-users-update');
    } catch (error) {
      console.error('❌ Status update failed:', error);
    }
  });

  socket.on('join-room', async (roomId) => {
    socket.join(`room_${roomId}`);
    socket.currentRoom = roomId;

    try {
      await DiscussionRoom.findByIdAndUpdate(roomId, {
        $addToSet: { participants: socket.userId }
      });

      socket.to(`room_${roomId}`).emit('user-joined', {
        userId: socket.userId,
        fullname: socket.user.fullname || socket.user.username || 'User',
        username: socket.user.username,
        avatar: socket.user.avatar,
        branch: socket.user.branch,
        semester: socket.user.semester
      });

      console.log(` ${socket.user.fullname} joined room ${roomId}`);
    } catch (error) {
      console.error(' Room join failed:', error);
    }
  });

  socket.on('room-message', async (data) => {
    try {
      const message = new Message({
        room: data.roomId,
        user: socket.userId,
        content: data.content,
        type: 'text'
      });
      await message.save();

      io.to(`room_${data.roomId}`).emit('new-message', {
        _id: message._id,
        content: data.content,
        createdAt: message.createdAt,
        sender: {
          _id: socket.userId,
          fullname: socket.user.fullname || socket.user.username || 'User',
          username: socket.user.username,
          avatar: socket.user.avatar,
          branch: socket.user.branch,
          semester: socket.user.semester
        }
      });

      console.log(` ${socket.user.fullname} in ${data.roomId}: ${data.content.slice(0, 30)}`);
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
    try {
      await User.findByIdAndUpdate(socket.userId, {
        status,
        lastActive: new Date()
      });
      io.emit('active-users-update');
    } catch (error) {
      console.error('❌ Status update failed:', error);
    }
  });

  socket.on('disconnect', async () => {
    console.log('🔌 Socket disconnected:', socket.id);

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
  });
});


global.io = io;

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Socket.io ready on http://localhost:${PORT}`);
    console.log(` CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  });
});


process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});