import mongoose from 'mongoose';

const databaseName = 'aldiacardb';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/${databaseName}`);
    console.log(`✅ MongoDB connected to ${databaseName} database`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
