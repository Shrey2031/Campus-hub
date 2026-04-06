import express from 'express';
import { 
  createComment, 
  likeComment, 
  getPostComments, 
  deleteComment 
} from '../controllers/comment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, createComment);                   
router.put('/:commentId/like', verifyJWT, likeComment);       
router.get('/post/:postId', getPostComments);               
router.delete('/:commentId', verifyJWT, deleteComment);       
router.get('/test', (req, res) => {
  res.send("Comment route working");
});

export default router;