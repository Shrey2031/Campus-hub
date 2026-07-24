import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import fsSync from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const safeDeleteLocalFile = async (localFilePath) => {
  try {
    if (fsSync.existsSync(localFilePath)) {
      await fs.unlink(localFilePath);
    }
  } catch (cleanupError) {
    console.error('Failed to clean up local temp file:', cleanupError);
  }
};


const uploadOnCloudinary = async (localFilePath, resourceType = 'auto') => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      access_mode: 'public',
      use_filename: true,
      unique_filename: false,
    });

    await safeDeleteLocalFile(localFilePath);
    return response;

  } catch (error) {
  
    console.error('Cloudinary upload failed:', error?.message || error);
    await safeDeleteLocalFile(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
