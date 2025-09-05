import Vehicle from '../models/Vehicle.js';

// --- Hardcoded Granada ZBE (simple rectangle) ---
const ZBE_GRANADA = {
  minLat: 37.170,
  maxLat: 37.185,
  minLng: -3.610,
  maxLng: -3.590,
};
const ZBE_ALLOWED_FUEL_TYPES = ['electric', 'hybrid'];

const isPointInZBE = (lat, lng) => {
  return lat >= ZBE_GRANADA.minLat && lat <= ZBE_GRANADA.maxLat &&
         lng >= ZBE_GRANADA.minLng && lng <= ZBE_GRANADA.maxLng;
};

export const getRecommendation = async (req, res) => {
  try {
    const { distance, origin, destination } = req.body;
    if (!distance || !origin || !destination) {
      return res.status(400).json({ error: 'Distance, origin, and destination are required.' });
    }

    const tripIsInZBE = isPointInZBE(origin.lat, origin.lng) || isPointInZBE(destination.lat, destination.lng);

    const query = { owner: req.user };
    if (tripIsInZBE) {
      query.fuelType = { $in: ZBE_ALLOWED_FUEL_TYPES };
    }

    const vehicles = await Vehicle.find(query);
    if (vehicles.length === 0) {
      return res.status(404).json({ error: tripIsInZBE ? 'No ZBE-compliant vehicles found.' : 'No vehicles found.' });
    }

    const recommendations = vehicles.map((v) => ({
      _id: v._id,
      make: v.make,
      model: v.model,
      year: v.year,
      fuelType: v.fuelType, // Include fuelType in response
      emissionFactor: v.emissions,
      totalEmissions: parseFloat(distance) * v.emissions,
    }));

    recommendations.sort((a, b) => a.totalEmissions - b.totalEmissions);

    res.json({ recommendations, tripIsInZBE });
  } catch (error) {
    res.status(500).json({ error: 'Recommendation failed: ' + error.message });
  }
};
