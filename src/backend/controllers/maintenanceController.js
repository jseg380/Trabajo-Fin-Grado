import Vehicle from '../models/Vehicle.js';

// Define all checks in one place. To add a new check, add an object here.
const MAINTENANCE_CHECKS = [
  // Date-based checks
  {
    key: 'itv',
    taskType: 'itv',
    unit: 'days',
    threshold: 90, // Alert if within 90 days
    // This function safely gets the value from the schema, handling nested paths
    getValue: (maintenance) => maintenance?.itv, 
  },
  {
    key: 'tires_date', // A unique key for this specific check
    taskType: 'tires',
    unit: 'days',
    threshold: 60, // Alert if within 60 days
    getValue: (maintenance) => maintenance?.tires?.date,
  },
  // Distance-based checks
  {
    key: 'tires_dist',
    taskType: 'tires',
    unit: 'km',
    threshold: 5000, // Alert if less than 5000km remaining
    getValue: (maintenance) => maintenance?.tires?.distance,
  },
  {
    key: 'brakes',
    taskType: 'brakes',
    unit: 'km',
    threshold: 2000,
    getValue: (maintenance) => maintenance?.brakes?.distance,
  },
  {
    key: 'oilChange',
    taskType: 'oilchange',
    unit: 'km',
    threshold: 1500,
    getValue: (maintenance) => maintenance?.oilChange?.distance,
  },
];

export const getMaintenanceSummary = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user });
    const tasks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize date for accurate day comparisons

    for (const vehicle of vehicles) {
      if (!vehicle.upcomingMaintenance) continue;
      
      const vehicleName = `${vehicle.make} ${vehicle.model}`;

      // Loop through our configuration
      for (const check of MAINTENANCE_CHECKS) {
        const value = check.getValue(vehicle.upcomingMaintenance);
        if (value === null || value === undefined) continue;

        let isTriggered = false;
        let remainingValue = 0;
        let isOverdue = false;

        if (check.unit === 'days') {
          const checkDate = new Date(value);
          checkDate.setHours(0, 0, 0, 0); // Normalize
          remainingValue = Math.floor((checkDate - today) / (1000 * 60 * 60 * 24));
          isOverdue = remainingValue < 0;
          if (remainingValue <= check.threshold) {
            isTriggered = true;
          }
        } else if (check.unit === 'km') {
          remainingValue = value;
          isOverdue = remainingValue < 0;
          if (remainingValue <= check.threshold) {
            isTriggered = true;
          }
        }
        
        if (isTriggered) {
          tasks.push({
            id: `${vehicle._id}-${check.key}`, // A stable ID for the key prop
            vehicle: vehicleName,
            taskType: check.taskType,
            isOverdue,
            unit: check.unit,
            value: Math.abs(remainingValue), // Send a positive number for easier frontend logic
          });
        }
      }
    }

    // Sort tasks: Overdue first, then by urgency
    tasks.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.value - b.value;
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get maintenance summary: ' + error.message });
  }
};
