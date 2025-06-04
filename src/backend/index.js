import express from 'express';
import cors from 'cors';

const app = express();

// (1) Required to parse JSON request bodies.
app.use(express.json());

// (2) Enable CORS so Expo can hit this API during development.
app.use(
  cors({
    // origin: ['http://localhost:3000', 'exp://127.0.0.1:3000'],
    origin: '*',
    methods: ['GET', 'POST'],
  })
);

// (3) Serve a static folder for images, CSS, JS, etc.
app.use(express.static('public'));
// For restricting access to images, specify the path of the middleware in app.use()
// See: 
// https://expressjs.com/en/5x/api.html#app.use
// https://expressjs.com/en/5x/api.html#express.static
// app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// (4) Mock‐database of users. To be implemented with MongoDB.
const users = {
  developer: {
    username: 'developer',
    name: 'Developer User',
    email: 'dev@example.com',
    avatar: 'images/generic-avatar.png',
    avatarUrl: null,
    joinDate: 'January 2025',
    stats: {
      distanceTraveled: 2300,
      co2Saved: 142,
      totalVehicles: 87,
    },
  },
  alice: {
    username: 'alice',
    name: 'alice User',
    email: 'aclie@example.com',
    avatar: '/images/generic-avatar-2.png',
    avatarUrl: null,
    joinDate: 'February 2023',
    stats: {
      distanceTraveled: 682943,
      co2Saved: 3249329,
      totalVehicles: 2,
    },
  },
};

// (5) GET /api/users/:username
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const user = users[username.toLowerCase()];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.avatarUrl) {
    const fullAvatarUrl = new URL(user.avatar, `http://192.168.1.110:${PORT}`);
    user.avatarUrl = fullAvatarUrl.href;
  }

  return res.json(user);
});

// (6) Fallback for any other route (optional)
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});


// Set PORT in this order:
// 1. Environment variable PORT (modifiable in docker compose)
// 2. Default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});

// Export the app for testing
export default app;
