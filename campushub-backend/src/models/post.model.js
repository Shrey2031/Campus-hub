import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },

  subject: String,

  type: {
    type: String,
    enum: ["question", "discussion", "resource"],
    default: "question"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // Every post needs an author — without this, a post could save with
    // no creator, which is why PostCard.jsx has to defensively fall back
    // to "Anonymous User" on the frontend.
    required: true
  },

  file: {
    url: String,
    public_id: String,
    fileType: String,
    fileName: String,
    // Cloudinary's destroy() API needs to know whether an asset was
    // stored as 'image' or 'raw' — 'auto' (used at upload time) isn't a
    // valid value for deletion. Storing what Cloudinary actually picked
    // at upload time is the only reliable way to delete it correctly
    // later (deletePost was calling destroy with a hardcoded 'auto',
    // which doesn't work).
    resourceType: String
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  // downloadResource does $push: { downloaders: req.user.id } — this
  // field didn't exist on the schema, so that push was being silently
  // stripped by Mongoose's strict update mode and doing nothing.
  downloaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  commentsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

// Matches your actual query patterns: feed sorted newest-first, resources
// filtered by type+subject, and "this user's posts" lookups.
postSchema.index({ createdAt: -1 });
postSchema.index({ type: 1, subject: 1 });
postSchema.index({ createdBy: 1 });

export const Post = mongoose.model("Post", postSchema);