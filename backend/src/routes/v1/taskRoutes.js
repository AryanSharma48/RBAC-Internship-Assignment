/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: {type: string, enum: [pending, completed]}
 *       - in: query
 *         name: page
 *         schema: {type: integer}
 *       - in: query
 *         name: limit
 *         schema: {type: integer}
 *     responses:
 *       200:
 *         description: List of tasks
 */
const express = require('express');
const Joi = require('joi');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

const taskSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  status: Joi.string().valid('pending', 'completed'),
});

router.use(protect); // All task routes are protected

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: {type: string}
 *               description: {type: string}
 *     responses:
 *       201:
 *         description: Task created
 */
router
  .route('/')
  .get(getTasks)
  .post(validate(taskSchema), createTask);

router
  .route('/:id')
  .get(getTask)
  .put(validate(taskSchema), updateTask)
  .delete(deleteTask);

module.exports = router;
