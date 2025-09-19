// server/src/controllers/userController.js

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

        user.viewHistory = user.viewHistory.filter(item => item.movieId !== movieId);
        user.viewHistory.unshift({ movieId });

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

        const movieDetailsPromises = user.viewHistory.map(item =>
            axios.get(`https://api.themoviedb.org/3/movie/${item.movieId}?api_key=${TMDB_API_KEY}&language=en-US`)
        );

        // *** FIX: Use Promise.allSettled to handle potential errors ***
        const results = await Promise.allSettled(movieDetailsPromises);

        const movies = results
            .filter(result => result.status === 'fulfilled') // Keep only successful requests
            .map(result => result.value.data); // Extract the movie data

        res.json(movies);

    } catch (error) {
        console.error("Error in getViewHistory:", error.message);
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

        const observationMovieIds = user.bookmarks.map(b => b.movieId);
        const analysisMovieIds = user.analysisBookmarks.map(b => b.movieId);
        const allMovieIds = [...new Set([...observationMovieIds, ...analysisMovieIds])];

        const movieDetailsPromises = allMovieIds.map(id =>
            axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`)
        );
        
        // *** FIX: Use Promise.allSettled here as well for robustness ***
        const movieDetailsResults = await Promise.allSettled(movieDetailsPromises);
        
        const movieDetailsMap = movieDetailsResults
            .filter(result => result.status === 'fulfilled')
            .reduce((acc, result) => {
                const movieData = result.value.data;
                acc[movieData.id] = {
                    title: movieData.title,
                    poster_path: movieData.poster_path,
                    release_date: movieData.release_date
                };
                return acc;
            }, {});

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

// @desc    Update user profile (username, email, avatar)
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
            avatarUrl: updatedUser.avatarUrl,
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

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateUserAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
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

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await Observation.updateMany({ user: userId }, { $unset: { user: "" } });
        await Analysis.updateMany({ user: userId }, { $unset: { user: "" } });
        await User.findByIdAndDelete(userId);
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};