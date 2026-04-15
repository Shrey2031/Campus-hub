
import { Home, BookOpen, MessageCircle, Upload, User, Settings, LogOut, Bot } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import safeStorage from '../../contexts/safeStorage'; 
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

const menuItems = [
  { icon: Home, label: 'Feed', path: '/', activePath: '/' },
  { icon: BookOpen, label: 'Resources', path: '/resources', activePath: '/resources' },
  { icon: MessageCircle, label: 'Discussions', path: '/discussions', activePath: '/discussions' },
  { icon: Bot, label: 'AI Assistant', path: '/ai-chat', activePath: '/ai-chat' },
  { icon: Upload, label: 'Upload', path: '/upload-page' , activePath: '/upload-page' },
  { icon: User, label: 'Profile', path: '/profile', activePath: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings', activePath: '/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false); // ✅ Loading state

  const isActive = (path) => location.pathname.startsWith(path);

  // 🔥 LOGOUT FUNCTION
     // 🔥 FIXED LOGOUT - MANUAL STORAGE CLEAR
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const token = safeStorage.getItem('token');
      
      // Call backend logout API
      await axios.post('http://localhost:5000/api/v1/users/logout', {}, {
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

  return (
    <div className="w-72 bg-white/90 backdrop-blur-2xl border-r border-white/50 h-screen sticky top-0 shadow-2xl">
      <div className="p-8">
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.activePath);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group w-full flex items-center p-4 rounded-2xl transition-all duration-300 font-semibold text-left ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-indigo-200'
                }`}
              >
                <Icon className={`w-6 h-6 mr-4 group-hover:scale-110 transition-all ${active ? 'drop-shadow-lg' : ''}`} />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
          
          {/* 🔥 WORKING LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            className={`group w-full flex items-center p-4 rounded-2xl transition-all duration-300 font-semibold text-left ${
              loggingOut 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-red-200'
            }`}
          >
            <LogOut className={`w-6 h-6 mr-4 group-hover:scale-110 transition-all ${loggingOut ? 'animate-spin' : ''}`} />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}