import { Router } from 'express';
import * as TaskController from './task.controller.js';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { cache } from '../../middlewares/cache.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { taskSchema, updateTaskSchema } from './task.schema.js';

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', protect, cache('all_tasks', 60), TaskController.getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new task (Admin only)
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/', protect, authorize('admin'), validate(taskSchema), TaskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a task (Admin only)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put('/:id', protect, authorize('admin'), validate(updateTaskSchema), TaskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a task (Admin only)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete('/:id', protect, authorize('admin'), TaskController.deleteTask);

export default router;
