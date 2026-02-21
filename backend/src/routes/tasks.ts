import { Router, Request, Response } from 'express';
import db from '../db/database';
import { authenticate } from '../middleware/auth';
import { CreateTaskBody, UpdateTaskBody, Task } from '../types';

const router = Router();

// All task routes require a valid JWT
router.use(authenticate);

// Extend Request type to include userId injected by auth middleware
type AuthReq = Request & { userId: number };

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
// GET /api/tasks — fetch all tasks for the authenticated user
router.get('/', (req: Request, res: Response): void => {
  const { userId } = req as AuthReq;
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Task[];
  res.json(tasks);
});

/**
 * @swagger
 * /api/tasks:
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               due_date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       401:
 *         description: Unauthorized
 */

// POST /api/tasks — create a new task
router.post('/', (req: Request, res: Response): void => {
  const { userId } = req as AuthReq;
  const { title, description = '', status = 'todo', priority = 'medium', due_date = null } = req.body as CreateTaskBody;

  if (!title || title.trim() === '') {
    res.status(400).json({ message: 'Title is required' });
    return;
  }

  const result = db
    .prepare(
      'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(userId, title.trim(), description, status, priority, due_date);

  // Return the newly created task with all fields  
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task;
  res.status(201).json(task);
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */

// PUT /api/tasks/:id — update a task (only owner can update)
router.put('/:id', (req: Request, res: Response): void => {
  const { userId } = req as AuthReq;
  const taskId = Number(req.params.id);
  const updates = req.body as UpdateTaskBody;

  // Verify task exists and belongs to the authenticated user
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, userId) as Task | undefined;
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  // Merge existing values with updates — only provided fields are changed
  const updated = {
    title: updates.title ?? task.title,
    description: updates.description ?? task.description,
    status: updates.status ?? task.status,
    priority: updates.priority ?? task.priority,
    due_date: updates.due_date !== undefined ? updates.due_date : task.due_date,
  };

  db.prepare(
    `UPDATE tasks SET title=?, description=?, status=?, priority=?, due_date=?, updated_at=datetime('now') WHERE id=?`
  ).run(updated.title, updated.description, updated.status, updated.priority, updated.due_date, taskId);

  // Return updated task with refreshed data
  const refreshed = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId) as Task;
  res.json(refreshed);
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */

// DELETE /api/tasks/:id — delete a task (only owner can delete)
router.delete('/:id', (req: Request, res: Response): void => {
  const { userId } = req as AuthReq;
  const taskId = Number(req.params.id);

  // Verify ownership before deleting
  const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(taskId, userId);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  res.status(204).send();
});

export default router;