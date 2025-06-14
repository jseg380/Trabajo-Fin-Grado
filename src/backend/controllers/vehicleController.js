import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

// @desc    Create a new vehicle
// @route   POST /api/vehicles
export const createVehicle = async (req, res) => {
  try {
    const { make, model, year, fuelType, emissionFactor } = req.body;
    const vehicle = new Vehicle({
      make,
      model,
      year,
      fuelType,
      emissionFactor,
      owner: req.user, // From protect middleware
    });

    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
  } catch (error) {
    res.status(400).json({ error: 'Vehicle creation failed: ' + error.message });
  }
};

// @desc    Get all vehicles for a user
// @route   GET /api/vehicles
export const getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user });
    if (!vehicles) {
      return res.status(404).json({ error: 'No vehicles found' });
    }
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
