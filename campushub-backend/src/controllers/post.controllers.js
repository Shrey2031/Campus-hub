
import { User } from '../models/user.model.js';
import {Post} from '../models/post.model.js';
import { upload } from '../middleware/multer.middleware.js'; // Your existing multer
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Your existing cloudinary
import { createNotification } from './notification.controller.js'; // For notifications


// 🟢 CREATE POST
// export const createPost = [
//   upload.single('file'),
//   async (req, res) => {
//     try {
//       console.log('🔍 Handler - req.user:', req.user?.id);
//       const { content, subject, type } = req.body;
//       const userId = req.user.id;

//       let fileData = null;

//       // Handle file upload
//       if (req.file) {
//         const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        
//         if (cloudinaryResponse) {
//           fileData = {
//             url: cloudinaryResponse.secure_url,
//             public_id: cloudinaryResponse.public_id,
//             fileType: req.file.mimetype.split('/')[1] || 'unknown',
//             fileName: req.file.originalname
//           };
//         }
//       }

//       const post = new Post({
//         content,
//         subject,
//         type: type || 'question',
//         createdBy: userId,
//         file: fileData,
//         views: 1
//       });

//       await post.save();

//       // 🔥 INCREMENT USER'S POST COUNT
//       await User.findByIdAndUpdate(
//         userId,
//         { 
//           $inc: { postCount: 1 } // Increment by 1
//         },
//         { new: true }
//       );

//       // Populate post data
//       await post.populate('createdBy', 'name avatar email postCount');

//       res.status(201).json({
//         success: true,
//         message: 'Post created successfully!',
//         post,
//         userPostCount: post.createdBy.postCount // Current count (e.g., 2)
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   }
// ];
// 🔥 NEW RESOURCE-ONLY CONTROLLER
export const createPost = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { content, title, subject, type = 'question' } = req.body;
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

      // 🔥 PERFECT FOR YOUR MODEL
      const postData = {
        content: title || content, // ✅ title for resources, content for questions
        subject,
        type, // ✅ 'resource', 'question', 'discussion'
        createdBy: userId,
        file: fileData,
        views: 1
      };

      // 🔥 RESOURCE-SPECIFIC FIELDS (optional but nice)
      if (type === 'resource' && title) {
        postData.content = title; // Use title as content for resources
      }

      const post = new Post(postData);
      await post.save();

      // Increment user post count
      await User.findByIdAndUpdate(userId, { $inc: { postCount: 1 } });

      await post.populate('createdBy', 'fullname avatar username branch semester postCount');

      res.status(201).json({
        success: true,
        message: 'Post created successfully!',
        post,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];

// ✅ Add this helper
function getFileIcon(mimeType) {
  const icons = {
    'pdf': '📄',
    'doc': '📝', 
    'docx': '📝',
    'zip': '📦',
    'rar': '📦',
    'ppt': '📊',
    'pptx': '📊'
  };
  return icons[mimeType.split('/')[1]] || '📎';
}



export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {
      type: { $in: ['question', 'discussion'] } // 🔥 EXCLUDE RESOURCES BY DEFAULT
    };

    // 🔥 Allow explicit type override (for special cases)
    if (type) {
      if (type === 'resource') {
        return res.status(400).json({
          success: false,
          message: 'Use /resources endpoint for resource posts'
        });
      }
      filter.type = type; // Only allow 'question' or 'discussion'
    }

    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('createdBy', 'name fullname username branch semester avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(filter);
    const hasMore = skip + posts.length < total;

    res.status(200).json({
      success: true,
      posts,
      hasMore,
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

// export const getAllPosts = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
    
//     // 🔥 Only show question and discussion posts (exclude resources)
//     const filter = {
//       type: { $in: ['question', 'discussion'] }, // ✅ Exclude resources
//       isDeleted: false // ✅ Exclude deleted posts
//     };
    
//     const posts = await Post.find(filter)
//       .populate('createdBy', 'fullname username avatar branch semester')
//       .populate('likes', 'fullname')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);
    
//     res.json({
//       posts,
//       count: await Post.countDocuments(filter),
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(await Post.countDocuments(filter) / limit)
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// 🟢 GET SINGLE POST
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('createdBy', 'name avatar email branch semester fullname username')
      .populate('likes', 'name avatar fullname username'); // Populate likes with user info

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

    // ✅ USE YOUR EXISTING CLOUDINARY UTIL
    if (post.file?.public_id) {
      try {
        // Method 1: If uploadOnCloudinary exports cloudinary instance
        await uploadOnCloudinary.uploader.destroy(post.file.public_id, {
          resource_type: 'auto'
        });
        console.log('✅ Cloudinary file deleted');
      } catch (cloudinaryError) {
        console.warn('⚠️ Cloudinary delete failed:', cloudinaryError.message);
        // Continue anyway!
      }
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully!'
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;  // ✅ Post ID from route
    const userId = req.user._id;

    console.log('🔍 Toggle like for post:', id, 'by user:', userId);

    // ✅ 1. FIND POST FIRST (was missing!)
    const post = await Post.findById(id).populate('createdBy');
    
    if (!post) {
      console.log('❌ Post NOT found:', id);
      return res.status(404).json({
        success: false,
        message: 'Post not found!'
      });
    }

    console.log('✅ Post found:', post._id, 'Current likes:', post.likes.length);

    // 🔥 2. CREATE NOTIFICATION (only if NEW like & not author)
    const userLikedIndex = post.likes.findIndex(likeId => 
      likeId.toString() === userId.toString()
    );

    if (userLikedIndex === -1) {  // NEW LIKE
      if (post.createdBy._id.toString() !== userId) {
        await createNotification(
          post.createdBy._id,
          `${req.user.fullname} liked your post`,
          `Someone liked "${post.subject || 'your post'}"`,
          'like',
          post._id  // ✅ Use post._id (not undefined postId)
        );
      }
    }

    // ✅ 3. TOGGLE LIKE/UNLIKE
    if (userLikedIndex > -1) {
      // 🔥 UNLIKE
      post.likes.splice(userLikedIndex, 1);
      await post.save();
      
      console.log('👎 Unliked - New count:', post.likes.length);
      res.json({
        success: true,
        message: 'Post unliked!',
        likesCount: post.likes.length,
        action: 'unlike',
        liked: false
      });
    } else {
      // 🔥 LIKE
      post.likes.push(userId);
      await post.save();
      
      console.log('👍 Liked - New count:', post.likes.length);
      res.json({
        success: true,
        message: 'Post liked!',
        likesCount: post.likes.length,
        action: 'like',
        liked: true
      });
    }

  } catch (error) {
    console.error('❌ toggleLike ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// controllers/postController.js
// export const getTrendingTopics = async (req, res) => {
//   try {
//     const trending = await Post.aggregate([
//       {
//         $match: { 
//           subject: { $exists: true, $ne: null, $ne: "" },
//           isDeleted: false  // Add this field if missing
//         }
//       },
//       {
//         $group: {
//           _id: "$subject",
//           postCount: { $sum: 1 },
//           viewCount: { $sum: { $ifNull: ["$views", 0] } },  // Add views field
//           resourceCount: { $sum: { $cond: [{ $eq: ["$type", "resource"] }, 1, 0] } }
//         }
//       },
//       {
//         $addFields: {
//           score: { $add: [
//             { $multiply: ["$postCount", 2] },
//             { $divide: ["$viewCount", 50] },
//             { $multiply: ["$resourceCount", 3] }
//           ]}
//         }
//       },
//       { $sort: { score: -1 } },
//       { $limit: 15 },
//       {
//         $project: {
//           _id: 0,
//           topic: "$_id",
//           posts: "$postCount",
//           resources: "$resourceCount",
//           views: "$viewCount",
//           score: 1
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       topics: trending.map(t => t.topic)
//     });
//   } catch (error) {
//     console.error('Trending error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// controllers/postController.js - ROBUST VERSION
export const getTrendingTopics = async (req, res) => {
  try {
    console.log('🔍 Fetching trending topics...');  // ✅ Debug

    const trending = await Post.aggregate([
      // ✅ Try subject first, fallback to content words
      {
        $addFields: {
          topic: {
            $cond: {
              if: { $and: [{ $ne: ["$subject", null] }, { $ne: ["$subject", ""] }] },
              then: "$subject",
              else: { 
                $arrayElemAt: [
                  { $split: [{ $ifNull: ["$content", ""] }, " "] }, 
                  0 
                ]
              }
            }
          }
        }
      },
      { 
        $match: { 
          topic: { $ne: null, $ne: "", $ne: "undefined" },
          isDeleted: { $ne: true }  // Skip deleted
        } 
      },
      { 
        $group: { 
          _id: "$topic", 
          postCount: { $sum: 1 },
          samplePost: { $first: "$content" }
        } 
      },
      { $match: { postCount: { $gte: 1 } } },  // At least 1 post
      { $sort: { postCount: -1 } },
      { $limit: 10 },
      { 
        $project: { 
          _id: 0, 
          topic: "$_id", 
          posts: "$postCount" 
        } 
      }
    ]);

    console.log(`📈 Trending found: ${trending.length} topics`);  // ✅ Debug

    res.json({
      success: true,
      topics: trending.map(t => t.topic),
      debug: trending  // Remove in production
    });
  } catch (error) {
    console.error('❌ Trending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Trending failed',
      error: error.message 
    });
  }
};

export const getTopResources = async (req, res) => {
   try {
    const { type = 'resource', limit = 8 } = req.query; // 🔥 Add type param
    
    const filter = {
      file: { $exists: true, $ne: null }, // ✅ Has file
      type: type === 'all' ? { $exists: true } : type // 🔥 Filter by type
    };

    const resources = await Post.find(filter)
      .populate('createdBy', 'fullname avatar branch semester')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('content file createdBy type views')
      .lean();

    // const formatted = resources.map(post => ({
    //   _id: post._id,
    //   title: post.content.length > 40 
    //     ? post.content.slice(0, 40) + '...' 
    //     : post.content,
    //   author: post.createdBy || { fullname: 'Anonymous' },
    //   type: post.file?.fileType?.toUpperCase()?.split('/')[1] || 'FILE',
    //   postType: post.type, // 🔥 Add post type
    //   icon: post.file?.fileType?.includes('pdf') ? '📄' : 
    //         post.file?.fileType?.includes('image') ? '🖼️' : '📎',
    //   views: post.views || 0
    // }));

    // In getTopResources controller
const formatted = resources.map(post => ({
  _id: post._id,
  title: post.content.length > 40 ? post.content.slice(0, 40) + '...' : post.content,
  author: post.createdBy || { fullname: 'Anonymous' },
  type: post.file?.fileType?.toUpperCase()?.split('/')[1] || 'FILE',
  postType: post.type,
  icon: post.file?.fileType?.includes('pdf') ? '📄' : 
        post.file?.fileType?.includes('image') ? '🖼️' : '📎',
  views: post.views || 0,
  downloadUrl: `https://res.cloudinary.com/drhyudr2a/image/upload/fl_attachment/${post.file.public_id}`, // 🔥 ADD THIS
  fileName: post.file.fileName // 🔥 ADD THIS
}));
    res.json({ 
      success: true, 
      resources: formatted,
      total: formatted.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
 };

import axios from 'axios'; // npm install axios
 // Ensure: npm install axios

// 🔥 PERFECT DOWNLOAD CONTROLLER
export const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id).populate('createdBy');
    if (!post?.file?.url) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // 🔥 TRACK DOWNLOAD
    await Post.findByIdAndUpdate(id, { 
      $inc: { views: 1 },
      $push: { downloaders: req.user.id }
    });

    // 🔥 FETCH FILE FROM CLOUDINARY
    const response = await axios.get(post.file.url, {
      responseType: 'arraybuffer'
    });

    // 🔥 SET PROPER HEADERS
    res.setHeader('Content-Type', post.file.fileType ? `application/${post.file.fileType}` : 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${post.file.fileName}"`);
    res.setHeader('Content-Length', response.headers['content-length']);

    // 🔥 SEND FILE
    res.send(response.data);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: 'Download failed' });
  }
};

export const getUserPostsCount = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const count = await Post.countDocuments({
      type: { $in: ['question', 'discussion'] }, // 🔥 Only posts (exclude resources)
      createdBy: userId
    });

    res.json({
      success: true,
      postCount: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserResourcesCount = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const count = await Post.countDocuments({
      type: 'resource', // 🔥 Only resources
      'file': { $exists: true, $ne: null }, // Has file
      createdBy: userId
    });

    res.json({
      success: true,
      resourceCount: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};