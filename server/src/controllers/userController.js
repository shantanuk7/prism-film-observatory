import User from '../models/User.js';
import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// @desc    Log a movie to the user's view history
// @route   POST /api/users/history
// @access  Private
export const logViewHistory = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove any existing entry for this movie to move it to the front
    user.viewHistory = user.viewHistory.filter(item => item.movieId !== movieId);

    // Add the new entry to the beginning of the array
    user.viewHistory.unshift({ movieId });

    // Limit the history to the 20 most recent movies
    if (user.viewHistory.length > 20) {
      user.viewHistory = user.viewHistory.slice(0, 20);
    }

    await user.save();
    res.status(200).json({ message: 'View history updated' });

  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get the user's view history with movie details
// @route   GET /api/users/history
// @access  Private
export const getViewHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || user.viewHistory.length === 0) {
            return res.json([]);
        }

        // Fetch details for each movie from TMDB
        const movieDetailsPromises = user.viewHistory.map(item =>
            axios.get(`https://api.themoviedb.org/3/movie/${item.movieId}?api_key=${TMDB_API_KEY}&language=en-US`)
        );
        
        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const movies = movieDetailsResponses.map(response => response.data);
        
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};