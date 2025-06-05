// This mock stays here until replaced with MongoDB queries
const users = {
  developer: {
    username: 'developer',
    name: 'Developer User',
    email: 'dev@example.com',
    avatar: 'images/generic-avatar.png',
    joinDate: 'January 2025',
    stats: {
      distanceTraveled: 2300,
      co2Saved: 142,
      totalVehicles: 87,
    },
  },
  alice: {
    username: 'alice',
    name: 'Alice User',
    email: 'alice@example.com',
    avatar: 'images/generic-avatar-2.png',
    joinDate: 'February 2023',
    stats: {
      distanceTraveled: 682943,
      co2Saved: 3249329,
      totalVehicles: 2,
    },
  },
};

export const getUserByUsername = (req, res) => {
  const { username } = req.params;
  const user = users[username.toLowerCase()];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Attach full URL to avatar
  const PORT = process.env.PORT || 5000;
  const baseUrl = `http://${req.hostname}:${PORT}`;
  user.avatarUrl = `${baseUrl}/${user.avatar.replace(/^\/+/, '')}`;

  res.json(user);
};
