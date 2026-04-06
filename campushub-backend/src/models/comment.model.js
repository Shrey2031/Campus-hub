import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // 📝 Comment text
    content: {
      type: String,
      required: true,
      trim: true
    },

    // 🔗 Which post this belongs to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },

    // 👤 Who wrote comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🔁 Reply system (VERY IMPORTANT)
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },

    // ❤️ Likes on comment
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // 📊 Count optimization (faster UI)
    likesCount: {
      type: Number,
      default: 0
    },

    // 🧵 Reply count (for UI)
    repliesCount: {
      type: Number,
      default: 0
    }

  },
  { timestamps: true }
);

// export default mongoose.model("Comment", commentSchema);
export const Comment = mongoose.model("Comment", commentSchema);