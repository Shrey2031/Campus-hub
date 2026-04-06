// import express from "express";
// import {
//   createPost,
//   getAllPosts,
//   getPostById,
//   deletePost,
//   toggleLikePost
// } from "../controllers/post.controllers.js";

// import { verifyJWT } from "../middleware/auth.middleware.js";
// import { upload } from "../middleware/multer.middleware.js";

// const router = express.Router();


// // 🔥 create post
// router.post(
//   "/create",
//   verifyJWT,
//   // upload.single("file"), // 👈 MUST MATCH POSTMAN KEY
//   upload.fields([{ name: "file", maxCount: 1 }]),
//   createPost
// );

// // 🔥 get feed
// router.get("/", verifyJWT, getAllPosts);

// // 🔥 get single post
// router.get("/:id", verifyJWT, getPostById);

// // 🔥 delete
// router.delete("/:id", verifyJWT, deletePost);

// // 🔥 like
// router.post("/:id/like", verifyJWT, toggleLikePost);

// export default router;

import express from 'express';
import { 
  createPost, 
  getAllPosts, 
  getPost, 
  deletePost 
} from '../controllers/post.controllers.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, createPost);        // ✅ Clean!
router.get('/', getAllPosts);                 // ✅ Clean!
router.get('/:id', getPost);                  // ✅ Clean!
router.delete('/:id', verifyJWT, deletePost);   // ✅ Clean!

export default router;