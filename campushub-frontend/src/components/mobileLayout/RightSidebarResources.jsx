import { BookOpen, Download, ChevronRight, Eye } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import safeStorage from '../../contexts/safeStorage';

export default function RightSidebarResources() {
  const [resources, setResources] = useState([]);
  const token = safeStorage.getItem('token');
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/posts/resources/top`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setResources(res.data.resources || []));
  }, [token]);

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "resource.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            Top Resources ({resources.length})
          </h3>
          <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-sm">
            ● Popular
          </span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
        {resources.slice(0, 3).map((resource) => (
          <div key={resource._id} className="group flex items-start space-x-2 sm:space-x-3 p-3 rounded-xl hover:bg-amber-50/50 transition-all cursor-pointer border hover:border-amber-200 shadow-sm hover:shadow-md h-16 sm:h-20 relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-lg sm:text-2xl">{resource.icon || '📚'}</span>
            </div>
            <div className="flex-1 min-w-0 py-1">
              <p className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-amber-700 line-clamp-1 mb-0.5">
                {resource.title}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">
                by {resource.author?.fullname || resource.author}
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <span className="text-xs bg-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-gray-600 font-medium shadow-sm">
                {resource.type || 'PDF'}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {resource.views?.toLocaleString() || '1K'}
              </span>
            </div>
            <button
              onClick={() => handleDownload(resource.fileUrl)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white/90 hover:bg-white rounded-xl shadow-lg hover:shadow-xl border hover:border-amber-300 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-110"
              title="Download"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 hover:text-amber-700" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-3 sm:p-4 pt-2 border-t border-gray-100">
        <a href="/resources" className="w-full flex items-center justify-center gap-1.5 text-amber-600 font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl hover:bg-amber-50 transition-all shadow-sm hover:shadow-md border border-amber-200 hover:border-amber-300">
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Browse All</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}