import { Router } from 'express';
import { isAuthenticated } from '../middleware.js';

import tasks from '../data/tasks.js';

const router = Router();

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { boardId, title, description, priority, deadline } = req.body;
    const status = 'open';
    const createdBy = req.session.user._id;
    const assignedTo = null;

    console.log('[DEBUG] POST /tasks body:', req.body);

    const newTask = await tasks.createTask(
      boardId,
      title,
      description,
      priority,
      status,
      deadline,
      createdBy,
      assignedTo
    );

    res.redirect(`/boards/${boardId}`);
  } catch (e) {
    console.error('[ERROR] Failed to create task:', e);
    res.status(400).json({ error: e?.toString?.() || 'Unknown error' });
  }
});

router.get('/new', isAuthenticated, async (req, res) => {
  try {
    const boardId = req.query.boardId;
    if (!boardId) {
      return res.status(400).render('error', { error: 'Board ID is required to create a task.' });
    }

    res.render('task', { boardId });
  } catch (e) {
    res.status(500).render('error', { error: 'Failed to load task creation page.' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const task = await tasks.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await tasks.updateTask(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await tasks.deleteTask(req.params.id);
    res.status(200).json(deleted);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});



export default router;
