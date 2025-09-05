import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

// @desc    Create a new vehicle
// @route   POST /api/vehicles
export const createVehicle = async (req, res) => {
  try {
    // First, check how many vehicles the user has *before* adding the new one.
    const vehicleCount = await Vehicle.countDocuments({ owner: req.user });

    const { make, model, year, fuelType, emissionFactor } = req.body;
    const vehicle = new Vehicle({
      make: make,
      model: model,
      year: year,
      fuelType: fuelType,
      emissions: emissionFactor,
      owner: req.user,
    });
    const createdVehicle = await vehicle.save();

    if (vehicleCount === 0) {
      // Find the user and add the achievement if they don't have it
      await User.findByIdAndUpdate(req.user, { $addToSet: { achievements: 'FIRST_VEHICLE' } });
    }

    res.status(201).json(createdVehicle);
  } catch (error) {
    res.status(400).json({ error: 'Vehicle creation failed: ' + error.message });
  }
};

// @desc    Get a single vehicle by ID
// @route   GET /api/vehicles/:id
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    // Security check: ensure the requester owns the vehicle
    if (vehicle.owner.toString() !== req.user) {
      return res.status(401).json({ error: 'User not authorized' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// @desc    Get all vehicles for a user
// @route   GET /api/vehicles
export const getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user })
      .populate('status.checkedOutBy', 'name')
      .populate('status.reservedBy', 'name');

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
    if (vehicle.owner.toString() !== req.user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    // Update simple fields
    vehicle.make = req.body.make || vehicle.make;
    vehicle.model = req.body.model || vehicle.model;
    vehicle.year = req.body.year || vehicle.year;
    vehicle.fuelType = req.body.fuelType || vehicle.fuelType;
    vehicle.emissions = req.body.emissions || vehicle.emissions;

    // Handle nested upcomingMaintenance object for logging dates.
    // This allows the frontend to send just the maintenance data to be updated.
    if (req.body.upcomingMaintenance) {
      // Merge the new maintenance data with the existing data
      vehicle.upcomingMaintenance = {
        ...vehicle.upcomingMaintenance,
        ...req.body.upcomingMaintenance,
      };
    }

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

// @desc    Check in a vehicle
// @route   POST /api/vehicles/:id/checkin
export const checkInVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    if (vehicle.owner.toString() !== req.user) {
      return res.status(401).json({ error: 'User not authorized' });
    }
    if (vehicle.status.state === 'at_home') {
      return res.status(400).json({ error: 'Vehicle already at home' });
    }

    vehicle.status.state = 'at_home';
    vehicle.status.checkedOutBy = null;
    vehicle.status.lastUpdated = new Date();
    await vehicle.save();
    res.status(200).json({ message: 'Vehicle checked in' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// @desc    Check out a vehicle
// @route   POST /api/vehicles/:id/checkout
export const checkOutVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    if (vehicle.owner.toString() !== req.user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    if (vehicle.status.state === 'in_use') {
      return res.status(400).json({ error: 'Vehicle already in use' });
    }
    // Allow checkout if the vehicle is reserved BY THE CURRENT USER
    if (vehicle.status.state === 'reserved' && vehicle.status.reservedBy.toString() !== req.user) {
      return res.status(403).json({ error: 'Vehicle is reserved by another user.' });
    }

    vehicle.status.state = 'in_use';
    vehicle.status.checkedOutBy = req.user;
    vehicle.status.reservedBy = null;
    vehicle.status.reservedFrom = null;
    vehicle.status.reservedUntil = null;
    vehicle.status.lastUpdated = new Date();
    await vehicle.save();
    res.status(200).json({ message: 'Vehicle checked out' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// @desc    Reserve a vehicle
// @route   POST /api/vehicles/:id/reserve
export const reserveVehicle = async (req, res) => {
  try {
    const { reservedFrom, reservedUntil } = req.body;
    if (!reservedFrom || !reservedUntil) {
      return res.status(400).json({ error: 'Reservation start and end times are required.' });
    }

    if (new Date(reservedFrom) >= new Date(reservedUntil)) {
      return res.status(400).json({ error: 'Reservation start time must be before end time.' });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    if (vehicle.status.state !== 'at_home') {
      return res.status(400).json({ error: 'Vehicle must be at home to be reserved.' });
    }

    vehicle.status.state = 'reserved';
    vehicle.status.reservedBy = req.user;
    vehicle.status.reservedFrom = new Date(reservedFrom);
    vehicle.status.reservedUntil = new Date(reservedUntil);
    vehicle.status.lastUpdated = new Date();

    await vehicle.save();
    res.status(200).json({ message: 'Vehicle reserved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// @desc    Cancel a reservation
// @route   POST /api/vehicles/:id/cancel-reservation
export const cancelReservation = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    if (vehicle.status.state !== 'reserved') {
      return res.status(400).json({ error: 'Vehicle is not reserved.' });
    }
    if (vehicle.status.reservedBy.toString() !== req.user) {
      return res.status(403).json({ error: 'You did not make this reservation.' });
    }

    vehicle.status.state = 'at_home';
    vehicle.status.reservedBy = null;
    vehicle.status.reservedFrom = null;
    vehicle.status.reservedUntil = null;
    vehicle.status.lastUpdated = new Date();

    await vehicle.save();
    res.status(200).json({ message: 'Reservation cancelled.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
