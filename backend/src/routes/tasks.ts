import { Router, Request, Response } from 'express';
import db from '../db/database';
import { authenticate } from '../middleware/auth';
import { CreateTaskBody, UpdateTaskBody, Task } from '../types';

const router = Router();

// All task routes require a valid JWT
router.use(authenticate);

type AuthReq = Request & { userId: number };

// GET /api/tasks — fetch all tasks for the authenticated user
router.get('/', (req: Request, res: Response): void => {
  const { userId } = req as AuthReq;
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Task[];
  res.json(tasks);
});

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

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task;
  res.status(201).json(task);
});

// PUT /api/tasks/:id — update a task (only owner can update)
router.put('/:id', (req: Request, res: Response): void => {
  const { userId } = req as AuthReq;
  const taskId = Number(req.params.id);
  const updates = req.body as UpdateTaskBody;

  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(taskId, userId) as Task | undefined;
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

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

  const refreshed = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId) as Task;
  res.json(refreshed);
});

// DELETE /api/tasks/:id — delete a task (only owner can delete)
router.delete('/:id', (req: Request, res: Response): void => {
  const { userId } = req as AuthReq;
  const taskId = Number(req.params.id);

  const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(taskId, userId);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  res.status(204).send();
});

export default router;