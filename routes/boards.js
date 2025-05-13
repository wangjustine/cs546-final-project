import {Router} from 'express';
import boards from '../data/boards.js';
import tasks from '../data/tasks.js'; 
import users from '../data/users.js'; 
import {getAllUsers, updateUserRole, deleteUser} from '../data/users.js';



const router = Router();
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    const userBoards = await boards.getBoardsByUserId(req.session.user._id);
    res.render('boardlist', {boards: userBoards});
  } catch (e) {
    res.status(400).json({error: e});
  }
});
// Create board (admin only)
router.post('/create', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin') {
      return res.status(403).send("Only admin users can create boards");
    }

    const {title, description} = req.body;
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
    const board = await boards.getBoardById(req.params.id);
    if (!boards.isAdmin(board, req.session.user._id)) {
      return res.status(403).send("Only admins can add members");
    }

    const {userId} = req.body;
    if (!isValidObjectId(userId)) throw 'Invalid userId';
    await boards.addMemberToBoard(req.params.id, userId, 'viewer');

    res.redirect(`/boards/${req.params.id}`);
  } catch (e) {
    res.status(400).json({error: e});
  }
});


// Render the create board form (admin only)
router.get('/new', async (req, res) => {
  if (!req.session.user || req.session.user.category !== 'admin') {
    return res.status(403).render('error', {error: 'Only admins can access this page.'});
  }

  res.render('createBoard', {title: 'Create New Board'});
});


// View board by ID
router.get('/:id', async (req, res) => {
  try {
    const board = await boards.getBoardById(req.params.id);
    if (!req.session.user || !boards.isMember(board, req.session.user._id)) {
      return res.status(403).send("Access denied");
    }

    const boardTasks = await tasks.getTasksByBoardId(board.boardId); // assumed function
    res.render('board', {board, tasks: boardTasks});
  } catch (e) {
    res.status(404).render('error', {error: e});
  }
});




//admin functions
router.get('/admin/users', async (req, res) => {
  try {
    if (!req.session.user) 
      return res.status(403).send("Only admins can add users to boards");
    if (req.session.user.category !== 'admin') 
      return res.status(403).send("Only admins can add users to boards");
    const allUsers = await getAllUsers();
    res.render('adminUsers', {users: allUsers});
  } catch (e) {
    console.error(e);
    res.status(400).render('error', {error: e});
  }
});

router.post('/admin/users/:userId/role', async (req, res) => {
  try {
    if (!req.session.user) 
      return res.status(403).send("Only admins can add users to boards");
    if (req.session.user.category !== 'admin') 
      return res.status(403).send("Only admins can add users to boards");
    const {category} = req.body;
    await updateUserRole(req.params.userId, category);
    res.redirect('/admin/users');
  } catch (e) {
    console.error(e);
    res.status(400).render('error', {error: e});
  }
});

router.post('/admin/users/:userId/remove', async (req, res) => {
  try {
    if (!req.session.user) 
      return res.status(403).send("Only admins can add users to boards");
    if (req.session.user.category !== 'admin') 
      return res.status(403).send("Only admins can add users to boards");
    await deleteUser(req.params.userId);
    res.redirect('/admin/users');
  } catch (e) {
    console.error(e);
    res.status(400).render('error', {error: e});
  }
});

router.post('/admin/users/:userId/add-to-board', async (req, res) => {
  try {
    if (!req.session.user) 
      return res.status(403).send("Only admins can add users to boards");
    if (req.session.user.category !== 'admin') 
      return res.status(403).send("Only admins can add users to boards");
    const {boardId, role} = req.body;
    const userId = req.params.userId;
    await boards.addMemberToBoard(boardId, userId, role);
    res.redirect('/admin/users');
  } catch (e) {
    console.error(e);
    res.status(400).render('error', {error: e});

}
});


export default router;
