import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';

export const initializeDB = async (req, res) => {
  // Prevent in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden in production' });
  }

  try {
    // Create sample user
    const user = await User.create({
      name: 'Test user',
      email: 'test@example.com',
      password: 'testPassword',
      avatar: 'images/generic-avatar.png',
      stats: {
        distanceTraveled: 0,
        co2Saved: 0,
        totalVehicles: 0,
      },
    });

    // Create sample vehicles
    const vehicle1 = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      owner: user._id,
      emissions: 120,
      lastMaintenance: {
        tires: { date: new Date('2025-01-15'), distance: 15000 },
        brakes: { date: new Date('2025-01-15'), distance: 16000 },
        oilChange: { date: new Date('2024-10-20'), distance: 30000 },
        itv: new Date('2025-11-25'),
      },
    });

    const vehicle2 = await Vehicle.create({
      make: 'Volkswagen',
      model: 'Golf',
      year: 2021,
      owner: user._id,
      emissions: 130,
      lastMaintenance: {
        tires: { date: new Date('2025-01-15'), distance: 15000 },
        brakes: { date: new Date('2025-01-15'), distance: 16000 },
        oilChange: { date: new Date('2024-10-20'), distance: 30000 },
        itv: new Date('2025-11-25'),
      },
    });

    // // Update user with vehicles
    // user.vehicles = [vehicle1._id, vehicle2._id];
    await user.save();

    // Create sample trips
    await Trip.create([
      {
        vehicle: vehicle1._id,
        driver: user._id,
        locations: {
          start: {
            type: 'Point',
            coordinates: [-3.70379, 40.416775], // Madrid
          },
          end: {
            type: 'Point',
            coordinates: [-3.64311, 37.169560], // Granada
          },
        },
      },
      {
        vehicle: vehicle2._id,
        driver: user._id,
        locations: {
          start: {
            type: 'Point',
            coordinates: [-3.62448, 37.196631], // ETSIIT, Granada
          },
          end: {
            type: 'Point',
            coordinates: [-3.60732, 37.118379], // Ogijares, Granada
          },
        },
      },
    ]);

    res.status(201).json({
      message: 'Database initialized with sample data',
      userId: user._id,
    });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ error: 'Database initialization failed' });
  }
};
