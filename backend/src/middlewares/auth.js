const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'form_builder_admin_token';

const protect = async (req, res, next) => {
  let token;

  // 1. Check custom named HttpOnly Cookie first (or fallback to generic token)
  if (req.cookies && (req.cookies[COOKIE_NAME] || req.cookies.token)) {
    token = req.cookies[COOKIE_NAME] || req.cookies.token;
  }
  // 2. Fallback to Authorization Bearer header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Admin authentication required.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '666fa2a3635245d675e8130db2cf1168bb5b9da3ac26dccc879980feacb73a32b11347a99a275a5e1b4483463852802abcb469ae66d688f97ecc252b45b9dbba'
    );
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      req.user = { _id: decoded.id, role: decoded.role || 'admin', email: decoded.email || 'admin@dynamicforms.com' };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'anonymous'}' is not authorized.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
