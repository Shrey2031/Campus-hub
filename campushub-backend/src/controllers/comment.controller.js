import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import { createNotification } from './notification.controller.js';

export const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    const comment = new Comment({
      content,
      post: postId,
      user: req.user._id,
      parentComment: parentCommentId || null
    });
    await comment.save();


    if (!parentCommentId) {
      await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    } else {
      await Comment.findByIdAndUpdate(parentCommentId, { $inc: { repliesCount: 1 } });
    }

    try {
      const post = await Post.findById(postId).populate('createdBy');

      if (post && post.createdBy && !post.createdBy._id.equals(req.user._id)) {
        await createNotification(
          post.createdBy._id,
          `${req.user.fullname} commented on your post`,
          `New comment on "${post.subject || 'your post'}"`,
          'comment',
          postId
        );
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
        parentComment: comment.parentComment,
        createdAt: comment.createdAt
      }
    });

  } catch (error) {
    console.error('❌ CREATE COMMENT ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId).populate('likes', 'fullname avatar');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found!'
      });
    }

    const userLikedIndex = comment.likes.findIndex(id => id.toString() === userId.toString());

    if (userLikedIndex > -1) {
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

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      post: postId,
      parentComment: null
    })
      .populate('user', 'avatar username fullname branch semester')
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

export const getCommentReplies = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const replies = await Comment.find({
      post: postId,
      parentComment: commentId
    })
      .populate('user', 'avatar fullname username branch semester')
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

const deleteCommentAndReplies = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return;

    const directReplies = await Comment.find({ parentComment: commentId });
    for (let reply of directReplies) {
      await deleteCommentAndReplies(reply._id);
    }

    await Comment.findByIdAndDelete(commentId);

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

    const comment = await Comment.findById(commentId)
      .populate('user')
      .populate('post');

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own comments" });
    }

    await deleteCommentAndReplies(commentId);

    const postId = comment.post._id;
    const accurateCount = await Comment.countDocuments({ post: postId });

    await Post.findByIdAndUpdate(postId, { commentsCount: accurateCount });

    res.json({
      success: true,
      message: "Comment deleted successfully",
      commentsCount: accurateCount
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};