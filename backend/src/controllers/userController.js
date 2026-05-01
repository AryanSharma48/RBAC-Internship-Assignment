const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    total: users.length,
    data: users,
  });
});
