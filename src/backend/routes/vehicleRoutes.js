import express from 'express';
import { createVehicle, getUserVehicles, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.route('/')
  .post(protect, createVehicle)
  .get(protect, getUserVehicles);

router.route('/:id')
  .put(protect, updateVehicle)
  .delete(protect, deleteVehicle);

export default router;
