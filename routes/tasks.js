import { Router } from 'express';
import tasks from '../data/tasks.js';
import {validateTaskInput} from '../validation.js';
import boards from '../data/boards.js';

const router = Router();

router.get('/new', async (req, res) => {
  const boardId = req.query.boardId;
  if (!boardId) {
    return res.status(400).render('error', { error: 'Missing boardId' });
  }
  res.render('task', { boardId });
});

router.post('/', async (req, res) => {
  try {
    let {
      boardId,
      title,
      description,
      priority,
      status,
      deadline,
      createdBy,
      assignedTo
    } = req.body;

    //validateTaskInput({title, description, priority, deadline, status, createdBy, assignedTo});

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
    const task = await tasks.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (e) {
    res.status(400).render('error', { error: e });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    const task = await tasks.getTaskById(req.params.id);
    const boardId = task.boardId;
    const board = await boards.getBoardById(boardId);
    await tasks.updateTaskStatus(task._id, req.body.status);
    const boardTasks = await tasks.getTasksByBoardId(boardId);
    res.render('board', { board, tasks: boardTasks , message: 'Task status updated!'});
  } catch (e) {
    res.status(400).render('error', { error: e });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    const task = await tasks.getTaskById(req.params.id);
    const boardId = task.boardId;
    const board = await boards.getBoardById(boardId);
    await tasks.deleteTask(req.params.id);
    const boardTasks = await tasks.getTasksByBoardId(boardId);
    res.render('board', { board, tasks: boardTasks , message: 'Task deleted!' });
  } catch (e) {
    res.status(400).render('error', { error: e });
  }
});


export default router;
