import express from 'express';
import { createSuggestion } from '../controllers/suggestionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSceneImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Observers can only create suggestions
router.route('/').post(protect, uploadSceneImages, createSuggestion);

export default router;