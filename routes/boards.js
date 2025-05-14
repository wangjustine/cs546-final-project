import { Router } from 'express';
import boards from '../data/boards.js';
import tasks from '../data/tasks.js';
import users from '../data/users.js';
import { getAllUsers, updateUserRole, deleteUser } from '../data/users.js';
import { isValidUUId, isNonEmptyString } from '../validation.js';
import xss from 'xss';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    const userBoards = await boards.getBoardsByUserId(req.session.user._id);
    res.render('boardlist', { boards: userBoards });
  } catch (e) {
    res.status(400).json({error: e});
  }
});

// Create board (admin only)
router.post('/create', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin') {
      return res.status(403).send('Only admin users can create boards');
    }

    const title = xss(req.body.title);
    const description = xss(req.body.description);

    if (!isNonEmptyString(title)) throw 'Invalid title';
    if (!isNonEmptyString(description)) throw 'Invalid description';

    const board = await boards.createBoard(title, description, req.session.user._id);
    await boards.addMemberToBoard(board.boardId, req.session.user._id, 'admin');

    res.redirect(`/boards/${board.boardId}`);
  } catch (e) {
    res.status(400).json({error: e});
  }
});

// Add member (admin only)
router.post('/:id/add-member', async (req, res) => {
  try {
    const boardId = xss(req.params.id);
    const userId = xss(req.body.userId);

    if (!isValidUUId(boardId) || !isValidUUId(userId)) throw 'Invalid IDs';
    const board = await boards.getBoardByIdWithComments(boardId);

    if (!boards.isAdmin(board, req.session.user._id)) {
      return res.status(403).send('Only admins can add members');
    }

    await boards.addMemberToBoard(boardId, userId, 'viewer');
    res.redirect(`/boards/${boardId}`);
  } catch (e) {
    res.status(400).json({error: e});
  }
});

// Render board creation form
router.get('/new', async (req, res) => {
  if (!req.session.user || req.session.user.category !== 'admin') {
    return res.status(403).render('error', { error: 'Only admins can access this page.' });
  }

  res.render('createBoard', { title: 'Create New Board' });
});

// View board by ID (with comments)
router.get('/:id', async (req, res) => {
  try {
    const boardId = xss(req.params.id);
    if (!isValidUUId(boardId)) throw 'Invalid board ID';

    const board = await boards.getBoardByIdWithComments(boardId);

    if (!req.session.user || !boards.isMember(board, req.session.user._id)) {
      return res.status(403).send('Access denied');
    }

    const boardTasks = await tasks.getTasksByBoardId(board.boardId);
    res.render('board', {
      board,
      userid: req.session.user._id,
      tasks: boardTasks
    });
  } catch (e) {
    res.status(404).render('error', { error: e });
  }
});

// Admin - View users
router.get('/admin/users', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin')
      return res.status(403).send('Only admins can access this');

    const allUsers = await getAllUsers();
    res.render('adminUsers', { users: allUsers });
  } catch (e) {
    console.error(e);
    res.status(400).render('error', { error: e });
  }
});

// Admin - Update user role
router.post('/admin/users/:userId/role', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin')
      return res.status(403).send('Only admins can access this');

    const userId = xss(req.params.userId);
    const category = xss(req.body.category);

    if (!isValidUUId(userId)) throw 'Invalid userId';
    if (!isNonEmptyString(category)) throw 'Invalid category';

    await updateUserRole(userId, category);
    res.redirect('/admin/users');
  } catch (e) {
    console.error(e);
    res.status(400).render('error', { error: e });
  }
});

// Admin - Remove user
router.post('/admin/users/:userId/remove', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin')
      return res.status(403).send('Only admins can access this');

    const userId = xss(req.params.userId);
    if (!isValidUUId(userId)) throw 'Invalid userId';

    await deleteUser(userId);
    res.redirect('/admin/users');
  } catch (e) {
    console.error(e);
    res.status(400).render('error', { error: e });
  }
});

// Admin - Add user to board
router.post('/admin/users/:userId/add-to-board', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin')
      return res.status(403).send('Only admins can access this');

    const userId = xss(req.params.userId);
    const boardId = xss(req.body.boardId);
    const role = xss(req.body.role);

    if (!isValidUUId(userId)) throw 'Invalid userId';
    if (!isValidUUId(boardId)) throw 'Invalid boardId';
    if (!isNonEmptyString(role)) throw 'Invalid role';

    await boards.addMemberToBoard(boardId, userId, role);
    res.redirect('/admin/users');
  } catch (e) {
    console.error(e);
    res.status(400).render('error', { error: e });
  }
});

// POST a new comment to a board
router.post('/:boardId/comments', async (req, res) => {
  try {
    const boardId = xss(req.params.boardId);
    const userId = xss(req.body.userId);
    const commentText = xss(req.body.commentText);

    const boardCollection = await boards();
    const newComment = {
      _id: uuid(),
      userId,
      commentText,
      createdAt: new Date()
    };

    const updateInfo = await boardCollection.updateOne(
      { boardId },
      { $push: { comments: newComment } }
    );

    if (!updateInfo.modifiedCount) throw 'Couldn’t add comment to board';

    res.redirect(`/boards/${boardId}`);
  } catch (e) {
    console.error(e);
    res.status(400).render('error', { error: e });
  }
});

export default router;
