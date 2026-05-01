const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (userData) => {
  const user = await User.create(userData);
  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return null;
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return null;
  }

  return user;
};

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
