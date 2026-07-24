import express from 'express';
import { getUserNotifications, markAllRead, markNotificationRead } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getUserNotifications);
router.put('/read-all', verifyJWT, markAllRead);
router.put('/:notificationId/read', verifyJWT, markNotificationRead);


export default router;