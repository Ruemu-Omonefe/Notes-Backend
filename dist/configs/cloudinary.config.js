"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoverDesign = exports.uploadToCloudinary = void 0;
// utils/cloudinary.ts
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadToCloudinary = async (filePath, resourceType, originalFileName) => {
    const publicId = path_1.default.parse(originalFileName).name;
    const result = await cloudinary_1.v2.uploader.upload(filePath, {
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
exports.uploadToCloudinary = uploadToCloudinary;
const getCoverDesign = async () => {
    try {
        const result = await cloudinary_1.v2.search
            .expression('folder:Covers')
            .sort_by('public_id', 'desc')
            .max_results(100)
            .execute();
        const covers = result.resources;
        if (!covers.length)
            return null;
        return covers.map((cover) => cover.url);
    }
    catch (err) {
        console.error("Error fetching cover designs:", err);
        return null;
    }
};
exports.getCoverDesign = getCoverDesign;
