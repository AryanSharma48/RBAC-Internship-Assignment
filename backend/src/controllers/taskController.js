const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/ErrorResponse');
const taskService = require('../services/taskService');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  const result = await taskService.getTasks(
    req.query,
    req.user.id,
    req.user.role === 'admin'
  );

  res.status(200).json({
    success: true,
    count: result.tasks.length,
    pagination: result.pagination,
    data: result.tasks,
  });
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await taskService.getTaskById(
    req.params.id,
    req.user.id,
    req.user.role === 'admin'
  );

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  if (task === 'unauthorized') {
    return next(new ErrorResponse('Not authorized to access this task', 403));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const task = await taskService.createTask(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role === 'admin'
  );

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  if (task === 'unauthorized') {
    return next(new ErrorResponse('Not authorized to update this task', 403));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const result = await taskService.deleteTask(
    req.params.id,
    req.user.id,
    req.user.role === 'admin'
  );

  if (!result) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  if (result === 'unauthorized') {
    return next(new ErrorResponse('Not authorized to delete this task', 403));
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
