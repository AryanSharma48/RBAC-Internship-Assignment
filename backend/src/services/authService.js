const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

exports.register = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    throw new ApiError('Email is already registered', 400);
  }

  const user = await User.create(userData);
  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError('Invalid email or password', 401);
  }

  return user;
};

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
