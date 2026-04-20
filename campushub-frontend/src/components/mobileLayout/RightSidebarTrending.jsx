import { TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import safeStorage from '../../contexts/safeStorage';

export default function RightSidebarTrending() {
  const [trending, setTrending] = useState([]);
  const token = safeStorage.getItem('token');
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/posts/trending-topics`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTrending(res.data.topics || []));
  }, [token]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          Trending Now
        </h3>
      </div>
      
      <div className="p-3 sm:p-4 space-y-2 flex-1 overflow-y-auto">
        {trending.slice(0, 6).map((topic, i) => (
          <a 
            key={topic}
            href={`/search?q=${encodeURIComponent(topic)}`}
            className="w-full group flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all border hover:border-orange-200 shadow-sm hover:shadow-md block"
          >
            <span className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-orange-700 truncate">
              #{topic}
            </span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-all">
              <span className="text-xs font-bold text-orange-600">
                +{(i + 1) * 5}K
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}