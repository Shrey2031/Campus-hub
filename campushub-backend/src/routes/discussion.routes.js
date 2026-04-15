import express from 'express';
import { 
  createDiscussionRoom, 
  getDiscussionRooms, 
  getRoomMessages, 
  joinRoom, 
  leaveRoom 
} from '../controllers/discussion.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/', verifyJWT, createDiscussionRoom);
router.get('/', verifyJWT, getDiscussionRooms);
router.get('/:roomId/messages', verifyJWT, getRoomMessages);
router.post('/:roomId/join', verifyJWT, joinRoom);
router.post('/:roomId/leave', verifyJWT, leaveRoom);

export default router;