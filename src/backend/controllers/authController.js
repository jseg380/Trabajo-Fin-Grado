import User from '../models/User.js';
import Household from '../models/Household.js';
import jwt from 'jsonwebtoken';

// --- DEFINE COOKIE OPTIONS IN ONE PLACE ---
const cookieOptions = {
  httpOnly: true,
  // sameSite must be 'none' for production to allow cross-site cookies
  // 'lax' is better for development with local servers
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  // secure must be true in production to send cookies only over HTTPS
  secure: process.env.NODE_ENV === 'production',
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const household = await Household.create({
      name: `${name}'s Household`,
      owner: user._id,
      members: [user._id],
    });

    user.household = household._id;
    await user.save();

    const token = generateToken(user._id);

    // Set the cookie using the new options
    res.cookie('jwt', token, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar, // Send avatar on register too
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Set the cookie using the new options
    res.cookie('jwt', token, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  // Clear the cookie using the same options
  res.cookie('jwt', '', {
    ...cookieOptions,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
