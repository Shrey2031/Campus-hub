import mongoose from 'mongoose';
const discussionRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true },
  memberCount: { type: Number, default: 0 }
}, { timestamps: true });

discussionRoomSchema.index({ name: 'text', subject: 'text' });
export default mongoose.model('DiscussionRoom', discussionRoomSchema);