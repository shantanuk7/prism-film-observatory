import Suggestion from '../models/Suggestion.js';

// @desc    Create a new suggestion for a scene
// @route   POST /api/suggestions
// @access  Private (Observers)
export const createSuggestion = async (req, res) => {
    try {
        const { movieId, suggestionType, sceneToEdit, sceneNumber, description, startTime, endTime, notes } = req.body;

        if (!req.files || !req.files.startFrame || !req.files.endFrame) {
            return res.status(400).json({ message: 'Start and end frame images are required.' });
        }
        
        const payload = {
            description,
            startTime,
            endTime,
            sceneNumber,
            startFrameUrl: req.files.startFrame[0].path,
            endFrameUrl: req.files.endFrame[0].path,
        };

        const suggestion = new Suggestion({
            movieId,
            suggestionType,
            sceneToEdit: suggestionType === 'EDIT_SCENE' ? sceneToEdit : null,
            suggestedBy: req.user._id,
            payload,
            notes,
        });

        await suggestion.save();
        res.status(201).json({ message: 'Suggestion submitted successfully! It will be reviewed by an admin.' });

    } catch (error) {
        console.error("Error creating suggestion:", error);
        res.status(500).json({ message: 'Server Error: Could not submit suggestion.' });
    }
};