import {Comment} from '../models/comment.model.js';
import {Post} from '../models/post.model.js';
import {User} from '../models/user.model.js';

// 🟢 CREATE COMMENT / REPLY
export const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;
    const userId = req.user._id;

    // Validate post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found!'
      });
    }

    const comment = new Comment({
      content,
      post: postId,
      user: userId,
      parentComment: parentCommentId || null
    });

    await comment.save();

    // 🔥 INCREMENT COUNTS
    if (!parentCommentId) {
      // Main comment → increment post commentsCount
      post.commentsCount += 1;
      await post.save();
    } else {
      // Reply → increment parent comment repliesCount
      await Comment.findByIdAndUpdate(parentCommentId, {
        $inc: { repliesCount: 1 }
      });
    }

    // Populate everything
    await comment.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'parentComment', select: 'content user createdAt', populate: { path: 'user', select: 'name avatar' } }
    ]);

    res.status(201).json({
      success: true,
      message: parentCommentId ? 'Reply added!' : 'Comment added!',
      comment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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
      .populate('user', 'name avatar')
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

// 🔴 DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findOne({ _id: commentId, user: userId });
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you are not authorized!'
      });
    }

    // 🔥 HANDLE COUNTS ON DELETE
    if (!comment.parentComment) {
      // Main comment → decrement post commentsCount
      await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 }
      });
    } else {
      // Reply → decrement parent repliesCount
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { repliesCount: -1 }
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: 'Comment deleted!'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};