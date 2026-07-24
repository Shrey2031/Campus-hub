import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    likesCount: {
      type: Number,
      default: 0
    },

    repliesCount: {
      type: Number,
      default: 0
    }

  },
  { timestamps: true }
);


commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

export const Comment = mongoose.model("Comment", commentSchema);