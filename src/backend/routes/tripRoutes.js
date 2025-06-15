import express from 'express';
import { logSimulatedTrip } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', protect, logSimulatedTrip);

export default router;
