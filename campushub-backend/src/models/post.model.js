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
    ref: "User"
  },

  // 🔥 FILE UPLOAD HERE
  file: {
    url: String,          // Cloudinary URL
    public_id: String,    // for delete
    fileType: String,     // pdf, image, doc
    fileName: String      // original name
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  commentsCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);