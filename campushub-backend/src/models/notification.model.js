import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: {
    type: String,
    enum: ["like", "comment", "system", "follow", "mention"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  }
}, { timestamps: true });


notificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);