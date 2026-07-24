import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ApiError } from './utils/apiError.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);


app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running...' });
});

// route declaration
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import discussionRoutes from './routes/discussion.routes.js';
import aiRoutes from './routes/aiRoutes.js';

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/discussions', discussionRoutes);


app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.error || []
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export { app };