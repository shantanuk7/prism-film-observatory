import Observation from '../models/Observation.js';
import User from '../models/User.js';

// @desc    Create a new observation
// @route   POST /api/observations
// @access  Private
export const createObservation = async (req, res) => {
  try {
    const { movieId, sceneId, content, timestamp, categories } = req.body;

    if (!movieId || !sceneId || !content || !categories) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const observation = new Observation({
      movieId,
      sceneId,
      content,
      timestamp,
      categories,
      user: req.user._id, // from 'protect' middleware
    });

    const createdObservation = await observation.save();
    // Populate user details before sending back
    await createdObservation.populate('user', 'username');
    res.status(201).json(createdObservation);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all observations for a movie
// @route   GET /api/observations/:movieId
// @access  Public
export const getObservationsForMovie = async (req, res) => {
  try {
    const observations = await Observation.find({ movieId: req.params.movieId })
      .populate('user', 'username') // Only get username from user doc
      .sort({ createdAt: -1 }); // Show newest first

    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Like/Unlike an observation
// @route   PUT /api/observations/:id/like
// @access  Private
export const likeObservation = async (req, res) => {
    try {
        const observation = await Observation.findById(req.params.id);

        if (!observation) {
            return res.status(404).json({ message: 'Observation not found' });
        }

        // Check if the post has already been liked by this user
        if (observation.likes.includes(req.user._id)) {
            // Unlike it
            observation.likes = observation.likes.filter(
                (userId) => userId.toString() !== req.user._id.toString()
            );
        } else {
            // Like it
            observation.likes.push(req.user._id);
        }

        await observation.save();
        await observation.populate('user', 'username');
        res.json(observation);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Bookmark/Unbookmark an observation
// @route   PUT /api/observations/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const observationId = req.params.id;

        // Check if the observation exists to prevent errors
        const observation = await Observation.findById(observationId);
        if (!observation) {
            return res.status(404).json({ message: 'Observation not found' });
        }

        // Check if the observation has already been bookmarked
        const isBookmarked = user.bookmarks.includes(observationId);

        if (isBookmarked) {
            user.bookmarks = user.bookmarks.filter(
                (id) => id.toString() !== observationId.toString()
            );
        } else {
            user.bookmarks.push(observationId);
        }

        await user.save();
        res.json({ bookmarks: user.bookmarks });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};