import Suggestion from '../models/Suggestion.js';
import Scene from '../models/Scene.js';
import User from '../models/User.js';

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

export const getAllUsers = async (req, res) => {
    try {
        // Find all users but exclude their passwords from the result
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['observer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent admin from demoting themselves if they are the last admin
        if (req.user._id.toString() === user._id.toString() && user.role === 'admin' && role === 'observer') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot demote the last admin.' });
            }
        }

        user.role = role;
        await user.save();
        res.json({ message: `User role updated to ${role}.` });

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // You cannot delete your own account from the admin panel
        if (req.user._id.toString() === user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account from here.' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully.' });

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};