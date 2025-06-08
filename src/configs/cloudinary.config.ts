// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

export const uploadToCloudinary = async (filePath: string, resourceType: 'image' | 'video' | 'auto', originalFileName: string) => {
    const publicId = path.parse(originalFileName).name; 
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    public_id: publicId,
    overwrite: true,
    use_filename: true,
    unique_filename: false,
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
