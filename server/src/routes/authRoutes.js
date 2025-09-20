import express from 'express';
import { registerUser, loginUser, logoutUser, getMe, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Simplified routes that the new frontend uses
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

// New route for handling the email verification link
router.post('/verify-email', verifyEmail);

export default router;