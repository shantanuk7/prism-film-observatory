import express from 'express';
import {
  createObservation,
  getObservationsForMovie,
  likeObservation,
} from '../controllers/observationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createObservation);
router.route('/:movieId').get(getObservationsForMovie);
router.route('/:id/like').put(protect, likeObservation);

export default router;
