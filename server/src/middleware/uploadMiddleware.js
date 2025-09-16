import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prism_scenes',
    allowed_formats: ['jpeg', 'png', 'jpg'],
    // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional
  },
});

// Configure multer to use Cloudinary storage
const upload = multer({ storage: storage });

// Middleware to upload startFrame and endFrame
export const uploadSceneImages = upload.fields([
  { name: 'startFrame', maxCount: 1 },
  { name: 'endFrame', maxCount: 1 },
]);

const analysisStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'prism_analyses',
      resource_type: 'raw',
      format: 'pdf',
      use_filename: true,
      unique_filename: true,
    };
  },
});

// Configure a new multer instance for PDF uploads
const uploadAnalysisPdf = multer({ storage: analysisStorage });

// Add this new export for handling the analysis PDF upload
export const uploadAnalysisFile = uploadAnalysisPdf.single('analysisFile');
