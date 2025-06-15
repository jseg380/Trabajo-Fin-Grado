import User from '../models/User.js';

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    // The 'protect' middleware adds the user ID to the request object.
    const user = await User.findById(req.user);

    if (user) {
      // Construct the full avatar URL
      const PORT = process.env.PORT || 5000;
      // Note: In production, you'd use your actual domain, not req.hostname.
      const baseUrl = `${req.protocol}://${req.hostname}:${PORT}`;
      const avatarUrl = new URL(user.avatar, baseUrl).href;

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar, // The relative path
        avatarUrl: avatarUrl, // The full URL for the frontend
        stats: user.stats,
        joinDate: user.createdAt, // Send the real join date
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/profile/avatar
export const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file.' });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Path will be relative to the 'public' folder
    const avatarPath = `uploads/avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    // Construct the full URL to send back to the frontend
    const PORT = process.env.PORT || 5000;
    const baseUrl = `${req.protocol}://${req.hostname}:${PORT}`;
    const avatarUrl = new URL(user.avatar, baseUrl).href;

    res.json({
      message: 'Avatar updated successfully',
      avatar: user.avatar, // relative path
      avatarUrl: avatarUrl, // full path
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
