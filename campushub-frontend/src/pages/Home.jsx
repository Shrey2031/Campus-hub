import { useState, useEffect } from 'react';
import TopNavbar from '../components/ui/Navbar';
import CreatePost from '../components/ui/CreatePost';
import PostCard from '../components/ui/PostCard';
import Sidebar from '../components/ui/Sidebar';
import RightSidebar from '../components/ui/RightPanel';
import safeStorage from '../contexts/safeStorage';
import RightSidebarActiveUsers from '../components/mobileLayout/RightSidebarActiveUsers';
import RightSidebarNotifications from '../components/mobileLayout/RightSidebarNotification';
import RightSidebarResources from '../components/mobileLayout/RightSidebarResources';
import RightSidebarTrending from '../components/mobileLayout/RightSidebarTrending';
import axios from 'axios';
import { FileText, AlertTriangle, Loader2 } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

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
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-ink mx-auto mb-4" />
          <p className="font-display font-bold text-ink text-lg">Loading your feed...</p>
          <p className="font-body text-ink-soft text-sm mt-1">Discover what's happening</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopNavbar onMobileMenuToggle={setIsMobileSidebarOpen} />

      <div className="flex h-[calc(100vh-80px)] bg-paper overflow-hidden">
        <div className="hidden lg:block w-72 flex-shrink-0 h-full border-r-2 border-dashed border-ink/20">
          <Sidebar />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
              <div className="lg:flex lg:gap-12 w-full">

                <div className="lg:w-[65%] order-2 lg:order-1 flex-shrink-0">
                  <div className="space-y-6 lg:space-y-8 pr-0 lg:pr-8">
                    <CreatePost />

                    <div className="block lg:hidden space-y-6 w-full">
                      <div className="h-72 w-full"><RightSidebarNotifications /></div>
                      <div className="h-64 w-full"><RightSidebarTrending /></div>
                      <div className="h-72 w-full"><RightSidebarActiveUsers /></div>
                      <div className="h-[22rem] w-full"><RightSidebarResources /></div>
                    </div>

                    {error && (
                      <div className="p-8 bg-white border border-redpen/30 rounded-sm text-center mx-auto max-w-2xl">
                        <div className="w-14 h-14 bg-redpen/5 rounded flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-7 h-7 text-redpen" />
                        </div>
                        <p className="font-body font-semibold text-ink mb-4">{error}</p>
                        <button
                          onClick={() => fetchPosts(1)}
                          className="px-6 py-2.5 bg-ink text-paper font-body font-semibold rounded hover:bg-redpen transition-colors"
                        >
                          Retry loading
                        </button>
                      </div>
                    )}

                    {posts.length === 0 ? (
                      <div className="text-center py-20 text-ink-soft bg-white border border-ink/10 rounded-sm mx-auto max-w-2xl">
                        <div className="w-16 h-16 mx-auto mb-6 bg-paper border border-ink/10 rounded flex items-center justify-center">
                          <FileText className="w-8 h-8 text-ink-soft" />
                        </div>
                        <h3 className="font-display font-bold text-ink text-2xl mb-2">No posts yet</h3>
                        <p className="font-body text-ink-soft mb-8 max-w-md mx-auto">
                          Be the first to share your doubts and questions.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {posts.map((post) => (
                          <PostCard key={post._id} post={post} onPostUpdate={() => fetchPosts(page)} />
                        ))}
                        {hasMore && (
                          <div className="text-center py-10 bg-white border border-ink/10 rounded-sm mx-auto max-w-2xl">
                            <button
                              onClick={loadMorePosts}
                              className="px-8 py-3.5 bg-ink text-paper font-body font-semibold rounded hover:bg-redpen transition-colors"
                            >
                              Load more posts
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden lg:block lg:w-[35%] order-1 lg:order-2 flex-shrink-0 mb-8 lg:mb-0">
                  <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-4">
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