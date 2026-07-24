import express from 'express';
import {
  createComment,
  likeComment,
  getPostComments,
  deleteComment,
  getPostCommentsCount,
  getCommentRepliesCount,
  getCommentReplies
} from '../controllers/comment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, createComment);
router.put('/:commentId/like', verifyJWT, likeComment);
router.get('/:postId/comments-count', getPostCommentsCount);
router.get('/:commentId/replies-count', getCommentRepliesCount);
router.get('/:postId/:commentId/replies', getCommentReplies);
router.delete('/:commentId', verifyJWT, deleteComment);


router.get('/test', (req, res) => {
  res.send("Comment route working");
});

router.get('/:postId', getPostComments);

export default router;