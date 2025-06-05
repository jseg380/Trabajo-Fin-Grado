import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  email: String,
  avatar: String,
  joinDate: String,
  stats: {
    distanceTraveled: Number,
    co2Saved: Number,
    totalVehicles: Number,
  },
});

export default mongoose.model('User', UserSchema);
