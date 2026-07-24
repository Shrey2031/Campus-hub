import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, TrendingUp, Users, Eye, BookOpen, Download, ChevronRight, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import safeStorage from '../../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function RightSidebar() {
  const [notifications, setNotifications] = useState([]);
  const [trending, setTrending] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const socketRef = useRef();
  const token = safeStorage.getItem('token');
  const userData = safeStorage.getItem('user');
  const userId = userData ? JSON.parse(userData)._id : null;
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  // Guards against missing/unparseable createdAt (was showing "Invalid Date")
  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Just now';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const promises = [
        axios.get(`${API_BASE_URL}/notifications/`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            const formatted = res.data.notifications.map(n => ({ ...n, time: formatTime(n.createdAt) }));
            setNotifications(formatted);
            setNotificationCount(formatted.filter(n => !n.read).length);
          }),
        axios.get(`${API_BASE_URL}/posts/trending-topics`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => setTrending(res.data.topics || [])),
        axios.get(`${API_BASE_URL}/users/active`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => setActiveUsers(res.data.users || [])),
        axios.get(`${API_BASE_URL}/posts/resources/top`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => setResources(res.data.resources || []))
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!userId || !token) return;

    socketRef.current = io(`${import.meta.env.VITE_API_URL}`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      path: '/socket.io/'
    });

    socketRef.current.emit('join-user', userId);
    socketRef.current.on('connect', () => console.log('Socket connected'));
    socketRef.current.on('disconnect', () => console.log('Socket disconnected'));
    socketRef.current.on('active-users-update', () => fetchData());

    socketRef.current.on('new-notification', (notification) => {
      const formattedNotification = { ...notification, time: formatTime(notification.createdAt || notification.time) };
      setNotifications(prev => [formattedNotification, ...prev]);
      setNotificationCount(prev => prev + 1);
      toast(
        <>
          <div className="font-semibold">{notification.title}</div>
          <div className="text-sm opacity-90">{notification.text}</div>
        </>
      );
    });

    fetchData();
    const interval = setInterval(fetchData, 120000);

    return () => {
      clearInterval(interval);
      socketRef.current?.disconnect();
    };
  }, [userId, token, fetchData]);

  const markAllRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setNotificationCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  const markSingleRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark single read failed');
    }
  };

  const handleNotificationClick = (notification) => {
    markSingleRead(notification._id);
    if (notification.relatedId) {
      window.location.href = `/post/${notification.relatedId}`;
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resource.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="w-80 xl:w-96 space-y-5 pr-4 sticky top-20 self-start">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-ink/5 rounded-sm h-80" />
        ))}
      </div>
    );
  }

  const dotColor = (type) =>
    type === 'like' ? 'bg-redpen' :
    type === 'comment' ? 'bg-ink' :
    type === 'follow' ? 'bg-highlighter' :
    'bg-ink-soft';

  return (
    <div className="w-80 xl:w-96 space-y-5 pr-4 sticky top-20 self-start">
      {/* Notifications */}
      <div className="bg-white border border-ink/10 rounded-sm overflow-hidden h-80 flex flex-col">
        <div className="p-4 border-b border-dashed border-ink/15 flex-shrink-0 flex items-center justify-between">
          <h3 className="font-display font-bold text-ink flex items-center gap-2">
            <span className="relative w-6 h-6 bg-ink rounded flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-paper" />
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-redpen text-paper text-[10px] rounded-full flex items-center justify-center font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </span>
            Notifications
          </h3>
          {notificationCount > 0 && (
            <button
              onClick={markAllRead}
              className="font-mono text-[10px] uppercase tracking-wide bg-ink text-paper px-2.5 py-1.5 rounded hover:bg-redpen transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="p-3 space-y-2 flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`group flex items-start gap-3 p-3 rounded cursor-pointer transition-colors border ${
                  !notif.read ? 'bg-highlighter/10 border-highlighter/40' : 'bg-paper border-transparent hover:border-ink/10'
                }`}
              >
                <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${dotColor(notif.type)}`} />
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="font-body font-semibold text-sm text-ink line-clamp-2 leading-relaxed">{notif.title}</p>
                  <p className="font-body text-xs text-ink-soft mt-0.5">{notif.text}</p>
                  <p className="font-mono text-[10px] text-ink-soft mt-1">{notif.time}</p>
                </div>
                {!notif.read && (
                  <CheckCircle className="w-4 h-4 text-ink-soft flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-ink-soft space-y-2">
              <Bell className="w-10 h-10 mx-auto text-ink/20 mb-2" />
              <p className="font-body font-semibold text-ink text-sm">No notifications</p>
              <p className="font-body text-xs">You'll see activity here</p>
            </div>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-white border border-ink/10 rounded-sm overflow-hidden h-72 flex flex-col">
        <div className="p-4 border-b border-dashed border-ink/15 flex-shrink-0">
          <h3 className="font-display font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 bg-ink rounded flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-paper" />
            </span>
            Trending now
          </h3>
        </div>
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {trending.slice(0, 6).map((topic, i) => (
            <a
              key={topic}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="w-full flex items-center justify-between p-2.5 rounded hover:bg-paper transition-colors"
            >
              <span className="font-body font-semibold text-sm text-ink truncate">#{topic}</span>
              <span className="font-mono text-xs text-redpen">+{(i + 1) * 5}K</span>
            </a>
          ))}
        </div>
      </div>

      {/* Active users */}
      <div className="bg-white border border-ink/10 rounded-sm overflow-hidden h-80 flex flex-col">
        <div className="p-4 border-b border-dashed border-ink/15 flex-shrink-0 flex items-center justify-between">
          <h3 className="font-display font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 bg-ink rounded flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-paper" />
            </span>
            Active now ({activeUsers.length})
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-wide text-redpen flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-redpen" /> Live
          </span>
        </div>
        <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {activeUsers.slice(0, 4).map((user) => (
            <a
              key={user._id}
              href={`/profile/${user._id}`}
              className="w-full flex items-center gap-3 p-2.5 rounded hover:bg-paper transition-colors"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={user.fullname}
                  className="w-9 h-9 rounded object-cover border border-ink/10"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/36?text=%F0%9F%91%A4'}
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${
                  user.status === 'online' ? 'bg-highlighter' : 'bg-ink-soft'
                }`} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-body font-semibold text-sm text-ink truncate">{user.fullname}</p>
                <p className="font-mono text-[10px] text-ink-soft">{user.branch} · Sem {user.semester}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white border border-ink/10 rounded-sm overflow-hidden h-[28rem] flex flex-col">
        <div className="p-4 border-b border-dashed border-ink/15 flex-shrink-0 flex items-center justify-between">
          <h3 className="font-display font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 bg-ink rounded flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-paper" />
            </span>
            Top resources ({resources.length})
          </h3>
        </div>
        <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="group flex items-start gap-3 p-3 rounded hover:bg-paper transition-colors relative"
            >
              <span className="w-9 h-9 bg-paper border border-ink/10 rounded flex items-center justify-center flex-shrink-0 text-lg">
                {resource.icon || '📄'}
              </span>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="font-body font-semibold text-sm text-ink line-clamp-1">{resource.title}</p>
                <p className="font-mono text-[10px] text-ink-soft mt-0.5">
                  {resource.author?.fullname || resource.author}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="font-mono text-[10px] bg-paper border border-ink/10 px-1.5 py-0.5 rounded text-ink-soft">
                  {resource.type || 'PDF'}
                </span>
                <span className="font-mono text-[10px] text-ink-soft flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {resource.views?.toLocaleString() || '1K'}
                </span>
              </div>
              <button
                onClick={() => handleDownload(resource.fileUrl)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white border border-ink/15 rounded hover:border-redpen hover:text-redpen"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-dashed border-ink/15">
          <a
            href="/resources"
            className="w-full flex items-center justify-center gap-2 font-body font-semibold text-sm text-ink py-2.5 rounded border border-ink/15 hover:border-ink transition-colors"
          >
            Browse all resources
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}