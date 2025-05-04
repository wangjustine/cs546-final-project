import { Router } from 'express';
import * as tasks from '../data/tasks.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const task = await tasks.createTask(req.body);
    res.status(200).json(task);
  } catch (e) {
    res.status(400).json({ error: e });
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
