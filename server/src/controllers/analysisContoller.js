import Analysis from '../models/Analysis.js';
import User from '../models/User.js';

// NOTE: File upload logic is mocked for this example.
// In a real app, you'd use a library like multer to handle the file
// upload to a service like S3 or Cloudinary and get a URL.

// @desc    Create a new analysis
// @route   POST /api/analyses
// @access  Private
// ...
export const createAnalysis = async (req, res) => {
  try {
    const { movieId, title, description } = req.body;

    if (!movieId || !title || !description || !req.file) {
      return res.status(400).json({ message: 'Missing required fields or file' });
    }

    const analysis = new Analysis({
      movieId,
      title,
      description,
      // THIS IS THE FIX:
      // The public ID from Cloudinary is available on `req.file.filename`,
      // not `req.file.public_id`. This corrects the validation error.
      filePublicId: req.file.filename, 
      fileSize: req.file.size,
      user: req.user._id,
    });

    const createdAnalysis = await analysis.save();
    await createdAnalysis.populate('user', 'username');
    res.status(201).json(createdAnalysis);
  } catch (error) {
    console.error('ERROR CREATING ANALYSIS:', error); 
    res.status(500).json({ message: `Server Error: ${error.message || 'An unexpected error occurred.'}` });
  }
};
// @desc    Get all analyses for a movie
// @route   GET /api/analyses/:movieId
// @access  Public
export const getAnalysesForMovie = async (req, res) => {
  try {
    const analyses = await Analysis.find({ movieId: req.params.movieId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const likeAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        const userId = req.user._id.toString();
        const userIndex = analysis.likes.findIndex(id => id.toString() === userId);

        if (userIndex > -1) {
            analysis.likes.splice(userIndex, 1); // Unlike
        } else {
            analysis.likes.push(req.user._id); // Like
        }

        await analysis.save();
        await analysis.populate('user', 'username');
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Bookmark/Unbookmark an analysis
// @route   PUT /api/analyses/:id/bookmark
// @access  Private
export const toggleAnalysisBookmark = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const analysisId = req.params.id;

        const analysis = await Analysis.findById(analysisId);
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        const isBookmarked = user.analysisBookmarks.includes(analysisId);

        if (isBookmarked) {
            user.analysisBookmarks = user.analysisBookmarks.filter(
                (id) => id.toString() !== analysisId.toString()
            );
        } else {
            user.analysisBookmarks.push(analysisId);
        }

        await user.save();
        res.json({ analysisBookmarks: user.analysisBookmarks });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};