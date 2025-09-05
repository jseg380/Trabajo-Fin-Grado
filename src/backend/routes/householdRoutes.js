import express from 'express';
import { getMyHousehold, joinHousehold, leaveHousehold } from '../controllers/householdController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-household', protect, getMyHousehold);

router.post('/join', protect, joinHousehold);

router.post('/leave', protect, leaveHousehold);

export default router;
