import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

// @desc    Create a new vehicle
// @route   POST /api/vehicles
export const createVehicle = async (req, res) => {
  try {
    const { make, model, year, fuelType, emissionFactor } = req.body;
    const vehicle = new Vehicle({
      make: make,
      model: model,
      year: year,
      fuelType: fuelType,
      emissions: emissionFactor,
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

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Ensure the user owns the vehicle
    if (vehicle.owner.toString() !== req.user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    // Update fields from request body
    vehicle.make = req.body.make || vehicle.make;
    vehicle.model = req.body.model || vehicle.model;
    vehicle.year = req.body.year || vehicle.year;
    vehicle.fuelType = req.body.fuelType || vehicle.fuelType;
    vehicle.emissions = req.body.emissions || vehicle.emissions;

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ error: 'Vehicle update failed: ' + error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Ensure the user owns the vehicle
    if (vehicle.owner.toString() !== req.user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
