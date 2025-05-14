import { Router } from 'express';
import tasks from '../data/tasks.js';
import boards from '../data/boards.js';
import xss from 'xss';

import { validateTaskInput, isValidUUId } from '../validation.js';


let router = Router();

router.get('/new', async (req, res) => {
  let boardId = req.query.boardId;
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

    boardId = xss(boardId);
    title = xss(title);
    description = xss(description);
    priority = xss(priority);
    status = xss(status);
    deadline = xss(deadline);
    createdBy = xss(createdBy);
    assignedTo = xss(assignedTo);


    validateTaskInput({ title, description, priority, deadline, status, createdBy, assignedTo });

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
    res.status(200).json(newTask);
    //res.redirect(`/boards/${boardId}`);
  } catch (e) {
    res.status(400).json({ error: e?.toString?.() || 'Failed to create task' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let taskId = xss(req.params.id);
    if (!isValidUUId(taskId)) throw 'Invalid task ID';

    let task = await tasks.getTaskById(taskId);
    res.status(200).json(task);
  } catch (e) {
    res.status(400).json({ error: e?.toString?.() || 'Task not found' });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    let taskId = xss(req.params.id);
    let status = xss(req.body.status);

    if (!isValidUUId(taskId)) throw 'Invalid task ID';
    if (!status) throw 'Status required';

    let task = await tasks.getTaskById(taskId);
    let board = await boards.getBoardById(task.boardId);

    await tasks.updateTaskStatus(taskId, status);
    let boardTasks = await tasks.getTasksByBoardId(task.boardId);

    res.render('board', { board, userid: userid, tasks: boardTasks, message: 'Task status updated!' });
  } catch (e) {
    res.status(400).render('error', { error: e });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    let taskId = xss(req.params.id);
    if (!isValidUUId(taskId)) throw 'Invalid task ID';
    let task = await tasks.getTaskById(req.params.id);
    let boardId = task.boardId;
    let board = await boards.getBoardById(boardId);
    await tasks.deleteTask(req.params.id);
    let boardTasks = await tasks.getTasksByBoardId(boardId);
    let userid = req.session.user._id;
    res.render('board', { board, userid: userid, tasks: boardTasks, message: 'Task deleted!' });
    let deleted = await tasks.deleteTask(req.params.id);
    res.status(200).json(deleted);
  } catch (e) {
    res.status(400).json({ error: e?.toString?.() || 'Failed to delete task' });
  }
});


export default router;
