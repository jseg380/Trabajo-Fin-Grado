import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';

export const initializeDB = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden in production' });
  }

  try {
    console.log('[INIT] Clearing old test data...');
    await User.deleteMany({ email: 'test@example.com' });
    // Note: In a real app with cascading deletes, this would be enough.
    // For now, we manually clear trips later.

    console.log('[INIT] Creating test user...');
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testPassword',
      achievements: ['FIRST_VEHICLE', 'FIRST_TRIP'],
    });
    
    // --- DYNAMIC DATE & DISTANCE SETUP ---
    const today = new Date();

    // Helper to create dates relative to today
    const daysFromNow = (days) => {
      const date = new Date();
      date.setDate(today.getDate() + days);
      return date;
    };
    
    console.log('[INIT] Creating dynamically seeded vehicles...');

    const vehicleData = [
      // 1. The "Problem Child" - Multiple alerts, including an overdue distance
      {
        make: 'Ford',
        model: 'Focus',
        year: 2017,
        owner: user._id,
        emissions: 125,
        fuelType: 'gasoline',
        upcomingMaintenance: {
          tires: { date: daysFromNow(-20), distance: 2500 },  // STATUS: Overdue by date, Upcoming by km
          brakes: { distance: -150 },                         // STATUS: Overdue by km
          oilChange: { distance: 1000 },                      // STATUS: Upcoming by km
          itv: daysFromNow(30),                               // STATUS: Upcoming by date
        },
      },
      // 2. The "Well Maintained" Car - No alerts should be triggered
      {
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        owner: user._id,
        emissions: 90,
        fuelType: 'hybrid',
        upcomingMaintenance: {
          tires: { date: daysFromNow(300), distance: 30000 },
          brakes: { distance: 40000 },
          oilChange: { distance: 15000 },
          itv: daysFromNow(700),
        },
      },
      // 3. The "ITV Overdue" Car
      {
        make: 'Volkswagen',
        model: 'Golf',
        year: 2019,
        owner: user._id,
        emissions: 130,
        fuelType: 'diesel',
        upcomingMaintenance: {
          tires: { date: daysFromNow(180), distance: 25000 },
          brakes: { distance: 22000 },
          oilChange: { distance: 8000 },
          itv: daysFromNow(-100), // STATUS: Overdue by 100 days
        },
      },
       // 4. The "Tires Upcoming" Car
       {
        make: 'Toyota',
        model: 'RAV4',
        year: 2021,
        owner: user._id,
        emissions: 105,
        fuelType: 'hybrid',
        upcomingMaintenance: {
          tires: { date: daysFromNow(45), distance: 40000 }, // STATUS: Upcoming by date
          brakes: { distance: 15000 },
          oilChange: { distance: 12000 },
          itv: daysFromNow(400),
        },
      },
    ];

    const vehicles = await Vehicle.create(vehicleData);

    console.log('[INIT] Seeding trips for created vehicles...');
    await Trip.deleteMany({ driver: user._id });

    const tripsData = [
      { vehicleIndex: 0, distance: 150 }, // Ford Focus
      { vehicleIndex: 1, distance: 25 },  // Honda Civic
      { vehicleIndex: 2, distance: 88 },  // VW Golf
      { vehicleIndex: 0, distance: 30 },  // Ford Focus
      { vehicleIndex: 3, distance: 120 }, // Toyota RAV4
    ];

    const finalTrips = tripsData.map(trip => {
      const vehicle = vehicles[trip.vehicleIndex];
      return {
        driver: user._id,
        vehicle: vehicle._id,
        distance: trip.distance,
        date: new Date(),
        calculatedEmissions: trip.distance * (vehicle.emissions || 150),
        locations: { start: { type: 'Point', coordinates: [0,0] }, end: { type: 'Point', coordinates: [0,0] } },
      };
    });

    await Trip.insertMany(finalTrips);
    console.log('[INIT] Database initialization successful.');
    res.status(201).json({ message: 'Database initialized with dynamically-set maintenance dates.' });

  } catch (error) {
    console.error('[INIT] Initialization error:', error);
    res.status(500).json({ error: 'Database initialization failed' });
  }
};
