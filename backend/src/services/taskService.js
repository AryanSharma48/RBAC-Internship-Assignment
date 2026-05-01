const Task = require('../models/Task');

exports.createTask = async (taskData) => {
  return await Task.create(taskData);
};

exports.getTasks = async (query, userId, isAdmin) => {
  let filter = {};
  
  // If not admin, only show own tasks
  if (!isAdmin) {
    filter.user = userId;
  }

  // Filtering by status if provided
  if (query.status) {
    filter.status = query.status;
  }

  // Pagination
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .populate('user', 'name email')
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Task.countDocuments(filter);

  return {
    tasks,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

exports.getTaskById = async (id, userId, isAdmin) => {
  const task = await Task.findById(id).populate('user', 'name email');

  if (!task) return null;

  // Check ownership
  if (!isAdmin && task.user._id.toString() !== userId.toString()) {
    return 'unauthorized';
  }

  return task;
};

exports.updateTask = async (id, taskData, userId, isAdmin) => {
  let task = await Task.findById(id);

  if (!task) return null;

  // Check ownership
  if (!isAdmin && task.user.toString() !== userId.toString()) {
    return 'unauthorized';
  }

  task = await Task.findByIdAndUpdate(id, taskData, {
    new: true,
    runValidators: true,
  });

  return task;
};

exports.deleteTask = async (id, userId, isAdmin) => {
  const task = await Task.findById(id);

  if (!task) return null;

  // Check ownership
  if (!isAdmin && task.user.toString() !== userId.toString()) {
    return 'unauthorized';
  }

  await task.deleteOne();
  return true;
};
