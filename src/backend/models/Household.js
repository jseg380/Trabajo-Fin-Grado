import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

// Using a dictionary-based alphabet for more memorable codes
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoid = customAlphabet(alphabet, 8); // Generates an 8-character code like 'A3B5D9F1'

const HouseholdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true });

export default mongoose.model('Household', HouseholdSchema);
