import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bell, TrendingUp, Users, Eye, BookOpen, Download, ChevronRight, CheckCircle , AlertTriangle
} from 'lucide-react';
import { io } from 'socket.io-client';
import safeStorage from '../../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function RightSidebar() {
  // LIVE STATES
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


  // 🔥 TIME FORMATTER
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


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const promises = [
        axios.get(`${API_BASE_URL}/notifications/`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          const formatted = res.data.notifications.map(n => ({
            ...n,
            time: formatTime(n.createdAt)
          }));
          setNotifications(formatted);
          setNotificationCount(formatted.filter(n => !n.read).length);
        }),
        
        axios.get(`${API_BASE_URL}/posts/trending-topics`,
           {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setTrending(res.data.topics || [])),

        axios.get(`${API_BASE_URL}/users/active`,
           {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setActiveUsers(res.data.users || [])),

        axios.get(`${API_BASE_URL}/posts/resources/top`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setResources(res.data.resources || []))
      ];

      await Promise.all(promises);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading( false );
    }
  }, [token]);

  // 🔥 WEBSOCKET SETUP
    // 🔥 WEBSOCKET SETUP (Lines 90-150) - FIXED
useEffect(() => {
  if (!userId || !token) return;

  socketRef.current = io(`${import.meta.env.VITE_API_URL}`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    path: '/socket.io/'
  });

  socketRef.current.emit('join-user', userId);

  // ✅ FIX 1: Move ALL listeners OUTSIDE each other
  socketRef.current.on('connect', () => {
    console.log('✅ Socket connected!');
  });

  socketRef.current.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socketRef.current.on('active-users-update', () => {
    console.log('🔄 Refreshing active users...');
    fetchData();
  });

  // ✅ FIX 2: Format WebSocket notification time
  socketRef.current.on('new-notification', (notification) => {
    // console.log('🔔 Raw notification:', notification);
    console.log('🔥 RAW SOCKET DATA:', JSON.stringify(notification, null, 2));
  console.log('createdAt:', notification.createdAt);
  console.log('time:', notification.time);
  console.log('typeof createdAt:', typeof notification.createdAt);
    
    // ✅ Format time for WebSocket notifications
    const formattedNotification = {
      ...notification,
      time: formatTime(notification.createdAt || notification.time)
    };
    
    setNotifications(prev => [formattedNotification, ...prev]);
    setNotificationCount(prev => prev + 1);

    // 🔥 TOAST
    toast(
      <>
        <div className="font-semibold">{notification.title}</div>
        <div className="text-sm opacity-90">{notification.text}</div>
      </>,
      { /* toast config */ }
    );
  });

  fetchData();
  const interval = setInterval(fetchData, 120000);
  
  return () => {
    clearInterval(interval);
    socketRef.current?.disconnect();
  };
}, [userId, token, fetchData]);

  // 🔥 MARK ALL READ
  const markAllRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setNotificationCount(0);
      toast.success('All notifications marked as read! ✅');
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  // 🔥 MARK SINGLE READ
  const markSingleRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark single read failed');
    }
  };

  // 🔥 NAVIGATE TO POST
  const handleNotificationClick = (notification) => {
    markSingleRead(notification._id);
    if (notification.relatedId) {
      window.location.href = `/post/${notification.relatedId}`;
    }
  };

  if (loading) {
    return (
      <div className="w-80 xl:w-96 space-y-5 pr-4 sticky top-20 self-start">
        {[1,2,3,4].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-80" />
        ))}
      </div>
    );
  }




const handleDownload = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "resource.pdf"; // optional custom name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="w-80 xl:w-96 space-y-5 pr-4 sticky top-20 self-start">
      {/* 🔥 1. LIVE NOTIFICATIONS */}
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-80 flex flex-col hover:shadow-2xl transition-all duration-300 ${
        notificationCount > 0 ? 'ring-2 ring-indigo-500/50 shadow-indigo-200' : ''
      }`}>
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg relative">
                <Bell className="w-4 h-4 text-white" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </div>
              Notifications
            </h3>
            {notificationCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-indigo-600 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`group flex items-start space-x-3 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md border hover:border-indigo-300 shadow-sm ${
                  !notif.read 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-md animate-in slide-in-from-top-2' 
                    : 'bg-white/50 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mt-2.5 flex-shrink-0 shadow-sm ${
                  notif.type === 'like' ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                  notif.type === 'comment' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  notif.type === 'follow' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                  'bg-gradient-to-r from-purple-500 to-purple-600'
                }`} />
                <div className="flex-1 min-w-0 py-1">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-indigo-700 line-clamp-2 leading-relaxed">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notif.text}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{notif.time}</p>
                </div>
                {!notif.read && (
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 space-y-3">
              <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-1">No notifications</h4>
              <p className="text-sm">You'll see activity here</p>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 2. LIVE TRENDING */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-72 flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Trending Now
          </h3>
        </div>
        
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {trending.slice(0, 6).map((topic, i) => (
            <a 
              key={topic}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="w-full group flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all border hover:border-orange-200 shadow-sm hover:shadow-md block"
            >
              <span className="font-semibold text-sm text-gray-900 group-hover:text-orange-700 truncate">
                #{topic}
              </span>
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-all">
                <span className="text-xs font-bold text-orange-600">
                  +{(i + 1) * 5}K
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 🔥 3. LIVE ACTIVE USERS */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-80 flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              Active Now ({activeUsers.length})
            </h3>
            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
              ● Live
            </span>
          </div>
        </div>
        
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {activeUsers.slice(0, 4).map((user) => (
            <a 
              key={user._id}
              href={`/profile/${user._id}`}
              className="w-full group flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-all cursor-pointer border hover:border-emerald-200 shadow-sm hover:shadow-md block"
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={user.avatar} 
                  alt={user.fullname}
                  className="w-11 h-11 rounded-2xl ring-2 ring-white shadow-lg object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/44/6B7280/FFFFFF?text=👤'}
                />
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                  user.status === 'online' ? 'bg-emerald-500 text-white' : 'bg-orange-400 text-white'
                }`}>
                  ●
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-700 truncate">
                  {user.fullname}
                </p>
                <p className="text-xs text-gray-500">
                  {user.branch} • {user.semester} Sem
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 🔥 4. LIVE RESOURCES */}
    {/* 🔥 4. LIVE RESOURCES - DOWNLOAD ENABLED */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-[28rem] flex flex-col hover:shadow-2xl transition-all duration-300">
  <div className="p-5 border-b border-gray-100 flex-shrink-0">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        Top Resources ({resources.length})
      </h3>
      <span className="text-amber-600 text-xs font-bold bg-amber-50 px-3 py-1.5 rounded-xl shadow-sm">
        ● Popular
      </span>
    </div>
  </div>
  
  <div className="p-4 space-y-3 flex-1 overflow-y-auto">
    {resources.map((resource) => (
      <div 
        key={resource._id}
        className="group flex items-start space-x-3 p-4 rounded-xl hover:bg-amber-50/50 transition-all cursor-pointer border hover:border-amber-200 shadow-sm hover:shadow-md h-20 relative"
      >
        {/* 🔥 ICON */}
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
          <span className="text-2xl">{resource.icon || '📚'}</span>
        </div>
        
        {/* 🔥 TITLE & AUTHOR */}
        <div className="flex-1 min-w-0 py-1">
          <p className="font-semibold text-sm text-gray-900 group-hover:text-amber-700 line-clamp-1 mb-1">
            {resource.title}
          </p>
          <p className="text-xs text-gray-500">
            by {resource.author?.fullname || resource.author}
          </p>
        </div>
        
        {/* 🔥 TYPE & VIEWS */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs bg-white px-2 py-1 rounded-lg text-gray-600 font-medium shadow-sm">
            {resource.type || 'PDF'}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {resource.views?.toLocaleString() || '1K'}
          </span>
        </div>
        
        {/* 🔥 DOWNLOAD BUTTON - HOVER ONLY */}
        <button
          // onClick={(e) => {
          //   e.stopPropagation(); // Prevent card click
          //    handleDownload(resource._id, resource.title); 
          // }}
          onClick={() => handleDownload(resource.fileUrl)}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white/90 hover:bg-white rounded-xl shadow-lg hover:shadow-xl border hover:border-amber-300 flex items-center justify-center w-9 h-9 group-hover:scale-110 transform-gpu"
          title="Download PDF"
        >
          <Download className="w-4 h-4 text-amber-600 hover:text-amber-700 transition-colors" />
        </button>
   
      </div>
    ))}

  </div>
  
  <div className="p-4 pt-0 border-t border-gray-100">
    <a 
      href="/resources"
      className="w-full flex items-center justify-center gap-2 text-amber-600 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-amber-50 transition-all shadow-sm hover:shadow-md border border-amber-200 hover:border-amber-300"
    >
      <Download className="w-4 h-4" />
      Browse All Resources
      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </a>
  </div>
</div>
    </div>
  );
}