import express from 'express';
import {
  createObservation,
  getObservationsForMovie,
  likeObservation,
  toggleBookmark,
} from '../controllers/observationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createObservation);
router.route('/:movieId').get(getObservationsForMovie);
router.route('/:id/like').put(protect, likeObservation);
router.route('/:id/bookmark').put(protect, toggleBookmark);

export default router;