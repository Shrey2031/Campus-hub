import { Users } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import safeStorage from '../../contexts/safeStorage';

export default function RightSidebarActiveUsers() {
  const [activeUsers, setActiveUsers] = useState([]);
  const token = safeStorage.getItem('token');
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/active`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setActiveUsers(res.data.users || []));
  }, [token]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            Active Now ({activeUsers.length})
          </h3>
          <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-sm flex items-center gap-1">
            ● Live
          </span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
        {activeUsers.slice(0, 4).map((user) => (
          <a 
            key={user._id}
            href={`/profile/${user._id}`}
            className="w-full group flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-xl hover:bg-emerald-50/50 transition-all cursor-pointer border hover:border-emerald-200 shadow-sm hover:shadow-md block"
          >
            <div className="relative flex-shrink-0">
              <img 
                src={user.avatar} 
                alt={user.fullname}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl ring-2 ring-white shadow-lg object-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/44/6B7280/FFFFFF?text=👤'}
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                user.status === 'online' ? 'bg-emerald-500 text-white' : 'bg-orange-400 text-white'
              }`}>
                ●
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-emerald-700 truncate">
                {user.fullname}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">
                {user.branch} • {user.semester} Sem
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}