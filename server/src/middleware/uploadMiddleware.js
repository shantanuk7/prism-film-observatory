import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------------------------------------------
   SCENE FRAME UPLOADS (images)
---------------------------------------------- */

const sceneStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'prism_scenes',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    transformation: [
      { width: 1280, height: 720, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  }
});

const uploadScene = multer({
  storage: sceneStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

export const uploadSceneImages = uploadScene.fields([
  { name: 'startFrame', maxCount: 1 },
  { name: 'endFrame', maxCount: 1 }
]);


/* ---------------------------------------------
   ANALYSIS PDF UPLOADS
---------------------------------------------- */

const analysisStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'prism_analyses',
    resource_type: 'raw',  // required for pdf
    format: 'pdf',
    use_filename: true,
    unique_filename: true
  }),
});

// limits belong to Multer, not CloudinaryStorage
const uploadAnalysisPdf = multer({
  storage: analysisStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

export const uploadAnalysisFile = uploadAnalysisPdf.single('analysisFile');


/* ---------------------------------------------
   AVATAR UPLOADS (images)
---------------------------------------------- */

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'prism_avatars',
    allowedFormats: ['jpeg', 'png', 'jpg', 'gif'],
    public_id: (req) => `avatar-${req.user._id}`,
    transformation: [
      { width: 150, height: 150, crop: 'fill', gravity: 'face' },
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB
});

export const uploadAvatarFile = uploadAvatar.single('avatar');