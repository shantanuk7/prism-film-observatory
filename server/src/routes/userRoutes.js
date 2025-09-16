import express from 'express';
import { logViewHistory, getViewHistory, getBookmarks, updateUserPassword, deleteUserAccount, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have this middleware

const router = express.Router();

router.route('/history')
  .post(protect, logViewHistory)
  .get(protect, getViewHistory);

router.route('/bookmarks').get(protect, getBookmarks);

router.route('/profile')
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

router.route('/password').put(protect, updateUserPassword);

export default router;