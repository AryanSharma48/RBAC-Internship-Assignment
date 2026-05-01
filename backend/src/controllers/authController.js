const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');

const sendTokenResponse = (user, statusCode, res) => {
  const token = authService.generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await authService.register({ name, email, password, role });
  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
