import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locations: {
    start: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude] for GeoJSON
        required: true
      }
    },
    end: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
  },
  // distance: { type: Number, required: true },
  // duration: { type: Number, required: true }, // in minutes
  // date: { type: Date, default: Date.now },
  // emissionsSaved: { type: Number, default: 0 }, // in grams of CO2
});

export default mongoose.model('Trip', TripSchema);
