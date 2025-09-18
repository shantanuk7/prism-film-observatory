import User from '../models/User.js';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Observation from '../models/Observation.js';
import Analysis from '../models/Analysis.js';

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

// @desc    Get all of a user's bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
export const getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('bookmarks')
            .populate('analysisBookmarks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. Get all unique movie IDs from both bookmark types
        const observationMovieIds = user.bookmarks.map(b => b.movieId);
        const analysisMovieIds = user.analysisBookmarks.map(b => b.movieId);
        const allMovieIds = [...new Set([...observationMovieIds, ...analysisMovieIds])];

        // 2. Fetch all required movie details from TMDB in parallel
        const movieDetailsPromises = allMovieIds.map(id =>
            axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`)
        );
        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        
        // 3. Create a simple map for easy lookup on the frontend
        const movieDetailsMap = movieDetailsResponses.reduce((acc, response) => {
            acc[response.data.id] = {
                title: response.data.title,
                poster_path: response.data.poster_path,
                release_date: response.data.release_date
            };
            return acc;
        }, {});
        
        // 4. Populate the author's username for each bookmark
        const populatedBookmarks = await Observation.populate(user.bookmarks, { path: 'user', select: 'username' });
        const populatedAnalysisBookmarks = await Analysis.populate(user.analysisBookmarks, { path: 'user', select: 'username' });

        res.json({
            bookmarks: populatedBookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            analysisBookmarks: populatedAnalysisBookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            movieDetailsMap: movieDetailsMap,
        });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};


// @desc    Update user profile (username, email)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = username || user.username;
        user.email = email || user.email;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
        if (newPassword && newPassword.length >= 6) {
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }
    } else {
        res.status(401).json({ message: 'Invalid current password' });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Anonymize user's content instead of deleting it
        await Observation.updateMany({ user: userId }, { $unset: { user: "" } });
        await Analysis.updateMany({ user: userId }, { $unset: { user: "" } });

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Clear the cookie
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
         res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

export const updateUserAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // The secure URL of the uploaded image is on req.file.path
        user.avatarUrl = req.file.path;
        await user.save();

        res.json({
            message: 'Avatar updated successfully',
            avatarUrl: user.avatarUrl
        });

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};