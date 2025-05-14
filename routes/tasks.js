import { Router } from 'express';
import tasks from '../data/tasks.js';
import boards from '../data/boards.js';
import {validateTaskInput, isValidObjectId} from '../validation.js';


let router = Router();

router.get('/new', async (req, res) => {
  let boardId = req.query.boardId;
  if (!boardId) {
    return res.status(400).render('error', { error: 'Missing boardId' });
  }
  res.render('task', {boardId});
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
    let task = await tasks.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (e) {
    res.status(400).render('error', { error: e });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    let task = await tasks.getTaskById(req.params.id);
    let boardId = task.boardId;
    let board = await boards.getBoardById(boardId);
    let userid = req.session.user._id;
    await tasks.updateTaskStatus(task._id, req.body.status);
    let boardTasks = await tasks.getTasksByBoardId(boardId);
    res.render('board', { board, userid : userid,tasks: boardTasks , message: 'Task status updated!'});
  } catch (e) {
    res.status(400).render('error', { error: e });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    let task = await tasks.getTaskById(req.params.id);
    let boardId = task.boardId;
    let board = await boards.getBoardById(boardId);
    await tasks.deleteTask(req.params.id);
    let boardTasks = await tasks.getTasksByBoardId(boardId);
    let userid = req.session.user._id;
    res.render('board', { board, userid : userid, tasks: boardTasks , message: 'Task deleted!' });
    let deleted = await tasks.deleteTask(req.params.id);
    res.status(200).json(deleted);
  } catch (e) {
    res.status(400).render('error', { error: e });
  }
});


export default router;
