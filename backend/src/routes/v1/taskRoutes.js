const express = require('express');
const Joi = require('joi');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../../controllers/taskController');
const { protect } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validateMiddleware');

const router = express.Router();

const taskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().min(1).required(),
  status: Joi.string().valid('pending', 'completed').default('pending'),
});

const updateSchema = taskSchema.fork(['title', 'description'], f => f.optional());

router.use(protect);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (admin sees all, user sees own)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, completed] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated task list
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Task created
 */
router.route('/').get(getTasks).post(validate(taskSchema), createTask);

router.route('/:id').get(getTask).put(validate(updateSchema), updateTask).delete(deleteTask);

module.exports = router;
