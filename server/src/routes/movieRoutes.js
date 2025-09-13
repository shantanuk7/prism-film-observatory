import express from 'express';
import { 
    getTrendingMovies, 
    getTopRatedMovies, 
    searchMovies,
    getMovieDetails
} from '../controllers/movieController.js';

const router = express.Router();

// @desc   Fetch trending movies for the week
// @route  GET /api/movies/trending
// @access Public
router.get('/trending', getTrendingMovies);

// @desc   Fetch top-rated movies
// @route  GET /api/movies/top-rated
// @access Public
router.get('/top-rated', getTopRatedMovies);

// @desc   Search for movies by a query string
// @route  GET /api/movies/search
// @access Public
router.get('/search', searchMovies);

// @desc   Get details for a single movie by its TMDB ID
// @route  GET /api/movies/:movieId
// @access Public
router.get('/:movieId', getMovieDetails); // <-- This is the new route

export default router;

