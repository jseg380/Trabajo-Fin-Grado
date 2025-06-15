import express from 'express';
import { getMaintenanceSummary } from '../controllers/maintenanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getMaintenanceSummary);

export default router;
