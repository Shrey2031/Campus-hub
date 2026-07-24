import { v2 as cloudinary } from 'cloudinary';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { upload } from '../middleware/multer.middleware.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { createNotification } from './notification.controller.js';
import axios from 'axios';

export const createPost = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { content, title, subject, type = 'question' } = req.body;
      const userId = req.user.id;

      let fileData = null;

      if (req.file) {
  
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        if (cloudinaryResponse) {
          fileData = {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
            // Needed so deletePost can correctly clean this up later —
            // Cloudinary's destroy() requires the actual resource type
            // ('image'/'raw'/'video'), not 'auto'.
            resourceType: cloudinaryResponse.resource_type,
            fileType: req.file.mimetype.split('/')[1] || 'unknown',
            fileName: req.file.originalname
          };
        }
      }

      const postData = {
        content: (type === 'resource' && title) ? title : (title || content),
        subject,
        type,
        createdBy: userId,
        file: fileData,
        views: 1
      };

      const post = new Post(postData);
      await post.save();


      const counterField = type === 'resource' ? 'resourcesCount' : 'postCount';
      await User.findByIdAndUpdate(userId, { $inc: { [counterField]: 1 } });

      await post.populate('createdBy', 'fullname avatar username branch semester');

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

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {
      type: { $in: ['question', 'discussion'] }
    };

    if (type) {
      if (type === 'resource') {
        return res.status(400).json({
          success: false,
          message: 'Use /resources endpoint for resource posts'
        });
      }
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('createdBy', 'fullname username branch semester avatar email')
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

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('createdBy', 'avatar email branch semester fullname username')
      .populate('likes', 'fullname username avatar');

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

    if (post.file?.public_id) {
      try {
     
        await cloudinary.uploader.destroy(post.file.public_id, {
          resource_type: post.file.resourceType || 'image'
        });
        console.log('✅ Cloudinary file deleted');
      } catch (cloudinaryError) {
        console.warn('⚠️ Cloudinary delete failed:', cloudinaryError.message);
      }
    }

    await Post.findByIdAndDelete(id);

    const counterField = post.type === 'resource' ? 'resourcesCount' : 'postCount';
    await User.findByIdAndUpdate(userId, { $inc: { [counterField]: -1 } });

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
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id).populate('createdBy');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found!'
      });
    }

    const userLikedIndex = post.likes.findIndex(likeId =>
      likeId.toString() === userId.toString()
    );

    if (userLikedIndex === -1) {
      
      if (!post.createdBy._id.equals(userId)) {
        await createNotification(
          post.createdBy._id,
          `${req.user.fullname} liked your post`,
          `Someone liked "${post.subject || 'your post'}"`,
          'like',
          post._id
        );
      }
    }

    if (userLikedIndex > -1) {
      post.likes.splice(userLikedIndex, 1);
      await post.save();

      res.json({
        success: true,
        message: 'Post unliked!',
        likesCount: post.likes.length,
        action: 'unlike',
        liked: false
      });
    } else {
      post.likes.push(userId);
      await post.save();

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

export const getTrendingTopics = async (req, res) => {
  try {
    const trending = await Post.aggregate([
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
         
          topic: { $nin: [null, "", "undefined"] },
          isDeleted: { $ne: true }
        }
      },
      {
        $group: {
          _id: "$topic",
          postCount: { $sum: 1 },
          samplePost: { $first: "$content" }
        }
      },
      { $match: { postCount: { $gte: 1 } } },
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

    res.json({
      success: true,
      topics: trending.map(t => t.topic)
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
    const { type = 'resource', limit = 8 } = req.query;

    const filter = {
      file: { $exists: true, $ne: null },
      type: type === 'all' ? { $exists: true } : type
    };

    const resources = await Post.find(filter)
      .populate('createdBy', 'fullname avatar branch semester')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('content file createdBy type views')
      .lean();

    const formatted = resources.map(post => {

      const signedUrl = cloudinary.url(post.file.public_id, {
        resource_type: post.file.resourceType || 'image',
        type: 'upload',
        format: post.file.fileType,
        sign_url: true,
        secure: true
      });

      return {
        _id: post._id,
        title: post.content.length > 40 ? post.content.slice(0, 40) + '...' : post.content,
        author: post.createdBy || { fullname: 'Anonymous' },
        type: post.file?.fileType?.toUpperCase()?.split('/')[1] || 'FILE',
        postType: post.type,
        icon: post.file?.fileType?.includes('pdf') ? '📄' :
          post.file?.fileType?.includes('image') ? '🖼️' : '📎',
        views: post.views || 0,
        file: {
          url: signedUrl,
          fileName: post.file.fileName
        },
        downloadUrl: signedUrl,
        fileName: post.file.fileName
      };
    });

    res.json({
      success: true,
      resources: formatted,
      total: formatted.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post?.file?.url) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    await Post.findByIdAndUpdate(id, {
      $inc: { views: 1 },
      $addToSet: { downloaders: req.user.id }
    });

   
    const response = await axios.get(post.file.url, { responseType: 'stream' });

    res.setHeader('Content-Type', post.file.fileType ? `application/${post.file.fileType}` : 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${post.file.fileName}"`);
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }

    response.data.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: 'Download failed' });
  }
};

export const getUserPostsCount = async (req, res) => {
  try {
    const { userId } = req.query;

    const count = await Post.countDocuments({
      type: { $in: ['question', 'discussion'] },
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
      type: 'resource',
      'file': { $exists: true, $ne: null },
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