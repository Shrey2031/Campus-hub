import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import safeStorage from '../../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function RightSidebarNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef();
  const token = safeStorage.getItem('token');
  const userData = safeStorage.getItem('user');
  const userId = userData ? JSON.parse(userData)._id : null;
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const formatted = res.data.notifications.map(n => ({
        ...n,
        time: formatTime(n.createdAt)
      }));
      setNotifications(formatted);
      setNotificationCount(formatted.filter(n => !n.read).length);
    } catch (error) {
      console.error('Notifications fetch error:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!userId || !token) return;
    fetchNotifications();

    socketRef.current = io(`${import.meta.env.VITE_API_URL}`, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current.emit('join-user', userId);
    socketRef.current.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setNotificationCount(prev => prev + 1);
      toast(<>🔔 {notification.title}</>, {
        duration: 4000,
        position: 'top-right',
        style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
      });
    });

    return () => socketRef.current?.disconnect();
  }, [userId, token, fetchNotifications]);

  const markAllRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setNotificationCount(0);
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark read logic here
    if (notification.relatedId) {
      window.location.href = `/post/${notification.relatedId}`;
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300 ${
      notificationCount > 0 ? 'ring-2 ring-indigo-500/50 shadow-indigo-200' : ''
    }`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg relative">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </div>
            Notifications
          </h3>
          {notificationCount > 0 && (
            <button onClick={markAllRead} className="text-indigo-600 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap">
              Mark all read
            </button>
          )}
        </div>
      </div>
      
      {/* List */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notif) => (
            <div key={notif._id} onClick={() => handleNotificationClick(notif)} className={`group flex items-start space-x-2 sm:space-x-3 p-3 rounded-xl cursor-pointer transition-all hover:shadow-md border hover:border-indigo-300 shadow-sm ${
              !notif.read ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-md' : 'bg-white/50 border-gray-200 hover:bg-gray-50'
            }`}>
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-3 sm:mt-2.5 flex-shrink-0 shadow-sm ${
                notif.type === 'like' ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                notif.type === 'comment' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                'bg-gradient-to-r from-purple-500 to-purple-600'
              }`} />
              <div className="flex-1 min-w-0 py-0.5">
                <p className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-indigo-700 line-clamp-2 leading-tight">
                  {notif.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500 space-y-2">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h4 className="text-sm font-semibold text-gray-900">No notifications</h4>
          </div>
        )}
      </div>
    </div>
  );
}