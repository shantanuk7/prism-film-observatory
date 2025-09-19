import express from 'express'
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Observer
router.post('/observer/register', (req, res) => registerUser(req, res))
router.post('/observer/login', (req, res) => loginUser(req, res))

// Admin
router.post('/admin/register', (req, res) => registerUser(req, res))
router.post('/admin/login', (req, res) => loginUser(req, res))

// Common
router.post('/logout', logoutUser)
router.get('/me', protect, getMe)

export default router