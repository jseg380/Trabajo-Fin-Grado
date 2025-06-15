import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';

export const getStats = async (req, res) => {
  try {
    const userId = req.user;
    const trips = await Trip.find({ driver: userId }).populate('vehicle');
    const vehicleCount = await Vehicle.countDocuments({ owner: userId });

    if (trips.length === 0) {
      return res.json({
        totalDistance: 0,
        totalEmissions: 0,
        tripCount: 0,
        vehicleCount,
        averageEmissions: 0,
      });
    }

    const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
    const totalEmissions = trips.reduce((sum, trip) => sum + trip.calculatedEmissions, 0);
    const averageEmissions = totalEmissions / totalDistance;

    res.json({
      totalDistance,
      totalEmissions,
      tripCount: trips.length,
      vehicleCount,
      averageEmissions: isNaN(averageEmissions) ? 0 : averageEmissions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats: ' + error.message });
  }
};
