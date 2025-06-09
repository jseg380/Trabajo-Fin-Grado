import express from 'express';
import { initializeDB } from '../controllers/initController.js';

const router = express.Router();

// POST /api/init-db
router.post('/init-db', initializeDB);

export default router;
