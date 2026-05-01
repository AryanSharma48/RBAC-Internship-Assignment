const asyncHandler = require('express-async-handler');
const taskService = require('../services/taskService');

exports.getTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getTasks(req.query, req.user.id, req.user.role === 'admin');

  res.status(200).json({
    success: true,
    total: result.total,
    page: result.page,
    pages: result.pages,
    results: result.tasks.length,
    data: result.tasks,
  });
});

exports.getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role === 'admin');

  res.status(200).json({ success: true, data: task });
});

exports.createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask({ ...req.body, user: req.user.id });

  res.status(201).json({ success: true, data: task });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role === 'admin'
  );

  res.status(200).json({ success: true, data: task });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id, req.user.role === 'admin');

  res.status(200).json({ success: true, data: {} });
});
