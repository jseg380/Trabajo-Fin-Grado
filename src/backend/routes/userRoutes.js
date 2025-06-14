import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// It doesn't need a parameter because the user is identified by the token.
router.get('/profile', protect, getUserProfile);

// Removing the insecure GET /:username route.

export default router;
