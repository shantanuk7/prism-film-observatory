import express from 'express';
import { logViewHistory, getViewHistory, getBookmarks, updateUserPassword, deleteUserAccount, updateUserProfile, updateUserAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have this middleware
import { uploadAvatarFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/history')
  .post(protect, logViewHistory)
  .get(protect, getViewHistory);

router.route('/bookmarks').get(protect, getBookmarks);

router.route('/profile')
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

router.route('/password').put(protect, updateUserPassword);

router.route('/avatar').put(protect, uploadAvatarFile, updateUserAvatar);

export default router;