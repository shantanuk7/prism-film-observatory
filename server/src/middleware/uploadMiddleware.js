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
    cloudinary: cloudinary,
    params: async (req, file) => {
        // 1. Create a unique public_id from the original filename (without extension)
        const fileName = path.parse(file.originalname).name.replace(/\s+/g, '_');
        const publicId = `${fileName}-${Date.now()}`;
        
        return {
            folder: 'prism_analyses',
            public_id: publicId,
            resource_type: 'raw',
            // NOTE: We have removed the 'flags' parameter completely.
        };
    },
});

// Configure a new multer instance for PDF uploads
const uploadAnalysisPdf = multer({ storage: analysisStorage });

// Add this new export for handling the analysis PDF upload
export const uploadAnalysisFile = uploadAnalysisPdf.single('analysisFile');
