import Scene from '../models/Scene.js';

// @desc    Create a new scene
// @route   POST /api/scenes
// @access  Private (Contributor)
export const createScene = async (req, res) => {
  try {
    const { movieId, sceneNumber, description, startTime, endTime } = req.body;

    // Check for uploaded files
    if (!req.files || !req.files.startFrame || !req.files.endFrame) {
      return res.status(400).json({ message: 'Both start and end frame images are required.' });
    }

    const startFrameUrl = req.files.startFrame[0].path;
    const endFrameUrl = req.files.endFrame[0].path;

    const newScene = new Scene({
      movieId,
      sceneNumber,
      description,
      startTime,
      endTime,
      startFrameUrl,
      endFrameUrl,
      user: req.user._id,
    });

    const savedScene = await newScene.save();
    res.status(201).json(savedScene);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
        return res.status(409).json({ message: `Scene number ${req.body.sceneNumber} already exists for this movie.` });
    }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all scenes for a movie
// @route   GET /api/scenes/:movieId
// @access  Public
export const getScenesForMovie = async (req, res) => {
  try {
    const scenes = await Scene.find({ movieId: req.params.movieId }).sort({ sceneNumber: 1 });
    res.json(scenes);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};