import express from 'express';
import { getUserProfile, updateUserAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// It doesn't need a parameter because the user is identified by the token.
router.get('/profile', protect, getUserProfile);

// The middleware runs in order: check auth, then handle upload, then run controller
router.put('/profile/avatar', protect, upload, updateUserAvatar);

export default router;
