import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  tires: { date: Date, distance: Number },
  brakes: { date: Date, distance: Number },
  oilChange: { date: Date, distance: Number },
  itv: { date: Date },
});

const VehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emissions: Number,
  lastMaintenance: maintenanceSchema,
});

export default mongoose.model('Vehicle', VehicleSchema);
