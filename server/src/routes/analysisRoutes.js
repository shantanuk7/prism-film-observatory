import express from 'express';
import { 
    createAnalysis, 
    getAnalysesForMovie, 
    likeAnalysis,
    toggleAnalysisBookmark
} from '../controllers/analysisContoller.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadAnalysisFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, uploadAnalysisFile, createAnalysis);

router.route('/:movieId')
  .get(getAnalysesForMovie);

router.route('/:id/like').put(protect, likeAnalysis); 

router.route('/:id/bookmark').put(protect, toggleAnalysisBookmark);

export default router;