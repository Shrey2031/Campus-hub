

import { useState, useEffect } from 'react';
import TopNavbar from '../components/ui/Navbar';
import CreatePost from '../components/ui/CreatePost';
import PostCard from '../components/ui/PostCard';
import Sidebar from '../components/ui/Sidebar';
import RightSidebar from '../components/ui/RightPanel';
import safeStorage from '../contexts/safeStorage';
import axios from 'axios';
import { FileText } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api/v1';

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const token = safeStorage.getItem('token');
      if (!token) {
        setError('Please login to view posts');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/posts/get-post?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Posts fetched:', response.data);

      const newPosts = response.data.posts || [];
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length > 0);
      setError(null);
    } catch (err) {
      console.error('Posts fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center p-12">
          <div className="animate-spin rounded-3xl h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-8 shadow-2xl"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Loading your feed...</p>
          <p className="text-lg text-gray-500 mt-2">Discover what's happening</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopNavbar />
      
      <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 overflow-hidden">
        {/* Enhanced Sidebar */}
        <div className="w-80 flex-shrink-0 h-full border-r border-gray-150 bg-white/80 backdrop-blur-sm shadow-2xl">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="max-w-[2600px] mx-auto px-6 lg:px-12 py-8 lg:py-16">
              <div className="flex gap-8 lg:gap-12 max-w-7xl mx-auto w-full">
                
                {/* Posts Feed - FIXED */}
                <div className="flex-1 max-w-5xl lg:max-w-6xl space-y-8 lg:space-y-10 pr-0 lg:pr-16">
                  
                  {/* Enhanced Error State */}
                  {error && (
                    <div className="p-10 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-3xl shadow-2xl backdrop-blur-sm text-center mx-auto max-w-2xl">
                      <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                      </div>
                      <p className="text-xl font-bold text-red-800 mb-4 leading-relaxed">{error}</p>
                      <button 
                        onClick={() => fetchPosts(1)}
                        className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-3xl hover:shadow-3xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                      >
                        🔄 Retry Loading
                      </button>
                    </div>
                  )}

                  {/* ✅ FIXED: CreatePost - NO STICKY, Normal flow */}
                  <CreatePost />

                  {/* Real Posts */}
                  {posts.length === 0 ? (
                    <div className="text-center py-32 lg:py-48 text-gray-500 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-2xl mx-auto max-w-2xl">
                      <div className="w-32 h-32 mx-auto mb-8 lg:mb-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-xl">
                        <FileText className="w-16 h-16 text-gray-400" />
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">No posts yet</h3>
                      <p className="text-xl mb-12 text-gray-600 max-w-md mx-auto leading-relaxed">Be the first to share your doubts and questions!</p>
                      <CreatePost />
                    </div>
                  ) : (
                    <div className="space-y-6 lg:space-y-8">
                      {posts.map((post) => (
                        <div key={post._id} className="animate-in slide-in-from-bottom-2 duration-500">
                          <PostCard 
                            post={post} 
                            onPostUpdate={(postId) => {
                              fetchPosts(page);
                            }}
                          />
                        </div>
                      ))}
                      
                      {/* Enhanced Load More */}
                      {hasMore && (
                        <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-2xl hover:shadow-3xl transition-all mx-auto max-w-2xl">
                          <button
                            onClick={loadMorePosts}
                            className="group px-12 py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xl rounded-3xl shadow-3xl hover:shadow-4xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 mx-auto flex items-center space-x-3"
                          >
                            <span>📜 Load More Posts</span>
                            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin group-hover:opacity-100 opacity-0 transition-all"></div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Right Sidebar */}
                <div className="w-96 lg:w-[500px] flex-shrink-0 hidden xl:block">
                  <div className="sticky top-8 h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 space-y-8 pr-4">
                    <RightSidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}