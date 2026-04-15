// middleware/postViewTracker.js
export const trackPostView = async (req, res, next) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );
  } catch (error) {
    console.log('View tracking failed:', error);
  }
  next();
};