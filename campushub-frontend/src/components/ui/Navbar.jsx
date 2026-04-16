import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, Loader2, User } from 'lucide-react';
import axios from 'axios';
import safeStorage from '../../contexts/safeStorage';
import { useNavigate } from 'react-router-dom';

export default function TopNavbar() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
   const [loggingOut, setLoggingOut] = useState(false);
     const navigate = useNavigate();
   

  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/users`;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // ✅ Get real user data
      const userRes = await axios.get(`${API_BASE_URL}/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userRes.data.data.user); // Matches your backend structure!

      // ✅ Get real notifications (optional API)
      // const notifRes = await axios.get(`${API_BASE_URL}/notifications/count`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setNotifications(notifRes.data.data.count || 0);
      
    } catch (err) {
      // console.error('Navbar user fetch failed:', err);
      // localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // const handleLogout = () => {
  //   localStorage.clear();
  //   window.location.href = '/auth';
  // };

  // User subtitle formatter
   // 🔥 LOGOUT FUNCTION
     // 🔥 FIXED LOGOUT - MANUAL STORAGE CLEAR
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = safeStorage.getItem('token');
      
      // Call backend logout API
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      toast.success('Logged out successfully! 👋');
      
    } catch (error) {
      console.error('Logout API error:', error);
      toast.error('Logged out locally');
    } finally {
      // 🔥 MANUALLY CLEAR ALL STORAGE (NO .clear() method)
      safeStorage.removeItem('token');
      safeStorage.removeItem('user');
      
      // Clear any other items if you have them
      safeStorage.removeItem('refreshToken'); // Optional
      safeStorage.removeItem('userId'); // Optional
      
      // Clear localStorage/sessionStorage as backup
      // localStorage.clear();
      // sessionStorage.clear();
      
      setLoggingOut(false);
      
      // Redirect to login
      navigate('/auth', { replace: true });
    }
  };
  
  const getUserSubtitle = () => {
    if (!user) return '';
    return `${user.branch} ${user.semester}th Sem`;
  };

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-2xl border-b border-white/60 px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-16">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-2xl border-b border-white/60 px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-2xl p-3">
            {/* SVG logo */}
                        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              CampusHub
            </h1>
            <p className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">Student Community</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-80 flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doubts, resources, friends..."
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent shadow-md hover:shadow-lg transition-all duration-300 placeholder-gray-500"
            />
          </form>
        </div>

        {/* Right side - REAL DATA! */}
        <div className="flex items-center space-x-3">
          {/* Real Notifications */}
          <button className="relative p-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 group">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {notifications > 99 ? '99+' : notifications}
              </span>
            )}
          </button>

          {/* Real User Profile */}
          {user ? (
            <div className="flex items-center space-x-2.5 p-2.5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg hover:scale-105 border border-white/50">
              {/* ✅ Real Avatar */}
              <img
                src={user.avatar}
                alt={user.fullname}
                className="w-10 h-10 rounded-2xl ring-2 ring-white/50 shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40?text=👤';
                }}
              />
              <div className="hidden md:block">
                {/* ✅ Real Name */}
                <p className="font-semibold text-gray-900 text-sm truncate max-w-32">
                  {user.fullname || user.username}
                </p>
                {/* ✅ Real Branch/Semester */}
                <p className="text-xs text-gray-500 font-medium">
                  {getUserSubtitle()}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-all duration-300" />
            </div>
          ) : (
            <div className="p-2.5 text-gray-500 rounded-xl cursor-pointer hover:bg-gray-100 transition-all hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-2xl flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Guest</span>
            </div>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ml-1"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}