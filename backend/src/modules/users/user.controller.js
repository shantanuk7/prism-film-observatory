const { getMe, updateMe, changePassword } = require('./user.service');
const { cloudinary } = require('../../config/cloudinary');
const multer = require('multer');

const memory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 10) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Only images allowed'));
    cb(null, true);
  }
});

async function uploadBufferToCloudinary(buffer, folder, filename) {
  const streamifier = require('streamifier');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function getMeController(req, res, next) {
  try {
    const me = await getMe(Number(req.user.id));
    res.json(me);
  } catch (e) {
    next(e);
  }
}

async function updateMeController(req, res, next) {
  try {
    let profilePicUrl;
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'prism/profile_pics', `user_${req.user.id}`);
      profilePicUrl = result.secure_url;
    }
    const { username } = req.body;
    const updated = await updateMe(Number(req.user.id), { username, profilePicUrl });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

async function changePasswordController(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const out = await changePassword(Number(req.user.id), currentPassword, newPassword);
    res.json(out);
  } catch (e) {
    res.status(400);
    next(e);
  }
}

module.exports = {
  memoryUpload: memory.single('profilePic'),
  getMeController,
  updateMeController,
  changePasswordController
};
