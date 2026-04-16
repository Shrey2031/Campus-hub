import DiscussionRoom from '../models/discussion.model.js';
import Message from '../models/message.model.js';


// 🔥 Create Room
export const createDiscussionRoom = async (req, res) => {
  try {
    const { name, subject, description, isPublic } = req.body;
    
    const room = new DiscussionRoom({
      name,
      subject,
      description,
      createdBy: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
    });
    
    await room.save();
    
    await room.populate('createdBy', 'fullname avatar');
    
    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔥 Get Rooms
export const getDiscussionRooms = async (req, res) => {
  try {
    const { subject, search } = req.query;
    const query = {};
    
    if (subject) query.subject = subject;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const rooms = await DiscussionRoom.find(query)
      .populate('createdBy', 'fullname username avatar branch semester')
      .sort({ memberCount: -1, createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      rooms,
      total: rooms.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔥 Get Room Messages
export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({ 
      room: roomId, 
      isDeleted: false 
    })
    .populate('user', 'fullname avatar username')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
    
    res.json({
      success: true,
      messages: messages.reverse(), // Oldest first
      total: messages.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔥 Join/Leave Room
export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await DiscussionRoom.findByIdAndUpdate(
      roomId,
      { 
        $addToSet: { participants: req.user._id },
        $inc: { memberCount: 1 }
      },
      { new: true }
    ).populate('participants', 'fullname avatar');
    
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await DiscussionRoom.findByIdAndUpdate(
      roomId,
      { 
        $pull: { participants: req.user._id },
        $inc: { memberCount: -1 }
      },
      { new: true }
    );
    
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};