import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Never return password in queries
    },
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Household',
    },
    avatar: {
      type: String,
      default: 'images/generic-avatar.png',
    },
    stats: {
      distanceTraveled: { type: Number, default: 0 },
      co2Saved: { type: Number, default: 0 },
      totalVehicles: { type: Number, default: 0 },
    },
    // A simple array to store unique achievement keys
    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password verification method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
