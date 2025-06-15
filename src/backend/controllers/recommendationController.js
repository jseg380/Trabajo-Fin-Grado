import Vehicle from '../models/Vehicle.js';

export const getRecommendation = async (req, res) => {
  try {
    const { distance } = req.body;
    if (!distance || isNaN(parseFloat(distance))) {
      return res.status(400).json({ error: 'Valid distance is required.' });
    }

    const vehicles = await Vehicle.find({ owner: req.user });
    if (vehicles.length === 0) {
      return res.status(404).json({ error: 'No vehicles found to recommend.' });
    }

    const recommendations = vehicles.map((v) => ({
      _id: v._id,
      make: v.make,
      model: v.model,
      year: v.year,
      emissionFactor: v.emissions,
      totalEmissions: parseFloat(distance) * v.emissions,
    }));

    // Sort by lowest emissions first
    recommendations.sort((a, b) => a.totalEmissions - b.totalEmissions);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Recommendation failed: ' + error.message });
  }
};
