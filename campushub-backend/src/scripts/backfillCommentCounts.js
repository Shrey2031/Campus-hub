

// Run once with: node src/scripts/backfillCommentCounts.js

import 'dotenv/config';
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
  console.log('Connected. Backfilling counts...');

  const posts = await Post.find({});
  let postsFixed = 0;

  for (const post of posts) {
    const accurateCount = await Comment.countDocuments({ post: post._id });
    if (accurateCount !== post.commentsCount) {
      await Post.findByIdAndUpdate(post._id, { commentsCount: accurateCount });
      postsFixed++;
    }
  }

  const comments = await Comment.find({});
  let commentsFixed = 0;

  for (const comment of comments) {
    const accurateReplies = await Comment.countDocuments({ parentComment: comment._id });
    if (accurateReplies !== comment.repliesCount) {
      await Comment.findByIdAndUpdate(comment._id, { repliesCount: accurateReplies });
      commentsFixed++;
    }
  }

  console.log(`Done. Fixed ${postsFixed} post(s), ${commentsFixed} comment(s).`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});