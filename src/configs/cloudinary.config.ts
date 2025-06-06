// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

export const uploadToCloudinary = async (filePath: string, resourceType: 'image' | 'video' | 'auto') => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
  });
  return {
    url: result.secure_url,
    metadata: {
      size: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
    }
  };
};
