const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,

  type: {
    type: String,
    enum: ["like", "comment", "system"]
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });