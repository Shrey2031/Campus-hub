

import express from 'express';
import { 
  createPost, 
  getAllPosts, 
  getPost, 
  deletePost ,
  toggleLike,
  getTrendingTopics,
  getTopResources,
  downloadResource,
  getUserPostsCount,
  getUserResourcesCount

} from '../controllers/post.controllers.js';

import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';


const router = express.Router();

router.post('/create-post', verifyJWT, createPost); 
router.post('/:id/like', verifyJWT, toggleLike);   // ✅ Clean!
      // router.post('/create-post', verifyJWT, upload.single('file'), createPost); 
router.get('/get-post', getAllPosts);                 // ✅ Clean!
router.get('get-post/:id', getPost);                  // ✅ Clean!
router.delete('/:id', verifyJWT, deletePost);
router.get('/trending-topics',verifyJWT, getTrendingTopics) ;
router.get('/resources/top', verifyJWT, getTopResources)  // ✅ Clean!
router.post('/post-counts', verifyJWT, getUserPostsCount); 
router.post('/resource-count', verifyJWT, getUserPostsCount); 


// posts.js routes



export default router;