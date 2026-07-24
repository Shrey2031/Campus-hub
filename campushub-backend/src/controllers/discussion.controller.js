import DiscussionRoom from '../models/discussion.model.js';
import Message from '../models/message.model.js';

export const createDiscussionRoom = async (req, res) => {
  try {
    const { name, subject, description, isPublic } = req.body;

    const room = new DiscussionRoom({
      name,
      subject,
      description,
      createdBy: req.user._id,
      // Creator wasn't previously added to their own room's
      // participants — their newly-created room showed 0 members even
      // to themselves until they separately hit "join."
      participants: [req.user._id],
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    await room.save();
    await room.populate('createdBy', 'fullname avatar');

    res.status(201).json({
      success: true,
      room: { ...room.toObject(), memberCount: room.participants.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDiscussionRooms = async (req, res) => {
  try {
    const { subject, search } = req.query;
    const query = {
      // Wasn't filtering on isPublic at all — the schema and the
      // create-room UI both treat this as a real setting, but any
      // private room was visible to every user regardless.
      $or: [
        { isPublic: true },
        { participants: req.user._id }
      ]
    };

    if (subject) query.subject = subject;
    if (search) query.name = { $regex: search, $options: 'i' };

   
    const rooms = await DiscussionRoom.aggregate([
      { $match: query },
      { $addFields: { memberCount: { $size: '$participants' } } },
      { $sort: { memberCount: -1, createdAt: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1, subject: 1, description: 1, isPublic: 1, memberCount: 1,
          participants: 1, createdAt: 1, updatedAt: 1,
          'createdBy._id': 1, 'createdBy.fullname': 1, 'createdBy.username': 1,
          'createdBy.avatar': 1, 'createdBy.branch': 1, 'createdBy.semester': 1
        }
      }
    ]);

    res.json({
      success: true,
      rooms,
      total: rooms.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      messages: messages.reverse(),
      total: messages.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

  
    const room = await DiscussionRoom.findByIdAndUpdate(
      roomId,
      { $addToSet: { participants: req.user._id } },
      { new: true }
    ).populate('participants', 'fullname avatar');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, room: { ...room.toObject(), memberCount: room.participants.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await DiscussionRoom.findByIdAndUpdate(
      roomId,
      { $pull: { participants: req.user._id } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, room: { ...room.toObject(), memberCount: room.participants.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};