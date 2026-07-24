import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, Loader2, User, Menu, X, BookOpen } from 'lucide-react';
import axios from 'axios';
import safeStorage from '../../contexts/safeStorage';
import useLogout from '../../contexts/useLogout';
import { menuItems } from '../../config/navigation';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TopNavbar({ onMobileMenuToggle }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout, loggingOut } = useLogout();

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
    setIsSearchOpen(false);
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
  };

  const getUserSubtitle = () => {
    if (!user) return '';
    return `${user.branch} ${user.semester}th Sem`;
  };

  if (loading) {
    return (
      <div className="bg-paper border-b-2 border-dashed border-ink/20 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-16">
          <Loader2 className="w-6 h-6 animate-spin text-ink" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper/95 backdrop-blur border-b-2 border-dashed border-ink/20 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-ink rounded flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-paper" strokeWidth={2} />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-ink text-xl leading-tight">
              Campus<span className="text-redpen">Hub</span>
            </h1>
            <p className="font-mono text-[10px] text-ink-soft tracking-widest uppercase">Student Community</p>
          </div>
          <div className="sm:hidden block ml-1">
            <h1 className="font-display font-bold text-ink text-lg">CampusHub</h1>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center justify-center px-4 lg:px-8 max-w-md mx-auto">
          <div className="hidden lg:flex relative w-full max-w-md flex-1">
            <form onSubmit={handleSearch} className="w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doubts, resources, friends..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-ink/15 rounded font-body text-sm focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10 transition-colors placeholder-ink-soft"
              />
            </form>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2.5 text-ink-soft hover:text-ink rounded transition-colors ml-auto"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="hidden md:flex items-center space-x-3">
            <button className="relative p-2.5 text-ink-soft hover:text-ink hover:bg-white rounded transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-redpen text-paper text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications > 99 ? '99+' : notifications}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2.5 p-2 hover:bg-white rounded transition-colors cursor-pointer group border border-transparent hover:border-ink/10">
                <img
                  src={user.avatar}
                  alt={user.fullname}
                  className="w-9 h-9 rounded object-cover border border-ink/10"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=%F0%9F%91%A4'; }}
                />
                <div className="hidden md:block">
                  <p className="font-body font-semibold text-ink text-sm truncate max-w-32">
                    {user.fullname || user.username}
                  </p>
                  <p className="font-mono text-[10px] text-ink-soft uppercase tracking-wide">
                    {getUserSubtitle()}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-ink-soft group-hover:rotate-180 transition-transform" />
              </div>
            ) : (
              <div className="p-2.5 text-ink-soft rounded hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-ink/5 rounded flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-body">Guest</span>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="p-2.5 text-ink-soft hover:text-redpen hover:bg-white rounded transition-colors ml-1"
                title="Logout"
                aria-label="Logout"
                disabled={loggingOut}
              >
                {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
              </button>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-ink-soft hover:text-ink rounded transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div
          className="lg:hidden fixed top-0 left-0 right-0 bottom-0 bg-ink/60 z-[150] flex items-center justify-center p-4 pt-20 sm:pt-24"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-paper rounded-sm p-6 w-full max-w-md border border-ink/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-white rounded transition-colors" aria-label="Close search">
                <X className="w-5 h-5 text-ink-soft" />
              </button>
              <h3 className="font-display font-bold text-ink ml-3 flex-1">Search</h3>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doubts, resources, friends..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-ink/15 rounded font-body focus:outline-none focus:border-ink"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu drawer - now reads from the shared menuItems config */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-ink/60 z-[999] flex">
          <div className="w-[85vw] max-w-md bg-paper shadow-2xl h-screen flex flex-col z-[1000]">
            <div className="p-6 border-b-2 border-dashed border-ink/20 sticky top-0 bg-paper z-10 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-ink rounded flex items-center justify-center">
                    <BookOpen size={20} className="text-paper" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-ink text-lg">CampusHub</h1>
                    <p className="font-mono text-[10px] text-ink-soft uppercase tracking-wide">Menu</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white rounded transition-colors" aria-label="Close menu">
                  <X className="w-6 h-6 text-ink-soft" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-2">
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
                    className={`group relative w-full flex items-center p-4 rounded font-body font-semibold text-left text-base transition-colors ${
                      active ? 'bg-ink text-paper' : 'text-ink hover:bg-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3.5" />
                    <span className="flex-1">{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-highlighter" />}
                  </button>
                );
              })}

              <div className="mt-8 pt-6 border-t border-dashed border-ink/20">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`w-full flex items-center p-4 rounded font-body font-semibold text-left transition-colors ${
                    loggingOut ? 'text-ink-soft cursor-not-allowed' : 'text-redpen hover:bg-redpen/5'
                  }`}
                >
                  <LogOut className={`w-5 h-5 mr-3.5 ${loggingOut ? 'animate-spin' : ''}`} />
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}