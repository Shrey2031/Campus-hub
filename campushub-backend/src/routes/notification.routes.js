// routes/notificationRoutes.js
import express from 'express';
import { getUserNotifications, markAllRead, createNotification } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getUserNotifications);
router.put('/read-all', verifyJWT, markAllRead);
router.post('/create', verifyJWT,createNotification )

export default router;