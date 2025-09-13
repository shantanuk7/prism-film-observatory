import express from 'express';
import { createScene, getScenesForMovie } from '../controllers/sceneController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSceneImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Middleware to check if user is a contributor
const isContributor = (req, res, next) => {
    if (req.user && req.user.role === 'contributor') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Access is restricted to contributors.' });
    }
};

router.route('/')
  .post(protect, isContributor, uploadSceneImages, createScene);

router.route('/:movieId')
  .get(getScenesForMovie);

export default router;
