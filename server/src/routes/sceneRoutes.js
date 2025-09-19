import express from 'express';
import { createScene, getScenesForMovie, updateScene } from '../controllers/sceneController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSceneImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
};

// Admins can create scenes directly, while observers use the suggestion route
router.route('/')
  .post(protect, isAdmin, uploadSceneImages, createScene);

router.route('/:movieId')
  .get(getScenesForMovie);

router.route('/:id')
  .put(protect, isAdmin, uploadSceneImages, updateScene);

export default router;