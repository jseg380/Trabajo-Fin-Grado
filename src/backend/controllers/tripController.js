import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

// This is the main function for logging a simulated trip
export const logSimulatedTrip = async (req, res) => {
  try {
    const { vehicleId, distance } = req.body;
    const userId = req.user;

    const [vehicle, user] = await Promise.all([
      Vehicle.findById(vehicleId),
      User.findById(userId),
    ]);

    if (!vehicle || !user) {
      return res.status(404).json({ error: 'Vehicle or User not found' });
    }

    // 1. UPDATE VEHICLE MAINTENANCE METRICS
    if (vehicle.upcomingMaintenance) {
      if (vehicle.upcomingMaintenance.brakes?.distance) {
        vehicle.upcomingMaintenance.brakes.distance -= distance;
      }
      if (vehicle.upcomingMaintenance.tires?.distance) {
        vehicle.upcomingMaintenance.tires.distance -= distance;
      }
      if (vehicle.upcomingMaintenance.oilChange?.distance) {
        vehicle.upcomingMaintenance.oilChange.distance -= distance;
      }
    }

    // 2. CREATE THE TRIP RECORD
    const calculatedEmissions = distance * (vehicle.emissions || 150);
    await Trip.create({
      driver: userId,
      vehicle: vehicleId,
      distance,
      calculatedEmissions,
      locations: { start: { type: 'Point', coordinates: [0,0] }, end: { type: 'Point', coordinates: [0,0] } },
    });

    // 3. UPDATE USER STATS & GRANT ACHIEVEMENTS
    const oldDistance = user.stats.distanceTraveled || 0;
    user.stats.distanceTraveled = oldDistance + distance;

    const achievementsToGrant = [];
    if (!user.achievements.includes('FIRST_TRIP')) {
      achievementsToGrant.push('FIRST_TRIP');
    }
    if (oldDistance < 1000 && user.stats.distanceTraveled >= 1000) {
      achievementsToGrant.push('DIST_1000');
    }
    if (oldDistance < 10000 && user.stats.distanceTraveled >= 10000) {
      achievementsToGrant.push('DIST_10000');
    }

    if (achievementsToGrant.length > 0) {
      user.achievements.push(...achievementsToGrant);
    }
    
    // 4. SAVE ALL CHANGES
    await Promise.all([vehicle.save(), user.save()]);

    res.status(201).json({ message: 'Trip logged successfully!', granted: achievementsToGrant });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log trip: ' + error.message });
  }
};
