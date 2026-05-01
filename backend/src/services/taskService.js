const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

exports.createTask = async (taskData) => {
  return await Task.create(taskData);
};

exports.getTasks = async (query, userId, isAdmin) => {
  const filter = {};

  if (!isAdmin) filter.user = userId;
  if (query.status) filter.status = query.status;

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter).populate('user', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

exports.getTaskById = async (id, userId, isAdmin) => {
  const task = await Task.findById(id).populate('user', 'name email');

  if (!task) throw new ApiError('Task not found', 404);

  if (!isAdmin && task.user._id.toString() !== userId.toString()) {
    throw new ApiError('You do not have permission to access this task', 403);
  }

  return task;
};

exports.updateTask = async (id, taskData, userId, isAdmin) => {
  const task = await Task.findById(id);

  if (!task) throw new ApiError('Task not found', 404);

  if (!isAdmin && task.user.toString() !== userId.toString()) {
    throw new ApiError('You do not have permission to update this task', 403);
  }

  return await Task.findByIdAndUpdate(id, taskData, { new: true, runValidators: true });
};

exports.deleteTask = async (id, userId, isAdmin) => {
  const task = await Task.findById(id);

  if (!task) throw new ApiError('Task not found', 404);

  if (!isAdmin && task.user.toString() !== userId.toString()) {
    throw new ApiError('You do not have permission to delete this task', 403);
  }

  await task.deleteOne();
};
