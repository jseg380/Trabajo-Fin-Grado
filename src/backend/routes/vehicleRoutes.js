import express from 'express';
import {
  createVehicle,
  getVehicleById,
  getUserVehicles,
  updateVehicle,
  deleteVehicle,
  checkInVehicle,
  checkOutVehicle,
  reserveVehicle,
  cancelReservation,
} from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.route('/').post(protect, createVehicle).get(protect, getUserVehicles);

router.route('/:id').get(protect, getVehicleById).put(protect, updateVehicle).delete(protect, deleteVehicle);

router.post('/:id/checkout', protect, checkOutVehicle);

router.post('/:id/checkin', protect, checkInVehicle);

router.post('/:id/reserve', protect, reserveVehicle);

router.post('/:id/cancel-reservation', protect, cancelReservation);

export default router;
