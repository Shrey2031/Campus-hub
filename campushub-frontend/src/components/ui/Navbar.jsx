import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, Loader2, User, Menu, X,
  Home, BookOpen, Users, MessageSquare, Settings, Bot , MessageCircle,
  Upload
 } from 'lucide-react';
import axios from 'axios';
import safeStorage from '../../contexts/safeStorage';
import { useNavigate,useLocation } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Feed', path: '/', activePath: '/' },
  { icon: BookOpen, label: 'Resources', path: '/resources', activePath: '/resources' },
  { icon: MessageCircle, label: 'Discussions', path: '/discussions', activePath: '/discussions' },
  { icon: Bot, label: 'AI Assistant', path: '/ai-chat', activePath: '/ai-chat' },
  { icon: Upload, label: 'Upload', path: '/upload-page' , activePath: '/upload-page' },
  { icon: User, label: 'Profile', path: '/profile', activePath: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings', activePath: '/settings' },
];

export default function TopNavbar({onMobileMenuToggle}) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

      const userRes = await axios.get(`${API_BASE_URL}/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userRes.data.data.user);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
    setIsSearchOpen(false); // Close search on mobile after submit
  };

  
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);  // 👈 PASS to parent
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = safeStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Logged out successfully! 👋');
    } catch (error) {
      console.error('Logout API error:', error);
      toast.error('Logged out locally');
    } finally {
      safeStorage.removeItem('token');
      safeStorage.removeItem('user');
      safeStorage.removeItem('refreshToken');
      safeStorage.removeItem('userId');
      setLoggingOut(false);
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
    <div className="bg-white/95 backdrop-blur-2xl border-b border-white/60 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 shadow-lg">
      

<div className="max-w-7xl mx-auto flex items-center justify-between">
  {/* Logo - Always visible */}
  <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-2xl p-2.5 sm:p-3 shrink-0">
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
      </svg>
    </div>
    <div className="hidden sm:block">
      <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent leading-tight">
        CampusHub
      </h1>
      <p className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">Student Community</p>
    </div>
    {/* Mobile Logo Text */}
    <div className="sm:hidden block ml-2">
      <h1 className="text-lg font-bold text-gray-900">CampusHub</h1>
    </div>
  </div>

  {/* FLEXIBLE CENTER SECTION - Search on Desktop, Search+Menu on Mobile */}
  <div className="flex-1 flex items-center justify-center px-4 lg:px-8 max-w-md mx-auto">
    {/* Desktop Search - Hidden on mobile */}
    <div className="hidden lg:flex relative w-full max-w-md flex-1">
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

    {/* Mobile Search Button - Always visible and properly positioned */}
    <button
      onClick={() => setIsSearchOpen(true)}
      className="lg:hidden p-2.5 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ml-auto"
      aria-label="Search"
    >
      <Search className="w-5 h-5" />
    </button>
  </div>

  {/* Right side - Desktop & Mobile Menu Button */}
  <div className="flex items-center space-x-2 flex-shrink-0">
    {/* Desktop Right Side */}
    <div className="hidden md:flex items-center space-x-3">
      <button className="relative p-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 group">
        <Bell className="w-5 h-5" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
            {notifications > 99 ? '99+' : notifications}
          </span>
        )}
      </button>

      {user ? (
        <div className="flex items-center space-x-2.5 p-2.5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg hover:scale-105 border border-white/50">
          <img
            src={user.avatar}
            alt={user.fullname}
            className="w-10 h-10 rounded-2xl ring-2 ring-white/50 shadow-lg object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40?text=👤';
            }}
          />
          <div className="hidden md:block">
            <p className="font-semibold text-gray-900 text-sm truncate max-w-32">
              {user.fullname || user.username}
            </p>
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

      {user && (
        <button
          onClick={handleLogout}
          className="p-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ml-1"
          title="Logout"
          disabled={loggingOut}
        >
          {loggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
        </button>
      )}
    </div>

    {/* Mobile Menu Button - Always last */}
    <button
      // onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      onClick={toggleMobileMenu}
      className="md:hidden p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
      aria-label="Menu"
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  </div>
</div>

      {/* Mobile Search Overlay */}
     
 {isSearchOpen && (
        <div 
        // className="lg:hidden fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
            className="lg:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-[150] flex items-center justify-center p-4 pt-20 sm:pt-24" 
         onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-md border border-white/60 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center mb-4">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h3 className="text-lg font-bold text-gray-900 ml-3 flex-1">Search</h3>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doubts, resources, friends..."
                className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-transparent shadow-lg"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}
      

       {/* Replace your existing Mobile Sidebar section with THIS: */}
            {isMobileMenuOpen && (
  <div className="md:hidden fixed inset-0 bg-black/60 z-[999] flex">
    {/* 🔥 FULL WIDTH MOBILE SIDEBAR - 85% width */}
    <div className="w-[85vw] max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl h-screen flex flex-col z-[1000]">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 sticky top-0 bg-white/100 z-10 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">CampusHub</h1>
              <p className="text-sm text-indigo-600 font-medium">Menu</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 🔥 FULL HEIGHT SCROLLABLE MENU */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Menu Items */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.activePath);
          
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`group w-full flex items-center p-5 rounded-2xl transition-all duration-300 font-semibold text-left text-base h-16 ${
                active
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              <Icon className={`w-7 h-7 mr-4 group-hover:scale-110 transition-all ${active ? 'drop-shadow-lg' : ''}`} />
              <span className="flex-1 font-medium">{item.label}</span>
              {active && <div className="ml-auto w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse"></div>}
            </button>
          );
        })}
        
        {/* Logout - Bottom spacing */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            className={`group w-full flex items-center p-5 rounded-2xl transition-all duration-300 font-semibold text-left text-base h-16 ${
              loggingOut 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-lg'
            }`}
          >
            <LogOut className={`w-7 h-7 mr-4 group-hover:scale-110 transition-all ${loggingOut ? 'animate-spin' : ''}`} />
            <span className="flex-1 font-medium">{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}
 
    </div>
  );
}