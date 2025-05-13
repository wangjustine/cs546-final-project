import { Router } from 'express';
import tasks from '../data/tasks.js';
import {validateTaskInput, isValidObjectId} from '../validation.js';


const router = Router();

router.get('/new', async (req, res) => {
  const boardId = req.query.boardId;
  if (!boardId) {
    return res.status(400).render('error', { error: 'Missing boardId' });
  }
  res.render('task', {boardId});
});

router.post('/', async (req, res) => {
  try {
    const {
      boardId,
      title,
      description,
      priority,
      status,
      deadline,
      createdBy,
      assignedTo
    } = req.body;

    validateTaskInput({title, description, priority, deadline, status, createdBy, assignedTo});

    await tasks.createTask(
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
    res.status(400).render('error', { error: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) throw 'Invalid task ID';
    const task = await tasks.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.put('/:id', async (req, res) => {
  try {
     if (!isValidObjectId(req.params.id)) throw 'Invalid task ID';
    const updated = await tasks.updateTask(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) throw 'Invalid task ID';
    const deleted = await tasks.deleteTask(req.params.id);
    res.status(200).json(deleted);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;
