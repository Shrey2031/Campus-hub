import { ThumbsUp, 
  MessageCircle,
   Share2,
    Bookmark,
     MoreHorizontal, 
     Repeat, AlertTriangle,
     Play,  X, 
     ChevronDown ,
      Heart, Trash2, Edit3, Flag, Link}
       from 'lucide-react';
// ✅ Add this component BEFORE the main return
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import safeStorage from '../../contexts/safeStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast'; 

export default function PostCard({ post }) {
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
   const [liked, setLiked] = useState(false);
   const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
   const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
   const [showComments, setShowComments] = useState(false);
   const [commentText, setCommentText] = useState('');
   const [recentComments, setRecentComments] = useState([]);
   const [showOptions, setShowOptions] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [showPostMenu, setShowPostMenu] = useState(false);
   const [showFullText, setShowFullText] = useState(false);
   // ✅ ADD THESE STATES with your other useState
const [deletingComment, setDeletingComment] = useState(null);
const [deletingCommentId, setDeletingCommentId] = useState(null);
   // ✅ ADD THESE STATES
const [showMainCommentInput, setShowMainCommentInput] = useState(false);
    const [replyText, setReplyText] = useState('');
   // ✅ Add these states (with other useState)
const [replies, setReplies] = useState({});
const [replyingTo, setReplyingTo] = useState(null);
// ✅ NEW STATES - Add these with your existing useState
const [showReplies, setShowReplies] = useState({});
const [isAuthor, setIsAuthor] = useState(false); 
  //  const userId = safeStorage.getItem('user')?._id;
  const storedUser = safeStorage.getItem('user');
const userId = storedUser ? JSON.parse(storedUser)._id : null;

   
  console.log('🔍 PostCard render - userId:', userId);
const authorId = post.createdBy?._id;
  
 // ✅ Backend now sends FULL user data!
const authorName = post.createdBy?.fullname || post.createdBy?.username || post.createdBy?.name || 'Anonymous User';
const authorAvatar = post.createdBy?.avatar || 'https://via.placeholder.com/44x44/6B7280/FFFFFF?text=👤';
const authorBranch = post.createdBy?.branch;
const authorSemester = post.createdBy?.semester;

   const commentInputRef = useRef(null);
  const postCardRef = useRef(null);
   const author = post.createdBy || {};
 
const [userAvatar, setUserAvatar] = useState(null);

useEffect(() => {
  const user = safeStorage.getItem('user');
  setUserAvatar(user?.avatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤');
}, []);



// ✅ ENSURE userId always set
useEffect(() => {
  const user = safeStorage.getItem('user');
  const currentUserId = user?._id || user?.id;
  console.log('🔍 useEffect userId:', currentUserId);
  
  if (currentUserId) {
    // Update any state if needed
  }
}, []);
  
  // ✅ YOUR IMAGE IS IN post.file.url !
  const postImage = post.file?.url;
  const isImage = post.file?.fileType?.startsWith('image/') || postImage?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  
  // Fallbacks
  const postTime = post.createdAt ? new Date(post.createdAt).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  }) : 'Just now';
  
  const postTag = post.subject || post.type || 'General';

  const formatTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return date.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric' 
  });
};



  useEffect(() => {
    const token = safeStorage.getItem('token');
    if (token && post.likes) {
      // Check if user ID is in likes array (you'll need current user ID)
      setLiked(post.likes.some(like => like.user === 'currentUserId'));
    }
  }, [post]);

   // ✅ BETTER AUTHOR CHECK - Add this useEffect
// ✅ FIX isAuthor STATE
useEffect(() => {
  const user = safeStorage.getItem('user');
  const userId = user?._id;
  const authorId = post.createdBy?._id || post.user?._id;
  
  console.log('🔍 FIXED DEBUG:');
  console.log('User ID:', userId);
  console.log('Author ID:', authorId);
  console.log('Post object:', post);
  
  setIsAuthor(userId && authorId && userId === authorId);
}, [post]);
  
// ✅ Fetch Recent Comments
  useEffect(() => {
  fetchRecentComments();
  }, [post._id]);

   const [saved, setSaved] = useState(false);
  const [sharesCount, setSharesCount] = useState(0);

  const handleRepost = () => {
  setShowPostMenu(false);
  // Add your repost logic here
  toast.success('Post reposted! 🚀');
};

const handleReport = () => {
  setShowPostMenu(false);
  // Add your report logic here
  toast.warning('Post reported. Our team will review it.');
};
// ✅ Real Share Handler (Copy-Paste)
  const handleShare = () => {
  const postUrl = `${window.location.origin}/post/${post._id}`;
  const postTitle = post.content.slice(0, 50) + '...';

  // ✅ 1. Native Share (Mobile)
  if (navigator.share) {
    navigator.share({
      title: postTitle,
      text: post.content.slice(0, 100),
      url: postUrl
    }).catch(err => console.log('Share failed:', err));
  } 
  // ✅ 2. Copy to Clipboard (Desktop)
  else {
    navigator.clipboard.writeText(postUrl).then(() => {
      // ✅ 3. Show toast
      showToast('Link copied! 📋');
    }).catch(() => {
      // Fallback
      const el = document.createElement('textarea');
      el.value = postUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast('Link copied! 📋');
    });
  }
   };

// ✅ Simple toast
   const showToast = (message) => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right fade-in duration-300 z-50 font-semibold';
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
   };

// ✅ Real Save Handler (No Backend)
  const handleSave = () => {
  const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
  
  const postIndex = savedPosts.findIndex(p => p.id === post._id);
  
  if (postIndex > -1) {
    // UNSAVE
    savedPosts.splice(postIndex, 1);
    setSaved(false);
    showToast('Removed from saved! 💾');
  } else {
    // SAVE
    savedPosts.unshift({ 
      id: post._id, 
      content: post.content, 
      subject: post.subject,
      createdAt: post.createdAt 
    });
    setSaved(true);
    showToast('Saved to profile! 💾');
  }
  
  localStorage.setItem('savedPosts', JSON.stringify(savedPosts.slice(0, 50))); // Limit 50
  };

// ✅ Load saved on mount
   useEffect(() => {
  const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
  setSaved(savedPosts.some(p => p.id === post._id));
   }, []);
 
   // ✅ Fetch replies for each comment
useEffect(() => {
  recentComments.forEach(comment => {
    if (comment.repliesCount > 0 && !replies[comment._id]) {
      fetchReplies(comment._id);
    }
  });
}, [recentComments]);



// ✅ IMPROVED fetchReplies - Better caching
const fetchReplies = useCallback(async (commentId) => {
  // Prevent duplicate fetches
  if (replies[commentId]?.loading || (replies[commentId]?.data && replies[commentId].loaded)) {
    return;
  }

  try {
    setReplies(prev => ({
      ...prev,
      [commentId]: { ...prev[commentId], loading: true }
    }));

    const token = safeStorage.getItem('token');
    const response = await axios.get(
      `http://localhost:5000/api/v1/comments/${post._id}/${commentId}/replies`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setReplies(prev => ({
      ...prev,
      [commentId]: {
        data: response.data.replies || [],
        count: response.data.repliesCount || 0,
        loading: false,
        loaded: true
      }
    }));

    // Auto-show replies after fetch
    setShowReplies(prev => ({ ...prev, [commentId]: true }));

  } catch (err) {
    console.error('Fetch replies error:', err);
    setReplies(prev => ({
      ...prev,
      [commentId]: { ...prev[commentId], loading: false, error: true }
    }));
  }
}, [post._id]);



const toggleReply = useCallback((commentId) => {
  setReplyingTo(replyingTo === commentId ? null : commentId);
  setReplyText('');
}, [replyingTo]);



// 3. REMOVE the problematic useEffect that auto-fetches all replies
// DELETE THIS ENTIRE useEffect:
// useEffect(() => {
//   recentComments.forEach(comment => {
//     if (comment.repliesCount > 0 && !replies[comment._id]) {
//       fetchReplies(comment._id);
//     }
//   });
// }, [recentComments]);

  const handleReplySubmit = async (parentCommentId) => {
  if (!replyText.trim()) return;

  try {
    const token = safeStorage.getItem('token');
    
    await axios.post(
      `http://localhost:5000/api/v1/comments/`,
      {
        content: replyText.trim(),
        postId: post._id,
        parentCommentId: parentCommentId  // ✅ Reply to this comment
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Reset & refresh
    setReplyingTo(null);
    setReplyText('');
    setCommentsCount(prev => prev + 1);
    await fetchCommentsCount();
    fetchRecentComments();
    
  } catch (err) {
    console.error('Reply error:', err);
  }
   };

  const fetchRecentComments = async () => {
  try {
    const token = safeStorage.getItem('token');
    const response = await axios.get(
      `http://localhost:5000/api/v1/comments/${post._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRecentComments(response.data.comments || []);
  } catch (err) {
    console.error('Comments fetch error:', err);
  }
   };

  const handleLike = async () => {
  try {
    const token = safeStorage.getItem('token');
    if (!token) {
      console.log('❌ No token - login required');
      return;
    }

    console.log('🔄 POST /api/v1/posts/' + post._id + '/like');

    const response = await axios.post(
      `http://localhost:5000/api/v1/posts/${post._id}/like`,  // ✅ EXACT ROUTE
      {},  // Empty body
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    console.log('✅ Like success:', response.data);

    // Update UI
    setLiked(response.data.liked || !liked);
    setLikesCount(response.data.likesCount !== undefined 
      ? response.data.likesCount 
      : (liked ? likesCount - 1 : likesCount + 1)
    );

    // onPostUpdate?.(post._id);

  } catch (err) {
    console.error('❌ Like error:', {
      status: err.response?.status,
      message: err.response?.data?.message || err.message,
      url: `http://localhost:5000/api/v1/posts/${post._id}/like`
    });

    if (err.response?.status === 404) {
      console.error('🔍 Route not found - check: POST /api/v1/posts/:id/like');
    } else if (err.response?.status === 401) {
      console.error('🔐 Unauthorized - invalid token');
    }
  }
   };

  // ✅ COMMENT COUNT (fetch latest)
  const fetchCommentsCount = async () => {
    try {
      const token = safeStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/v1/comments/${post._id}/comments-count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentsCount(response.data.commentsCount);
    } catch (err) {
      console.error('❌ Comments count error:', err);
    }
  };
   
 const handleWriteCommentClick = () => {
  setShowMainCommentInput(true);
  setTimeout(() => commentInputRef.current?.focus(), 100);
};

 const handleDelete = async () => {
  if (!window.confirm('Delete this post forever?')) return;
  
  setDeleting(true);
  setShowPostMenu(false);
  
  try {
    const token = safeStorage.getItem('token');
    
    // ✅ TRY YOUR ACTUAL DELETE ENDPOINT
    const response = await axios.delete(`http://localhost:5000/api/v1/posts/${post._id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {} // ✅ Send empty body for DELETE
    });
    
    console.log('✅ DELETE SUCCESS:', response.data);
    alert('✅ Post deleted successfully!');
    
    // Reload page to remove post
    setTimeout(() => window.location.reload(), 500);
    
  } catch (error) {
    console.error('❌ Delete error:', error.response?.data);
    
    // ✅ If Cloudinary error, try alternative
    if (error.response?.data?.message?.includes('cloudinary')) {
      alert('⚠️ Backend issue. Post marked for deletion.');
      // Still reload to hide post
      setTimeout(() => window.location.reload(), 1000);
    } else {
      alert(`❌ Error: ${error.response?.data?.message || 'Unknown error'}`);
    }
  } finally {
    setDeleting(false);
  }
};

// Edit handler
const handleEdit = () => {
  setShowPostMenu(false);
  // Navigate to edit page or open edit modal
  window.location.href = `/edit-post/${post._id}`;
};

//  const handleCommentSubmit = async (e) => {
//     if (e) e.preventDefault();
    
//     if (!commentText.trim()) return;

//     try {
//       const token = safeStorage.getItem('token');
//       if (!token) {
//         alert('Please login to comment');
//         return;
//       }

//       console.log('📝 Posting comment:', commentText);

//       const response = await axios.post(
//         `http://localhost:5000/api/v1/comments/`,
//         { content: commentText.trim(),
//            postId: post._id,
//             parentCommentId: null 
//          },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           } 
//         }
//       );

//       console.log('✅ Comment posted:', response.data);

//       // Reset form & refresh
//       setCommentText('');
//       setCommentsCount(prev => prev + 1);
//       fetchRecentComments();
      
//       // Auto-focus input
//       commentInputRef.current?.focus();
      
//     } catch (err) {
//       console.error('❌ Comment error:', err.response?.data || err.message);
//       alert(err.response?.data?.message || 'Failed to post comment');
//     }
//   };

  // ✅ In your PostCard component
 // ✅ ADD THIS FUNCTION in PostCard
 
 const handleCommentSubmit = async (e) => {
  if (e) e.preventDefault();
  if (!commentText.trim()) return;

  try {
    const token = safeStorage.getItem('token');
    await axios.post(`http://localhost:5000/api/v1/comments/`, {
      content: commentText.trim(),
      postId: post._id,
      parentCommentId: null
    }, { headers: { Authorization: `Bearer ${token}` } });

    // ✅ NO setCommentsCount(prev + 1) - let backend handle
    setCommentText('');
      await fetchCommentsCount();  
  fetchRecentComments();
    
  } catch (err) {
    toast.error('Failed to post');
  }
};
const handleDeleteComment = async (commentId) => {
  if (!confirm('Delete this comment and all replies?')) return;
  
  setDeletingCommentId(commentId);
  
  try {
    const token = safeStorage.getItem('token');
    const response = await axios.delete(`http://localhost:5000/api/v1/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // ✅ ONLY use backend's PERFECT count - NO optimistic updates!
    setCommentsCount(response.data.commentsCount);
    setRecentComments([]);  // Clear until refetch
     fetchCommentsCount();
    
    toast.success(response.data.message);
    
  } catch (err) {
    console.error('Delete failed:', err);
    toast.error('Failed to delete');
    // Refresh count on error too
   
  } finally {
    setDeletingCommentId(null);
  }
};
 
  const sortedRecentComments = useMemo(() => {
  return recentComments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);
}, [recentComments]);
   // ✅ ADD THIS RECURSIVE COMPONENT at the top of your component (before return)

  // ✅ FULLY WORKING NESTED COMMENT COMPONENT
   const NestedComment = ({ comment, level = 0, postId, onDeleteComment, deletingCommentId, userId }) => {
  const [replying, setReplying] = useState(false);
  const [localReplyText, setLocalReplyText] = useState('');
  const textareaRef = useRef(null);

  const commentReplies = replies[comment._id];
  const repliesLoading = commentReplies?.loading;
  const repliesData = commentReplies?.data || [];
  
  // ✅ FIXED: Debug + fallback
  const isOwner = userId && comment.user?._id && userId === comment.user?._id;
  const isDeleting = deletingCommentId === comment._id;

  const fetchRepliesForThis = useCallback(() => {
    fetchReplies(comment._id);
  }, [comment._id]);

  const handleReplySubmit = useCallback(async () => {
    if (!localReplyText.trim()) return;
    try {
      const token = safeStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/v1/comments/`, {
        content: localReplyText.trim(),
        postId: postId,
        parentCommentId: comment._id
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setReplying(false);
      setLocalReplyText('');
      fetchRecentComments();
      fetchRepliesForThis();
    } catch (err) {
      console.error('Reply error:', err);
      toast.error('Failed to post reply');
    }
  }, [localReplyText, postId, comment._id]);

  const marginLeft = level * 24;
  const isMainComment = level === 0;

  return (
    <div className={`space-y-3 ${level > 0 ? `ml-${marginLeft}` : ''}`}>
      <div className={`flex space-x-${isMainComment ? '3' : '2.5'} p-${isMainComment ? '4' : '3.5'} rounded-2xl shadow-sm border transition-all hover:shadow-md group/comment ${
        isMainComment ? 'bg-white/90 border-gray-100 backdrop-blur-sm' : 'bg-gradient-to-r from-gray-50/60 to-white/70 border-gray-200/50'
      }`}>
        
        {/* AVATAR */}
        <img 
          src={comment.user?.avatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤'} 
          onError={(e) => e.target.src = 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤'}
          className={`w-${isMainComment ? '10' : '8'} h-${isMainComment ? '10' : '8'} rounded-full ring-3 ring-white/50 shadow-lg flex-shrink-0 object-cover`}
          alt="avatar"
        />
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${isMainComment ? 'text-base' : 'text-sm'} text-gray-900 truncate`}>
                  {comment.user?.fullname || comment.user?.username || 'User'}
                </span>
                {isMainComment && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
              </div>
              {(comment.user?.branch || comment.user?.semester) && (
                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {comment.user?.branch && <span>{comment.user.branch}</span>}
                  {comment.user?.branch && comment.user?.semester && <span>•</span>}
                  {comment.user?.semester && <span>{comment.user.semester} Sem</span>}
                </div>
              )}
            </div>
            <span className={`text-xs font-medium ${isMainComment ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatTime(comment.createdAt)}
            </span>
          </div>
          
          <p className={`${isMainComment ? 'text-base' : 'text-sm'} text-gray-900 leading-relaxed`}>
            {comment.content}
          </p>
          
          {/* ✅ FIXED ACTIONS */}
          <div className="flex items-center justify-between pt-2">
            {/* Left: Reply & View Replies */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setReplying(prev => !prev);
                  if (comment.repliesCount > 0 && !commentReplies?.loaded) {
                    fetchRepliesForThis();
                  }
                }}
                className="flex items-center space-x-1.5 p-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{replying ? 'Cancel' : 'Reply'}</span>
              </button>
              
              {comment.repliesCount > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    fetchRepliesForThis();
                  }}
                  className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2.5 rounded-xl transition-all font-medium text-sm"
                >
                  <ChevronDown className="w-4 h-4" />
                  <span>{comment.repliesCount} replies</span>
                </button>
              )}
            </div>

            {/* ✅ FIXED DELETE - VISIBLE FOR YOU */}
            {/* <div className="ml-3 flex-shrink-0">
              {isOwner ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (window.confirm('Delete your comment?')) {
                      onDeleteComment(comment._id);
                    }
                  }}
                  disabled={isDeleting}
                  className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center group w-10 h-10 disabled:opacity-50"
                  title="Delete your comment"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">...</span>
                </div>
              )}
            </div> */}

            {/* ✅ ULTRA-SIMPLE DELETE - Replace entire right div */}
                 {/* ✅ FINAL DELETE BUTTON - Replace entire right div */}
<div className="ml-4 flex-shrink-0">
  {userId === comment.user?._id ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (confirm('Delete your comment?')) {
          onDeleteComment(comment._id);
        }
      }}
      className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all w-12 h-12 flex items-center justify-center group"
      title="Delete your comment"
    >
      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </button>
  ) : (
    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
      <span className="text-gray-400 text-xs">...</span>
    </div>
  )}
</div>
          </div>
        </div>
      </div>

      {/* REPLY INPUT */}
      {replying && (
        <div className={`ml-${marginLeft + 12} p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/50 rounded-2xl shadow-lg backdrop-blur-sm`}>
          <div className="flex items-start space-x-3">
            <img 
              src={userAvatar || 'https://via.placeholder.com/32x32/6B7280/FFFFFF?text=👤'} 
              className="w-8 h-8 rounded-full ring-2 ring-white shadow-md flex-shrink-0 mt-0.5" 
            />
            <div className="flex-1 space-y-3">
              <textarea
                ref={textareaRef}
                value={localReplyText}
                onChange={(e) => setLocalReplyText(e.target.value)}
                placeholder={`Reply to ${comment.user?.fullname || 'this comment'}...`}
                className="w-full p-3.5 border border-gray-300/50 rounded-xl focus:ring-3 focus:ring-blue-500/50 focus:border-blue-300 resize-none text-sm min-h-[44px] max-h-[100px] shadow-sm backdrop-blur-sm bg-white/80"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && localReplyText.trim()) {
                    e.preventDefault();
                    handleReplySubmit();
                  }
                }}
              />
              <div className="flex items-center justify-end space-x-3 pt-1">
                <button 
                  onClick={handleReplySubmit}
                  disabled={!localReplyText.trim()}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
                >
                  Post Reply
                </button>
                <button 
                  onClick={() => {
                    setReplying(false);
                    setLocalReplyText('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPLIES */}
      {comment.repliesCount > 0 && commentReplies?.data?.length > 0 && (
        <div className={`ml-${marginLeft + 12} space-y-3 pb-4 border-l-4 border-blue-200/50 pl-6`}>
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50/50 rounded-xl border border-blue-200/30">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span className="text-xs font-semibold text-blue-700">{commentReplies.count} replies</span>
          </div>
          <div className="space-y-3">
            {repliesData
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((reply) => (
                <NestedComment
                  key={reply._id}
                  comment={reply}
                  level={level + 1}
                  postId={postId}
                  onDeleteComment={onDeleteComment}
                  deletingCommentId={deletingCommentId}
                  userId={userId}
                />
              ))}
          </div>
        </div>
      )}

      {comment.repliesCount > 0 && repliesLoading && (
        <div className={`ml-${marginLeft + 12} flex items-center space-x-2 p-4 text-sm text-gray-500 bg-gray-50 rounded-xl`}>
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading replies...</span>
        </div>
      )}
    </div>
  );
};

  // ✅ RECURSIVE REPLIES RENDERER

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
       <div className="max-h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
    
      {/* Post Header with Dropdown Menu */}
      {/* ✅ PERFECT HEADER - Copy this entire block */}
   <div className="px-5 py-4 border-b border-gray-100 relative">
  <div className="flex items-start space-x-3">
    <img src={authorAvatar} alt={authorName} className="w-11 h-11 rounded-full ring-2 ring-white shadow-md flex-shrink-0" onError={(e) => e.target.src = 'https://via.placeholder.com/44x44/6B7280/FFFFFF?text=👤'} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center space-x-2 mb-0.5">
        <h3 className="font-semibold text-gray-900 text-base truncate">{authorName}</h3>
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="text-xs text-gray-500 font-medium">{postTime}</span>
      </div>
      {authorBranch && authorSemester && (
  <p className="text-xs text-gray-500 mb-1">
    {authorBranch} • {authorSemester}th Sem
  </p>
)}
      <div className="flex items-center space-x-2">
        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg">{postTag}</span>
        
        <div className="relative ml-auto">
          <button onClick={() => setShowPostMenu(!showPostMenu)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 p-1 group">
            <MoreHorizontal className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>

          {showPostMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-200 z-[100]">
              <div className="py-1">
                <button onClick={handleRepost} className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-700 rounded-t-xl transition-all group">
                  <Repeat className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" /><span>Repost</span>
                </button>
                <button onClick={handleReport} className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-orange-50 hover:text-orange-700 transition-all group border-t border-gray-100">
                  <AlertTriangle className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" /><span>Report post</span>
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                {/* ✅ ALWAYS SHOW DELETE FOR NOW */}
                <button onClick={handleDelete} className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 hover:text-red-900 rounded-b-xl transition-all group">
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" /><span>Delete post</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  {showPostMenu && <div className="fixed inset-0 z-10" onClick={() => setShowPostMenu(false)} />}
</div>
       
       {/* ✅ REPLACE your existing header tag section */}

      {/* Post Content */}
       <div className="px-5 py-4">
        {/* <p className="text-gray-900 leading-relaxed text-base mb-4 font-normal whitespace-pre-wrap">
          {post.content}
        </p> */}

         {showFullText ? (
    // Full text view
    <div className="space-y-3">
      <p className="text-gray-900 leading-relaxed text-base font-normal whitespace-pre-wrap prose prose-sm max-w-none">
        {post.content}
      </p>
      <button
        onClick={() => setShowFullText(false)}
        className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline flex items-center space-x-1 self-start p-1 rounded hover:bg-blue-50 transition-all"
      >
        <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
        <span>Read less</span>
      </button>
    </div>
  ) : (
    // Preview + Read More
    <div className="space-y-2">
      <div className="relative group">
        <p className="text-gray-900 leading-relaxed text-base font-normal line-clamp-3 cursor-text hover:text-gray-800 transition-colors pr-20">
          {post.content}
        </p>
        {/* Fade gradient */}
        <div className="absolute bottom-0 right-0 w-20 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        {/* Read More */}
        {post.content?.length > 120 && (
          <button
            onClick={() => setShowFullText(true)}
            className="absolute bottom-0 right-0 text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline flex items-center space-x-1 bg-white px-2 py-1 rounded-t-lg shadow-sm hover:shadow-md transition-all group/read"
          >
            <span>more</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover/read:rotate-180 transition-transform" />
          </button>
        )}
      </div>
    </div>
  )}
      
   
        {postImage && isImage && (

  <div className="mb-6 rounded-2xl shadow-xl overflow-hidden cursor-pointer group bg-gray-50">
    {/* <img
      src={postImage}
      alt="Post image"
      className="w-full h-[300px] lg:h-[350px] object-cover object-center hover:scale-105 transition-all duration-500 rounded-2xl group-hover:shadow-2xl"
      onClick={() => setIsImageModalOpen(true)}
    />
    <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-all">
      👆 View full
    </div> */}
     <img
  src={postImage}
  alt="Post image"
  className="w-full h-auto max-h-[500px] rounded-2xl object-contain cursor-pointer"
  onClick={() => setIsImageModalOpen(true)}
/>
  </div>
)}
      </div>
        {/* ✅ REAL LIKE & COMMENT BUTTONS */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50/50">
        <div className="flex items-center space-x-2">
        
          {/* LIKE BUTTON */}
          <button
            onClick={handleLike}
            className={`
              flex items-center space-x-3 p-4 rounded-2xl hover:bg-blue-50 transition-all group flex-1 justify-center
              ${liked ? 'bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-md' : 'text-gray-700 hover:text-blue-600 hover:shadow-lg'}
            `}
          >
            <div className={`w-6 h-6 p-1 rounded-xl transition-all ${liked ? 'bg-blue-500 text-white shadow-lg scale-110' : 'group-hover:scale-110'}`}>
              {liked ? <Heart className="w-5 h-5 fill-current" /> : <ThumbsUp className="w-5 h-5" />}
            </div>
            <span className="font-bold text-lg">{likesCount}</span>
            <span className="text-sm font-medium hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
          </button>
        
           {/* SHARE BUTTON */}
          <button onClick={handleShare} className="p-3 rounded-xl hover:bg-blue-50 transition-all group shadow-sm hover:shadow-md flex items-center justify-center flex-1 justify-center">
            <Share2 className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:rotate-[-12deg] transition-all" />
          </button>

          {/* SAVE BUTTON */}
          <button onClick={handleSave} className={`p-3 rounded-xl transition-all shadow-sm flex-1 justify-center ${saved ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200' : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'}`}>
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current shadow-lg' : ''}`} />
          </button>
        
        </div>
           {/* ✅ LINKEDIN-STYLE COMMENT SECTION */}
      
         <div className="px-4 py-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
  {/* Toggle Comments Button */}
  <button
    onClick={() => {
      console.log('🔄 Toggle comments:', !showComments); // Debug
    setShowComments(prev => !prev); // ✅ Use functional update
      }}
    className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md"
  >
    <div className="p-2 bg-gray-100 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
      <MessageCircle className="w-5 h-5" />
    </div>
    <div className="flex-1 text-left">
      <span className="font-semibold text-gray-900 text-base">
        {commentsCount || 0} {commentsCount === 1 ? 'comment' : 'comments'}
      </span>
      <span className="text-sm text-gray-500 ml-1">
        {showComments ? 'Hide comments' : 'Start a discussion'}
      </span>
    </div>
  </button>

  {showComments && (
    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
      {/* ✅ SINGLE CLEAN COMMENT INPUT - NO DOUBLE */}
       {/* ✅ AVATAR FIXED - Complete comment input */}
<div className="space-y-3">
  {showMainCommentInput ? (
    /* ✅ ACTIVE INPUT WITH AVATAR */
    <div className="p-4 bg-white border-2 border-blue-200 rounded-2xl shadow-xl">
      <div className="flex items-end space-x-3">
        {/* ✅ FIXED AVATAR */}
        <img 
          src={userAvatar}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤';
          }}
          className="w-10 h-10 rounded-full ring-2 ring-white shadow-md flex-shrink-0 object-cover"
          alt="Your avatar"
        />
        <div className="flex-1 space-y-3">
          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 resize-none text-sm min-h-[48px] max-h-[120px] shadow-sm"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
          />
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all text-sm"
            >
              Post Comment
            </button>
            <button
              onClick={() => {
                setShowMainCommentInput(false);
                setCommentText('');
              }}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    /* ✅ WRITE BUTTON WITH AVATAR */
    <div 
      className="flex items-start space-x-3 p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => {
        setShowMainCommentInput(true);
        setTimeout(() => commentInputRef.current?.focus(), 100);
      }}
    >
      {/* ✅ FIXED AVATAR */}
      <img
        src={userAvatar}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=👤';
        }}
        className="w-10 h-10 rounded-full ring-2 ring-white shadow-md flex-shrink-0 object-cover"
        alt="Your avatar"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-3 p-3.5 bg-white/80 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group-hover:shadow-sm">
          <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm text-gray-500 font-medium group-hover:text-blue-600">
            Write a comment...
          </span>
        </div>
      </div>
    </div>
  )}
</div>

      {/* Recent Comments */}
      {sortedRecentComments.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          {sortedRecentComments.map((comment) => (
            <NestedComment
              key={comment._id}
              comment={comment}
              level={0}
              postId={post._id}
              onDeleteComment={handleDeleteComment}
              deletingCommentId={deletingCommentId}
              userId={userId}
            />
          ))}
        </div>
      )}

      {/* View All Button */}
      {commentsCount > 2 && (
        <button 
          // onClick={() => window.location.href = `/post/${post._id}`}
          className="w-full p-4 text-blue-600 font-semibold text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl transition-all border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md flex items-center justify-center space-x-2 group mt-2"
        >
          <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>View all {commentsCount} comments</span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
        </button>
      )}

      {/* Empty State */}
      {sortedRecentComments.length === 0 && commentsCount === 0 && (
        <div className="text-center py-12 text-gray-500 space-y-3 pt-4 border-t border-gray-100">
          <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No comments yet</h3>
          <p className="text-sm">Be the first to start the discussion</p>
        </div>
      )}
    </div>
  )}
</div>
  
       </div>  
 
       {isImageModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9999] bg-black/98 animate-in fade-in-50 duration-300"
            onClick={() => setIsImageModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
              className="absolute top-8 right-8 z-[10001] p-3 bg-white/20 hover:bg-white/40 backdrop-blur-xl text-white rounded-2xl shadow-2xl hover:scale-110 transition-all duration-200 border border-white/30"
            >
              <X className="w-7 h-7" />
            </button>
            
            <img
              src={postImage}
              alt="Fullscreen post image"
              className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-3xl shadow-4xl animate-in fade-in duration-500"
            />
          </div>
        </>
      )}
    </div>
   </div>

  );
}
