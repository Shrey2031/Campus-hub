// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: {
    type: String,
    enum: ["like", "comment", "system", "follow", "mention"]  // ✅ Added more types
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
    type: mongoose.Schema.Types.ObjectId,  // ✅ Post/Comment ID for linking
    required: false
  }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);