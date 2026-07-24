import {
  ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Repeat, AlertTriangle, X, ChevronDown, Heart, Trash2
} from 'lucide-react';
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
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [showMainCommentInput, setShowMainCommentInput] = useState(false);
  const [replies, setReplies] = useState({});
  const [saved, setSaved] = useState(false);

  const storedUser = safeStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)._id : null;
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/`;

  const authorName = post.createdBy?.fullname || post.createdBy?.username || post.createdBy?.name || 'Anonymous User';
  const authorAvatar = post.createdBy?.avatar || 'https://via.placeholder.com/44x44/16213A/F4F5EF?text=%F0%9F%91%A4';
  const authorBranch = post.createdBy?.branch;
  const authorSemester = post.createdBy?.semester;

  const commentInputRef = useRef(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const user = safeStorage.getItem('user');
    setUserAvatar(user?.avatar || 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4');
  }, []);

  const postImage = post.file?.url;
  const isImage = post.file?.fileType?.startsWith('image/') || postImage?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const postTime = post.createdAt
    ? new Date(post.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  const postTag = post.subject || post.type || 'General';

  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Just now';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const token = safeStorage.getItem('token');
    if (token && post.likes) {
      setLiked(post.likes.some(like => like.user === 'currentUserId'));
    }
  }, [post]);

  useEffect(() => {
    fetchRecentComments();
  }, [post._id]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    setSaved(savedPosts.some(p => p.id === post._id));
  }, []);

  const handleRepost = () => {
    setShowPostMenu(false);
    toast.success('Post reposted!');
  };

  const handleReport = () => {
    setShowPostMenu(false);
    toast('Post reported. Our team will review it.');
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    const postTitle = post.content.slice(0, 50) + '...';

    if (navigator.share) {
      navigator.share({ title: postTitle, text: post.content.slice(0, 100), url: postUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(postUrl).then(() => {
        toast.success('Link copied!');
      }).catch(() => {
        const el = document.createElement('textarea');
        el.value = postUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        toast.success('Link copied!');
      });
    }
  };

  const handleSave = () => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    const postIndex = savedPosts.findIndex(p => p.id === post._id);

    if (postIndex > -1) {
      savedPosts.splice(postIndex, 1);
      setSaved(false);
      toast.success('Removed from saved');
    } else {
      savedPosts.unshift({ id: post._id, content: post.content, subject: post.subject, createdAt: post.createdAt });
      setSaved(true);
      toast.success('Saved to profile');
    }

    localStorage.setItem('savedPosts', JSON.stringify(savedPosts.slice(0, 50)));
  };

  const fetchReplies = useCallback(async (commentId) => {
    if (replies[commentId]?.loading || (replies[commentId]?.data && replies[commentId].loaded)) return;

    try {
      setReplies(prev => ({ ...prev, [commentId]: { ...prev[commentId], loading: true } }));
      const token = safeStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}comments/${post._id}/${commentId}/replies`,
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
    } catch (err) {
      console.error('Fetch replies error:', err);
      setReplies(prev => ({ ...prev, [commentId]: { ...prev[commentId], loading: false, error: true } }));
    }
  }, [post._id]);

  const fetchRecentComments = async () => {
    try {
      const token = safeStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}comments/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentComments(response.data.comments || []);
    } catch (err) {
      console.error('Comments fetch error:', err);
    }
  };

  const handleLike = async () => {
    try {
      const token = safeStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(
        `${API_BASE_URL}posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 5000 }
      );

      setLiked(response.data.liked ?? !liked);
      setLikesCount(response.data.likesCount !== undefined
        ? response.data.likesCount
        : (liked ? likesCount - 1 : likesCount + 1));
    } catch (err) {
      console.error('Like error:', err.response?.data || err.message);
    }
  };

  const fetchCommentsCount = async () => {
    try {
      const token = safeStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}comments/${post._id}/comments-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentsCount(response.data.commentsCount);
    } catch (err) {
      console.error('Comments count error:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post forever?')) return;
    setShowPostMenu(false);

    try {
      const token = safeStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {}
      });
      toast.success('Post deleted');
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Delete error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleCommentSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = safeStorage.getItem('token');
      await axios.post(`${API_BASE_URL}comments/`, {
        content: commentText.trim(),
        postId: post._id,
        parentCommentId: null
      }, { headers: { Authorization: `Bearer ${token}` } });

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
      const response = await axios.delete(`${API_BASE_URL}comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentsCount(response.data.commentsCount);
      setRecentComments([]);
      fetchCommentsCount();
      fetchRecentComments();
      toast.success(response.data.message);
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const sortedRecentComments = useMemo(() => {
    return recentComments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
  }, [recentComments]);

  const NestedComment = ({ comment, level = 0, postId, onDeleteComment, deletingCommentId, userId }) => {
    const [replying, setReplying] = useState(false);
    const [localReplyText, setLocalReplyText] = useState('');

    const commentReplies = replies[comment._id];
    const repliesLoading = commentReplies?.loading;
    const repliesData = commentReplies?.data || [];

    const isOwner = userId && comment.user?._id && userId === comment.user._id;
    const isDeleting = deletingCommentId === comment._id;
    const isMainComment = level === 0;
    const maxLevel = 3;
    const indent = Math.min(level * 20, 60);

    const fetchRepliesForThis = useCallback(() => fetchReplies(comment._id), [comment._id]);

    const handleReplySubmit = useCallback(async () => {
      if (!localReplyText.trim()) return;
      try {
        const token = safeStorage.getItem('token');
        await axios.post(`${API_BASE_URL}comments/`, {
          content: localReplyText.trim(),
          postId,
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

    return (
      <div className="space-y-2" style={{ marginLeft: indent }}>
        <div className={`flex gap-3 p-3.5 rounded-sm border transition-colors ${
          isMainComment ? 'bg-white border-ink/10' : 'bg-paper border-ink/10'
        }`}>
          <img
            src={comment.user?.avatar || 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4'}
            onError={(e) => e.target.src = 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4'}
            className={`${isMainComment ? 'w-9 h-9' : 'w-7 h-7'} rounded object-cover border border-ink/10 flex-shrink-0`}
            alt="avatar"
          />

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`font-body font-semibold ${isMainComment ? 'text-sm' : 'text-xs'} text-ink`}>
                  {comment.user?.fullname || comment.user?.username || 'User'}
                </span>
                {(comment.user?.branch || comment.user?.semester) && (
                  <span className="font-mono text-[10px] text-ink-soft ml-2">
                    {comment.user?.branch} {comment.user?.semester && `· Sem ${comment.user.semester}`}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-ink-soft flex-shrink-0">{formatTime(comment.createdAt)}</span>
            </div>

            <p className={`${isMainComment ? 'text-sm' : 'text-xs'} font-body text-ink leading-relaxed break-words`}>
              {comment.content}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplying(prev => !prev);
                    if (comment.repliesCount > 0 && !commentReplies?.loaded) fetchRepliesForThis();
                  }}
                  className="font-mono text-[10px] uppercase tracking-wide text-ink-soft hover:text-ink transition-colors"
                >
                  {replying ? 'Cancel' : 'Reply'}
                </button>
                {comment.repliesCount > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); fetchRepliesForThis(); }}
                    className="font-mono text-[10px] uppercase tracking-wide text-redpen hover:text-ink transition-colors"
                  >
                    {comment.repliesCount} replies
                  </button>
                )}
              </div>

              {isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete your comment?')) onDeleteComment(comment._id);
                  }}
                  disabled={isDeleting}
                  className="text-ink-soft hover:text-redpen transition-colors disabled:opacity-50"
                  title="Delete comment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {replying && (
          <div className="p-3.5 bg-paper border border-dashed border-ink/25 rounded-sm" style={{ marginLeft: 12 }}>
            <div className="flex items-start gap-3">
              <img
                src={userAvatar || 'https://via.placeholder.com/32x32/16213A/F4F5EF?text=%F0%9F%91%A4'}
                className="w-8 h-8 rounded object-cover border border-ink/10 flex-shrink-0"
                alt="you"
              />
              <div className="flex-1 space-y-2 min-w-0">
                <textarea
                  value={localReplyText}
                  onChange={(e) => setLocalReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.user?.fullname || 'this comment'}...`}
                  rows={2}
                  className="w-full p-3 bg-white border border-ink/15 rounded font-body text-sm resize-none focus:outline-none focus:border-ink"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && localReplyText.trim()) {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleReplySubmit}
                    disabled={!localReplyText.trim()}
                    className="px-4 py-2 text-sm bg-ink text-paper font-body font-semibold rounded hover:bg-redpen disabled:opacity-40 transition-colors"
                  >
                    Post reply
                  </button>
                  <button
                    onClick={() => { setReplying(false); setLocalReplyText(''); }}
                    className="px-4 py-2 text-sm text-ink-soft font-body font-medium rounded hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {level < maxLevel && comment.repliesCount > 0 && repliesData.length > 0 && (
          <div className="space-y-2 border-l-2 border-dashed border-ink/15 pl-4" style={{ marginLeft: 12 }}>
            {repliesData
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, level === 0 ? 10 : 5)
              .map((reply) => (
                <NestedComment
                  key={reply._id}
                  comment={reply}
                  level={Math.min(level + 1, maxLevel)}
                  postId={postId}
                  onDeleteComment={onDeleteComment}
                  deletingCommentId={deletingCommentId}
                  userId={userId}
                />
              ))}
          </div>
        )}

        {comment.repliesCount > 0 && repliesLoading && (
          <p className="font-mono text-[10px] text-ink-soft" style={{ marginLeft: 12 }}>Loading replies...</p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-ink/10 rounded-sm overflow-hidden">
      <div className="max-h-[650px] overflow-y-auto scrollbar-thin">

        {/* Header */}
        <div className="px-5 py-4 border-b border-dashed border-ink/15 relative">
          <div className="flex items-start gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded object-cover border border-ink/10 flex-shrink-0"
              onError={(e) => e.target.src = 'https://via.placeholder.com/44x44/16213A/F4F5EF?text=%F0%9F%91%A4'}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-body font-semibold text-ink text-sm truncate">{authorName}</h3>
                <span className="w-1.5 h-1.5 bg-highlighter rounded-full flex-shrink-0" />
                <span className="font-mono text-[10px] text-ink-soft">{postTime}</span>
              </div>
              {authorBranch && authorSemester && (
                <p className="font-mono text-[10px] text-ink-soft mt-0.5 hidden sm:block">
                  {authorBranch} · Sem {authorSemester}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-[10px] uppercase tracking-wide bg-paper border border-ink/10 text-ink px-2 py-1 rounded">
                  {postTag}
                </span>

                <div className="relative ml-auto">
                  <button
                    onClick={() => setShowPostMenu(!showPostMenu)}
                    className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper rounded transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {showPostMenu && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-ink/10 rounded-sm shadow-xl z-[100]">
                      <button
                        onClick={handleRepost}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body font-medium text-ink hover:bg-paper transition-colors"
                      >
                        <Repeat className="w-4 h-4 text-ink-soft" /> Repost
                      </button>
                      <button
                        onClick={handleReport}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body font-medium text-ink hover:bg-paper transition-colors border-t border-dashed border-ink/10"
                      >
                        <AlertTriangle className="w-4 h-4 text-ink-soft" /> Report post
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body font-semibold text-redpen hover:bg-redpen/5 transition-colors border-t border-dashed border-ink/10"
                      >
                        <Trash2 className="w-4 h-4" /> Delete post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {showPostMenu && <div className="fixed inset-0 z-10" onClick={() => setShowPostMenu(false)} />}
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {showFullText ? (
            <div className="space-y-3">
              <p className="font-body text-ink leading-relaxed whitespace-pre-wrap">{post.content}</p>
              <button
                onClick={() => setShowFullText(false)}
                className="font-mono text-xs uppercase tracking-wide text-redpen hover:text-ink transition-colors"
              >
                Read less
              </button>
            </div>
          ) : (
            <div className="relative">
              <p className="font-body text-ink leading-relaxed line-clamp-3 pr-16">{post.content}</p>
              {post.content?.length > 120 && (
                <button
                  onClick={() => setShowFullText(true)}
                  className="absolute bottom-0 right-0 font-mono text-xs uppercase tracking-wide text-redpen hover:text-ink bg-white pl-2 transition-colors"
                >
                  more
                </button>
              )}
            </div>
          )}

          {postImage && isImage && (
            <div className="mt-4 rounded-sm border border-ink/10 overflow-hidden cursor-pointer">
              <img
                src={postImage}
                alt="Post attachment"
                className="w-full h-auto max-h-[500px] object-contain"
                onClick={() => setIsImageModalOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-3 border-t border-dashed border-ink/15">
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded flex-1 justify-center transition-colors ${
                liked ? 'bg-redpen/5 text-redpen' : 'text-ink-soft hover:bg-paper hover:text-ink'
              }`}
            >
              {liked ? <Heart className="w-4 h-4 fill-current" /> : <ThumbsUp className="w-4 h-4" />}
              <span className="font-body font-semibold text-sm">{likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center p-2.5 rounded flex-1 text-ink-soft hover:bg-paper hover:text-ink transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center justify-center p-2.5 rounded flex-1 transition-colors ${
                saved ? 'bg-highlighter/20 text-ink' : 'text-ink-soft hover:bg-paper hover:text-ink'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Comments */}
          <div className="mt-3 pt-3 border-t border-dashed border-ink/10">
            <button
              onClick={() => setShowComments(prev => !prev)}
              className="w-full flex items-center gap-3 p-3 rounded hover:bg-paper transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-ink-soft" />
              <span className="font-body font-semibold text-sm text-ink">
                {commentsCount || 0} {commentsCount === 1 ? 'comment' : 'comments'}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft ml-auto">
                {showComments ? 'Hide' : 'Discuss'}
              </span>
            </button>

            {showComments && (
              <div className="mt-4 space-y-4">
                {showMainCommentInput ? (
                  <div className="p-4 bg-white border border-dashed border-ink/25 rounded-sm">
                    <div className="flex items-start gap-3">
                      <img
                        src={userAvatar}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4'}
                        className="w-9 h-9 rounded object-cover border border-ink/10 flex-shrink-0"
                        alt="you"
                      />
                      <div className="flex-1 space-y-2.5">
                        <textarea
                          ref={commentInputRef}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          rows={2}
                          className="w-full p-3 bg-paper border border-ink/15 rounded font-body text-sm resize-none focus:outline-none focus:border-ink"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                              e.preventDefault();
                              handleCommentSubmit();
                            }
                          }}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleCommentSubmit}
                            disabled={!commentText.trim()}
                            className="px-5 py-2 text-sm bg-ink text-paper font-body font-semibold rounded hover:bg-redpen disabled:opacity-40 transition-colors"
                          >
                            Post comment
                          </button>
                          <button
                            onClick={() => { setShowMainCommentInput(false); setCommentText(''); }}
                            className="px-5 py-2 text-sm text-ink-soft font-body font-medium rounded hover:bg-paper transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-3 p-3.5 bg-paper border-2 border-dashed border-ink/20 rounded-sm hover:border-ink/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setShowMainCommentInput(true);
                      setTimeout(() => commentInputRef.current?.focus(), 100);
                    }}
                  >
                    <img
                      src={userAvatar}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/40x40/16213A/F4F5EF?text=%F0%9F%91%A4'}
                      className="w-9 h-9 rounded object-cover border border-ink/10 flex-shrink-0"
                      alt="you"
                    />
                    <span className="font-body text-sm text-ink-soft">Write a comment...</span>
                  </div>
                )}

                {sortedRecentComments.length > 0 && (
                  <div className="space-y-3">
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

                {commentsCount > 2 && (
                  <button className="w-full p-3 text-sm font-body font-semibold text-ink bg-paper hover:bg-white rounded border border-ink/10 transition-colors">
                    View all {commentsCount} comments
                  </button>
                )}

                {sortedRecentComments.length === 0 && commentsCount === 0 && (
                  <div className="text-center py-8 text-ink-soft">
                    <MessageCircle className="w-8 h-8 mx-auto text-ink/20 mb-2" />
                    <p className="font-body font-semibold text-ink text-sm">No comments yet</p>
                    <p className="font-body text-xs">Be the first to start the discussion</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[9999] bg-ink/95"
            onClick={() => setIsImageModalOpen(false)}
          />
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8">
            <button
              onClick={(e) => { e.stopPropagation(); setIsImageModalOpen(false); }}
              className="absolute top-8 right-8 z-[10001] p-3 bg-white/10 hover:bg-white/20 text-paper rounded transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={postImage}
              alt="Fullscreen post attachment"
              className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-sm"
            />
          </div>
        </>
      )}
    </div>
  );
}