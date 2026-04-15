// models/Message.js
import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionRoom', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file', 'system'], default: 'text' },
  file: {
    url: String,
    name: String,
    type: String
  },
    isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });
messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);