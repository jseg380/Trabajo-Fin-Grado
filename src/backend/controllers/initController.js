import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';

export const initializeDB = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden in production' });
  }

  try {
    console.log('[INIT] Clearing old test data...');
    // Clear old data to ensure a clean slate
    await User.deleteMany({ email: 'test@example.com' });
    // This will cascade and clear related vehicles/trips if hooks are added, but for now we do it manually.

    console.log('[INIT] Creating test user...');
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testPassword',
    });

    console.log('[INIT] Creating sample vehicles...');
    const vehicle1 = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      owner: user._id,
      emissions: 60,
      fuelType: 'hybrid',
      upcomingMaintenance: {
        tires: { date: new Date('2027-01-15'), distance: 15000 },
        brakes: { distance: 13000 },
        oilChange: { distance: 30000 },
        itv: new Date('2025-07-25'), // Upcoming
      },
    });

    const vehicle2 = await Vehicle.create({
      make: 'Volkswagen',
      model: 'Golf',
      year: 2021,
      owner: user._id,
      emissions: 130,
      fuelType: 'diesel',
      upcomingMaintenance: {
        tires: { date: new Date('2029-01-15'), distance: 19000 },
        brakes: { distance: 18000 },
        oilChange: { distance: 30000 },
        itv: new Date('2025-04-25'),  // Overdue
      },
    });

    const vehicle3 = await Vehicle.create({
      make: 'SEAT',
      model: 'Ibiza',
      year: 2018,
      owner: user._id,
      emissions: 110,
      fuelType: 'gasoline',
      upcomingMaintenance: {
        tires: { date: new Date('2029-01-15'), distance: 19000 },
        brakes: { distance: 18000 },
        oilChange: { distance: 30000 },
        itv: new Date('2026-02-25'),  // Too far in the future
      },
    });
    
    const vehicles = [vehicle1, vehicle2, vehicle3];
    
    console.log('[INIT] Seeding trips...');
    await Trip.deleteMany({ driver: user._id });

    const tripsData = [
      { vehicleId: vehicles[0]._id, distance: 15, date: new Date('2025-06-10') },
      { vehicleId: vehicles[0]._id, distance: 50, date: new Date('2025-06-11') },
      { vehicleId: vehicles[1]._id, distance: 120, date: new Date('2025-06-10') },
      { vehicleId: vehicles[1]._id, distance: 25, date: new Date('2025-06-13') },
    ];

    const finalTrips = tripsData.map(trip => {
      const vehicleData = vehicles.find(v => v._id.equals(trip.vehicleId));
      return {
        driver: user._id,
        vehicle: trip.vehicleId,
        distance: trip.distance,
        date: trip.date,
        calculatedEmissions: trip.distance * (vehicleData.emissions || 150),
        locations: { // Keep the GeoJSON structure for future use
          start: { type: 'Point', coordinates: [0,0] },
          end: { type: 'Point', coordinates: [0,0] },
        },
      };
    });

    await Trip.insertMany(finalTrips);
    console.log('[INIT] Database initialization successful.');
    res.status(201).json({ message: 'Database initialized successfully' });

  } catch (error) {
    console.error('[INIT] Initialization error:', error);
    res.status(500).json({ error: 'Database initialization failed' });
  }
};
