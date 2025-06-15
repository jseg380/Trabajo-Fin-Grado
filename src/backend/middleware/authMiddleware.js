import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};
