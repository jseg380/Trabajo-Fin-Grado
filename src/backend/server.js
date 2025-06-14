import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect DB
connectDB();

const app = express();

// CORS configuration
// 1. Exact origins of the frontend that are allowed to connect.
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.110:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // 2. Enable credentials (cookies) to be sent and received.
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Parse JSON request bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import initRoutes from './routes/initRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', initRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Fallback route for undefined API endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Set JWT secret
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable not set!');
  process.exit(1);
}

// Launch
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
