import express from 'express';
import {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  toggleLike,
  getTrendingTopics,
  getTopResources,
  getUserPostsCount,
  getUserResourcesCount,
} from '../controllers/post.controllers.js';

import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create-post', verifyJWT, createPost);
router.post('/:id/like', verifyJWT, toggleLike);
router.get('/get-post', getAllPosts);
router.get('/get-post/:id', getPost);
router.delete('/:id', verifyJWT, deletePost);
router.get('/trending-topics', verifyJWT, getTrendingTopics);
router.get('/resources/top', verifyJWT, getTopResources);


router.get('/post-counts', verifyJWT, getUserPostsCount);
router.get('/resource-count', verifyJWT, getUserResourcesCount);

export default router;