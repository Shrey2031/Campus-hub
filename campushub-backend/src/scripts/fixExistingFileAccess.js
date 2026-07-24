
// Run once with: node src/scripts/fixExistingFileAccess.js

import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { DB_NAME } from '../constants.js';
import { Post } from '../models/post.model.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: DB_NAME });
  console.log('Connected. Fixing file access...');

  const posts = await Post.find({ 'file.public_id': { $exists: true, $ne: null } });
  console.log(`Found ${posts.length} post(s) with a file.`);

  let fixed = 0;
  let failed = 0;

  for (const post of posts) {
    const publicId = post.file.public_id;
   
    const candidateTypes = post.file.resourceType
      ? [post.file.resourceType]
      : ['image', 'raw'];

    let done = false;
    for (const resourceType of candidateTypes) {
      try {
        await cloudinary.api.update(publicId, {
          access_mode: 'public',
          resource_type: resourceType
        });
        console.log(`✅ Fixed: ${publicId} (${resourceType})`);
        fixed++;
        done = true;
        break;
      } catch (err) {
        // Wrong resource_type guess — try the next candidate silently.
      }
    }

    if (!done) {
      console.warn(`⚠️  Could not fix: ${publicId} (post ${post._id})`);
      failed++;
    }
  }

  console.log(`\nDone. Fixed ${fixed}, failed ${failed} of ${posts.length}.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Fix script failed:', err);
  process.exit(1);
});