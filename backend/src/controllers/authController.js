const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'form_builder_admin_token';

// Helper to generate JWT token and set in secure HttpOnly cookie
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || '666fa2a3635245d675e8130db2cf1168bb5b9da3ac26dccc879980feacb73a32b11347a99a275a5e1b4483463852802abcb469ae66d688f97ecc252b45b9dbba',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };

  res
    .status(statusCode)
    .cookie(COOKIE_NAME, token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

/**
 * @desc    Register a new admin/user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
    });

    sendTokenResponse(user, 201, res, 'Admin registered successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login admin, generate JWT and store in HttpOnly cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res, 'Admin login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in admin user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout admin and clear custom cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
exports.logout = async (req, res) => {
  res.cookie(COOKIE_NAME, 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
    data: {},
  });
};
