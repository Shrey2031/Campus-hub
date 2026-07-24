import express from 'express';
import rateLimit from 'express-rate-limit';
import { askGemini } from '../controllers/ai.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();


const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: { success: false, message: 'Too many AI requests, please slow down.' }
});


router.post('/ask',askGemini)
export default router;