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
  },
});

const upload = multer({ storage: storage });

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

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prism_avatars',
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif'],
    // Apply a transformation to create a square, 150x150 avatar
    transformation: [{ width: 150, height: 150, crop: 'fill', gravity: 'face' }],
    // Generate a unique public_id based on the user's ID to prevent duplicates
    public_id: (req, file) => `avatar-${req.user._id}`,
  },
});

const uploadAnalysisPdf = multer({ storage: analysisStorage });

const uploadAvatar = multer({ 
  storage: avatarStorage,
  // Optional: Add file size limit
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

export const uploadAvatarFile = uploadAvatar.single('avatar');
export const uploadAnalysisFile = uploadAnalysisPdf.single('analysisFile');