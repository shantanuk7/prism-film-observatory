import express from 'express';
import { logViewHistory, getViewHistory } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have this middleware

const router = express.Router();

router.route('/history')
  .post(protect, logViewHistory)
  .get(protect, getViewHistory);

export default router;