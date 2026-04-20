import {Comment} from '../models/comment.model.js';
import {Post} from '../models/post.model.js';
import Notification from '../models/notification.model.js';

// ✅ Add this at top of file (or import from notifications controller)
const formatTime = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
};

// 🟢 CREATE COMMENT / REPLY
// export const createComment = async (req, res) => {
//   try {
//     const { content, postId, parentCommentId } = req.body;
//     const userId = req.user._id;

//     // Validate post exists
//     // const post = await Post.findById(postId);
//       const post = await Post.findById(req.body.postId).populate('createdBy');
//     if (post.createdBy._id.toString() !== req.user.id) {
//       await createNotification(
//         post.createdBy._id,
//         `${req.user.fullname} commented on your post`,
//         'New comment on your post',
//         'comment',
//         post._id
//       );
//     }
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: 'Post not found!'
//       });
//     }

//     const comment = new Comment({
//       content,
//       post: postId,
//       user: userId,
//       parentComment: parentCommentId || null
//     });

//     await comment.save();

//     // 🔥 INCREMENT COUNTS
//     if (!parentCommentId) {
//       // Main comment → increment post commentsCount
//       post.commentsCount += 1;
//       await post.save();
//     } else {
//       // Reply → increment parent comment repliesCount
//       await Comment.findByIdAndUpdate(parentCommentId, {
//         $inc: { repliesCount: 1 }
//       });
//     }

//     // Populate everything
//     await comment.populate([
//       { path: 'user', select: 'name avatar' },
//       { path: 'parentComment', select: 'content user createdAt', populate: { path: 'user', select: 'name avatar' } }
//     ]);

//     res.status(201).json({
//       success: true,
//       message: parentCommentId ? 'Reply added!' : 'Comment added!',
//       comment
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


export const createComment = async (req, res) => {
  try {
    console.log('📝 CREATE COMMENT START:', req.body);

    const { content, postId, parentCommentId } = req.body;
    const comment = new Comment({
      content,
      post: postId,
      user: req.user._id,
      parentCommentId: parentCommentId || null
    });
    await comment.save();
    console.log('✅ Comment saved:', comment._id);

    // 🔥 COMMENT NOTIFICATION (BULLETPROOF)
    try {
      const post = await Post.findById(postId).populate('createdBy');
      console.log('🔍 Post:', post?._id, 'Author:', post?.createdBy?._id);
       console.log('🔍 Current User:', req.user._id);

      // if (post && post.createdBy && post.createdBy._id.toString() !== req.user._id.toString())
        if (post && post.createdBy && 
        !post.createdBy._id.equals(req.user._id))
        {
        console.log('🚀 Creating notification...');
        
        const notification = new Notification({
          title: `${req.user.fullname} commented on your post`,
          message: `New comment on "${post.subject || 'your post'}"`,
          type: 'comment',
          user: post.createdBy._id,
          relatedId: postId
        });
        
        await notification.save();
        console.log('💾 Notification SAVED:', notification._id);

        // 🔥 WEBSOCKET
        const io = global.io;
        if (io) {
          io.to(`user_${post.createdBy._id}`).emit('new-notification', {
            _id: notification._id,
            title: notification.title,
            text: notification.message,
            type: 'comment',
            // time: formatTime(notification.createdAt),
    createdAt: notification.createdAt,
            read: false,
            relatedId: postId
          });
          console.log('📱 SOCKET EMITTED comment notification');
        }
      } else {
        console.log('⏭️ Skipped notification (same author/no post)');
      }
    } catch (notifError) {
      console.error('❌ NOTIFICATION ERROR:', notifError);
    }

    res.json({
      success: true,
      comment: {
        _id: comment._id,
        content,
        user: req.user,
        createdAt: comment.createdAt
      }
    });

  } catch (error) {
    console.error('❌ CREATE COMMENT ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 LIKE / UNLIKE COMMENT
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId).populate('likes', 'name avatar');
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found!'
      });
    }

    const userLikedIndex = comment.likes.findIndex(id => id.toString() === userId.toString());

    if (userLikedIndex > -1) {
      // 🔥 UNLIKE
      comment.likes.splice(userLikedIndex, 1);
      comment.likesCount -= 1;
      await comment.save();

      res.json({
        success: true,
        message: 'Comment unliked!',
        action: 'unlike',
        likesCount: comment.likesCount
      });
    } else {
      // 🔥 LIKE
      comment.likes.push(userId);
      comment.likesCount += 1;
      await comment.save();

      res.json({
        success: true,
        message: 'Comment liked!',
        action: 'like',
        likesCount: comment.likesCount
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🟢 GET COMMENTS FOR POST (with nested replies)
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // 🔥 Get MAIN comments (not replies) + populate
    const comments = await Comment.find({ 
      post: postId, 
      parentComment: null 
    })
      .populate('user', 'name avatar username fullname branch semester')
      .populate({
        path: 'parentComment',
        populate: { path: 'user', select: 'name avatar' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ post: postId, parentComment: null });

    res.json({
      success: true,
      comments,
      pagination: {
        current: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ ALL COMMENTS (top-level + replies)
export const getPostCommentsCount = async (req, res) => {
  try {
    const { postId } = req.params;

    const totalComments = await Comment.countDocuments({ post: postId });

    res.json({
      success: true,
      commentsCount: totalComments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// For individual comment reply counts
export const getCommentRepliesCount = async (req, res) => {
  try {
    const { commentId } = req.params;
    const repliesCount = await Comment.countDocuments({ 
      parentComment: commentId 
    });
    
    res.json({
      success: true,
      repliesCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// export const getCommentReplies = async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
    
//     console.log('🔍 getCommentReplies:', { postId, commentId }); // DEBUG
    
//     // ✅ FIXED: Use 'parentComment' (matches your schema)
//     const replies = await Comment.find({ 
//       post: postId,        // ✅ Also fixed: use 'post' not 'postId'
//       parentComment: commentId  // ✅ FIXED: was parentCommentId
//     })
//     .populate('user', 'avatar fullname branch semester username')
//     .sort({ createdAt: -1 })
//     .limit(10); // Increased limit
    
//     const repliesCount = await Comment.countDocuments({ 
//       post: postId, 
//       parentComment: commentId 
//     });
    
//     console.log('✅ Found replies:', replies.length); // DEBUG
    
//     res.json({
//       success: true,
//       replies,
//       repliesCount
//     });
//   } catch (error) {
//     console.error('❌ getCommentReplies error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Backend: getCommentReplies - Support nested replies
export const getCommentReplies = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    
    const replies = await Comment.find({ 
      post: postId, 
      parentComment: commentId 
    })
    .populate({
      path: 'user',
      select: 'avatar fullname username branch semester'
    })
    .populate({
      path: 'parentComment',
      select: 'content user createdAt'  // For threading info
    })
    .sort({ createdAt: -1 })
    .limit(10);

    const repliesCount = await Comment.countDocuments({ 
      post: postId, 
      parentComment: commentId 
    });

    res.json({
      success: true,
      replies,
      repliesCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// export const deleteComment = async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const userId = req.user.id;

//     const comment = await Comment.findById(commentId)
//       .populate('user')
//       .populate('post')
//       .populate('parentCommentId');  // ✅ For replies
    
//     if (!comment) {
//       return res.status(404).json({ success: false, message: "Comment not found" });
//     }

//     if (comment.user._id.toString() !== userId) {
//       return res.status(403).json({ success: false, message: "You can only delete your own comments" });
//     }

//     // ✅ 1. Delete comment + replies
//     await deleteCommentAndReplies(commentId);

//     // ✅ 2. ALWAYS decrement post count (main comment OR reply)
//     const post = await Post.findByIdAndUpdate(
//       comment.post._id, 
//       { $inc: { commentsCount: -1 } },
//       { new: true }  // ✅ Return updated document
//     );

//     // ✅ 3. If REPLY, also decrement parent comment's repliesCount
//     if (comment.parentCommentId) {
//       await Comment.findByIdAndUpdate(comment.parentCommentId._id, {
//         $inc: { repliesCount: -1 }
//       });
//     }

//     res.json({
//       success: true,
//       message: "Comment deleted successfully",
//       commentsCount: post.commentsCount  // ✅ Frontend gets fresh count!
//     });

//   } catch (error) {
//     console.error("Delete comment error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// ✅ RECURSIVE DELETE HELPER
const deleteCommentAndReplies = async (commentId) => {
  try {
    // Find comment and its direct replies
    const comment = await Comment.findById(commentId);
    if (!comment) return;

    // Delete all direct replies recursively FIRST
    const directReplies = await Comment.find({ parentComment: commentId });
    for (let reply of directReplies) {
      await deleteCommentAndReplies(reply._id);
    }

    // Now delete this comment
    await Comment.findByIdAndDelete(commentId);

    // Update parent's repliesCount if it has a parent
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { repliesCount: -1 }
      });
    }

  } catch (error) {
    console.error("Recursive delete error:", error);
    throw error;
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // 1. Find comment (use YOUR existing populate)
    const comment = await Comment.findById(commentId)
      .populate('user')
      .populate('post');  // ✅ ADD THIS ONE LINE

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own comments" });
    }

    // 2. Delete comment + ALL REPLIES
    await deleteCommentAndReplies(commentId);

    // 3. ✅ USE YOUR EXISTING COUNT CONTROLLER LOGIC
    const postId = comment.post._id;
    const accurateCount = await Comment.countDocuments({ post: postId });  // Same as your getPostCommentsCount

    // 4. Update post with EXACT count (eliminates negatives)
    await Post.findByIdAndUpdate(postId, { commentsCount: accurateCount });

    res.json({
      success: true,
      message: "Comment deleted successfully",
      commentsCount: accurateCount  // ✅ Frontend gets PERFECT count
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};