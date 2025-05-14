import {Router} from 'express';
import boards from '../data/boards.js';
import tasks from '../data/tasks.js'; 
import users from '../data/users.js'; 
import {isValidObjectId, isNonEmptyString} from '../validation.js';

import {getAllUsers, updateUserRole, deleteUser} from '../data/users.js';


let router = Router();
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    let userBoards = await boards.getBoardsByUserId(req.session.user._id);
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
    
    let {title, description} = req.body;

    if (!isNonEmptyString(title)) throw 'Invalid title';
    if (!isNonEmptyString(description)) throw 'Invalid description';

    let board = await boards.createBoard(title, description, req.session.user._id);

    await boards.addMemberToBoard(board.boardId, req.session.user._id, 'admin');

    res.redirect(`/boards/${board.boardId}`);
  } catch (e) {
    res.status(400).json({error: e});
  }
});

// Add member (admin only)
router.post('/:id/add-member', async (req, res) => {
  try {
    let board = await boards.getBoardByIdWithComments(req.params.id);
    if (!boards.isAdmin(board, req.session.user._id)) {
      return res.status(403).send("Only admins can add members");
    }

    let {userId} = req.body;
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
    let board = await boards.getBoardByIdWithComments(req.params.id);
    if (!req.session.user || !boards.isMember(board, req.session.user._id)) {
      return res.status(403).send("Access denied");
    }

    let boardTasks = await tasks.getTasksByBoardId(board.boardId); // assumed function
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
    let allUsers = await getAllUsers();
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
    let {category} = req.body;
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

    if (!isValidObjectId(req.params.userId)) throw 'Invalid userId';

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
    let {boardId, role} = req.body;
    let userId = req.params.userId;
    if (!isValidObjectId(userId)) throw 'Invalid userId';
    if (!isValidObjectId(boardId)) throw 'Invalid boardId';
    if (!isNonEmptyString(role)) throw 'Invalid role';

    await boards.addMemberToBoard(boardId, userId, role);
    res.redirect('/admin/users');
  } catch (e) {
    console.error(e);
    res.status(400).render('error', {error: e});

}
});
router.post('/:boardId/comments', async (req, res) => {
  try {
    let {userId, commentText} = req.body;
    const boardCollection = await boards();
    const newComment = {
      _id: uuid(),
      userId,
      commentText,
      createdAt: new Date()
    };
    const updateInfo = await boardCollection.updateOne(
      { boardId: req.params.boardId },
      { $push: { comments: newComment } }
    );
    if (!updateInfo.modifiedCount) 
      throw 'Couldnt add comment to board';
    res.redirect(`/boards/${req.params.boardId}`); 
  } catch (e) {
    console.error(e);
    res.status(400).render('error', {error: e});
  }
});

export default router;
