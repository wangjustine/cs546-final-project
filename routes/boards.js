import { Router } from 'express';
import boards from '../data/boards.js';
import tasks from '../data/tasks.js'; 
import users from '../data/users.js'; 

const router = Router();
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    const userBoards = await boards.getBoardsByUserId(req.session.user._id);
    res.render('boardlist', { boards: userBoards });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});
// Create board (admin only)
router.post('/create', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin') {
      return res.status(403).send("Only admin users can create boards");
    }

    const { title, description } = req.body;
    const board = await boards.createBoard(title, description, req.session.user._id);

    await boards.addMemberToBoard(board.boardId, req.session.user._id, 'admin');

    res.redirect(`/boards/${board.boardId}`);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// Add member (admin only)
router.post('/:id/add-member', async (req, res) => {
  try {
    const board = await boards.getBoardById(req.params.id);
    if (!boards.isAdmin(board, req.session.user._id)) {
      return res.status(403).send("Only admins can add members");
    }

    const { userId, role } = req.body;
    await boards.addMemberToBoard(req.params.id, userId, role);
    res.redirect(`/boards/${req.params.id}`);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// View board with tasks
router.get('/:id', async (req, res) => {
  try {
    const board = await boards.getBoardById(req.params.id);
    if (!req.session.user || !boards.isMember(board, req.session.user._id)) {
      return res.status(403).send("Access denied");
    }

    const boardTasks = await tasks.getTasksByBoardId(board.boardId); // assumed function
    res.render('board', { board, tasks: boardTasks });
  } catch (e) {
    res.status(404).render('error', { error: e });
  }
});

export default router;
