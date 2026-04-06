
// import {Post} from "../models/post.model.js";
// import {User} from "../models/user.model.js"; // 👈 ADD THIS
// import {uploadOnCloudinary} from "../utils/cloudinary.js";
// import fs from "fs";

// export const createPost = async (req, res) => {
//   try {
//     const { content, subject, type } = req.body;

//     // ✅ validation (important)
//     if (!content) {
//       return res.status(400).json({ message: "Content is required" });
//     }

//     let fileData = null;
//       console.log("FILE:", req.file);

//       const filePath = req.files?.file?.[0]?.path;


//     // ✅ upload to cloudinary
//     if (filePath) {
//       console.log("Uploading to cloudinary...");
//       const result = await uploadOnCloudinary.uploader.upload(filePath, {
//         resource_type: "auto"
 
//       });
//       console.log("Cloudinary result:", result);


//       fileData = {
//         url: result.secure_url,
//         public_id: result.public_id,
//         fileType: result.resource_type,
//         fileName: req.file.originalname
//       };
    

//       // 🧹 delete local file
//       fs.unlinkSync(req.file.path);
//     }

//     // ✅ create post
//     const post = await Post.create({
//       content,
//       subject,
//       type: req.file ? "resource" : type || "question",
//       createdBy: req.user.id,
//       file: fileData
//     });

//     // 🔥 UPDATE USER STATS (THIS IS WHAT YOU ASKED)
//        await User.findByIdAndUpdate(req.user.id, {
//       $inc: {
//         "stats.posts": 1,
//         ...(req.file && { "stats.uploads": 1 })
//       }
//     });

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getAllPosts = async (req, res) => {
//   try {
//     const { subject, type } = req.query;

//     let filter = {};

//     if (subject) filter.subject = subject;
//     if (type) filter.type = type;

//     const posts = await Post.find(filter)
//       .populate("createdBy", "name avatar")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       posts
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)
//       .populate("createdBy", "name avatar");

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     res.status(200).json(post);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // 🔐 only owner can delete
//     if (post.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     // delete file from cloudinary
//     if (post.file?.public_id) {
//       await uploadOnCloudinary.uploader.destroy(post.file.public_id);
//     }

//     await post.deleteOne();

//     res.status(200).json({ message: "Post deleted" });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const toggleLikePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const userId = req.user.id;

//     const isLiked = post.likes.includes(userId);

//     if (isLiked) {
//       post.likes.pull(userId);
//     } else {
//       post.likes.push(userId);
//     }

//     await post.save();

//     res.status(200).json({
//       success: true,
//       likes: post.likes.length
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
import { User } from '../models/user.model.js';
import {Post} from '../models/post.model.js';
import { upload } from '../middleware/multer.middleware.js'; // Your existing multer
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Your existing cloudinary

// 🟢 CREATE POST
export const createPost = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { content, subject, type } = req.body;
      const userId = req.user.id;

      let fileData = null;

      // Handle file upload
      if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        
        if (cloudinaryResponse) {
          fileData = {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
            fileType: req.file.mimetype.split('/')[1] || 'unknown',
            fileName: req.file.originalname
          };
        }
      }

      const post = new Post({
        content,
        subject,
        type: type || 'question',
        createdBy: userId,
        file: fileData
      });

      await post.save();

      // 🔥 INCREMENT USER'S POST COUNT
      await User.findByIdAndUpdate(
        userId,
        { 
          $inc: { postCount: 1 } // Increment by 1
        },
        { new: true }
      );

      // Populate post data
      await post.populate('createdBy', 'name avatar email postCount');

      res.status(201).json({
        success: true,
        message: 'Post created successfully!',
        post,
        userPostCount: post.createdBy.postCount // Current count (e.g., 2)
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];

// 🟢 GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('createdBy', 'name avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      posts,
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

// 🟢 GET SINGLE POST
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('createdBy', 'name avatar email')
      .populate('likes', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found!'
      });
    }

    res.status(200).json({
      success: true,
      post
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔴 DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findOne({ _id: id, createdBy: userId });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or you are not authorized!'
      });
    }

    // Delete file from Cloudinary if exists
    if (post.file?.public_id) {
      await cloudinary.uploader.destroy(post.file.public_id, {
        resource_type: 'auto'
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully!'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};