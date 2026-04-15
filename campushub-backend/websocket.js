// websocket.js - BACKEND FILE
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class NotificationWebSocket {
  constructor(httpServer) {
    // Attach WebSocket server to your HTTP server
    this.wss = new WebSocket.Server({ 
      server: httpServer,
      path: '/ws' // WebSocket endpoint: ws://localhost:5000/ws
    });
    
    this.clients = new Map(); // userId -> WebSocket connection
    
    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('WebSocket server started on /ws');
  }

  async handleConnection(ws, req) {
    // Get token from query params: ws://localhost:5000/ws?token=xyz
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    
    if (!token) {
      ws.close(1008, 'No token provided');
      return;
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Store connection: userId -> ws
      this.clients.set(decoded.id.toString(), ws);
      console.log(`✅ User ${decoded.id} connected to WebSocket`);

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(decoded.id.toString());
        console.log(`❌ User ${decoded.id} disconnected`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(decoded.id.toString());
      });

    } catch (error) {
      console.error('Invalid token:', error.message);
      ws.close(1008, 'Invalid token');
    }
  }

  // Send notification to specific user
  sendNotification(userId, notificationData) {
    const ws = this.clients.get(userId.toString());
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'new_notification',
        data: notificationData
      };
      ws.send(JSON.stringify(message));
      console.log(`📱 Sent notification to user: ${userId}`);
      return true;
    }
    console.log(`⚠️ No active connection for user: ${userId}`);
    return false;
  }

  // Get all connected users count
  getConnectedCount() {
    return this.clients.size;
  }
}

module.exports = NotificationWebSocket;