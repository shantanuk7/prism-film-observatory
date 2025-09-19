import Suggestion from '../models/Suggestion.js';
import Scene from '../models/Scene.js';

// @desc    Get all pending suggestions
// @route   GET /api/admin/suggestions
// @access  Private (Admin)
export const getPendingSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find({ status: 'pending' })
            .populate('suggestedBy', 'username avatarUrl')
            .populate('sceneToEdit')
            .sort({ createdAt: 1 });
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Approve a suggestion
// @route   PUT /api/admin/suggestions/:id/approve
// @access  Private (Admin)
export const approveSuggestion = async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);
        if (!suggestion) {
            return res.status(404).json({ message: 'Suggestion not found.' });
        }

        const { suggestionType, payload, sceneToEdit } = suggestion;

        if (suggestionType === 'NEW_SCENE') {
            const newScene = new Scene({
                movieId: suggestion.movieId,
                user: suggestion.suggestedBy,
                ...payload
            });
            await newScene.save();
        } else if (suggestionType === 'EDIT_SCENE') {
            await Scene.findByIdAndUpdate(sceneToEdit, { $set: payload });
        }

        suggestion.status = 'approved';
        await suggestion.save();

        res.json({ message: 'Suggestion approved and applied.' });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Reject a suggestion
// @route   PUT /api/admin/suggestions/:id/reject
// @access  Private (Admin)
export const rejectSuggestion = async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);
        if (!suggestion) {
            return res.status(404).json({ message: 'Suggestion not found.' });
        }

        suggestion.status = 'rejected';
        await suggestion.save();

        res.json({ message: 'Suggestion rejected.' });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};