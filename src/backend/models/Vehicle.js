import mongoose from 'mongoose';

// Default generic maintenance intervals
const maintenanceSchema = new mongoose.Schema({
  tires: {
    date: {
      type: Date,
      default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // One year from now
    },
    distance: {
      type: Number,
      default: 40000,
    },
  },
  brakes: {
    distance: {
      type: Number,
      default: 50000,
    },
  },
  oilChange: {
    distance: {
      type: Number,
      default: 30000, // Default to 30,000 km for synthetic oil (moden cars)
    },
  },
  itv: {
    type: Date,
    default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 2)), // Two years from now
  },
});

const VehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  fuelType: { type: String, required: true, enum: ['gasoline', 'diesel', 'electric', 'hybrid'] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    state: {
      type: String,
      enum: ['at_home', 'in_use', 'reserved'],
      default: 'at_home',
    },
    checkedOutBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reservedFrom: {
      type: Date,
      default: null,
    },
    reservedUntil: {
      type: Date,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  emissions: Number,
  upcomingMaintenance: maintenanceSchema,
});

export default mongoose.model('Vehicle', VehicleSchema);
