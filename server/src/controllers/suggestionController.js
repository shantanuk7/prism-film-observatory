import Suggestion from '../models/Suggestion.js';

// @desc    Create a new suggestion for a scene
// @route   POST /api/suggestions
// @access  Private (Observers)
export const createSuggestion = async (req, res) => {
    try {
        const { movieId, suggestionType, sceneToEdit, sceneNumber, description, startTime, endTime, notes } = req.body;

        const payload = {};
        if (description) payload.description = description;
        if (startTime) payload.startTime = startTime;
        if (endTime) payload.endTime = endTime;
        if (sceneNumber) payload.sceneNumber = sceneNumber;
        if (req.files?.startFrame) payload.startFrameUrl = req.files.startFrame[0].path;
        if (req.files?.endFrame) payload.endFrameUrl = req.files.endFrame[0].path;

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({ message: 'No changes were suggested.' });
        }

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