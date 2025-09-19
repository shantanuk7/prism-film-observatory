import express from 'express';
import { 
    getPendingSuggestions, 
    approveSuggestion, 
    rejectSuggestion,
    getAllUsers,
    updateUserRole,
    deleteUser
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to ensure only admins can access these routes
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
};

router.get('/suggestions', protect, isAdmin, getPendingSuggestions);
router.put('/suggestions/:id/approve', protect, isAdmin, approveSuggestion);
router.put('/suggestions/:id/reject', protect, isAdmin, rejectSuggestion);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);
router.delete('/users/:id', protect, isAdmin, deleteUser);

export default router;