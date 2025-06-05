import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

// Connect DB
connectDB();

const app = express();

// Parse JSON request bodies
app.use(express.json());

// CORS configuration
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);

// Fallback
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Launch
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
