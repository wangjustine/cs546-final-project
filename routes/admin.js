import { Router } from 'express';
import * as users from '../data/users.js';

let router = Router();

router.get('/users', async (req, res) => {
  try {
   if (!req.session.user) 
      return res.status(403).send("Only admins can add users to boards");
    if (req.session.user.category !== 'admin') 
      return res.status(403).send("Only admins can add users to boards");
    let allUsers = await users.getAllUsers();
    res.render('adminUsers', { users: allUsers });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', { error: e });
  }
});
router.post('/users/:userId/role', async (req, res) => {
  try {
    const userId = req.params.userId;
    const newRole = req.body.category;
    await users.updateUserRole(userId, newRole);
    res.json({ success: true });
  } catch (error) {
    console.error('Could not update user role');
    res.status(400).render('error', {error: e});
  }
});

router.post('/users/:userId/remove', async (req, res) => {
  try {
    const userId = req.params.userId;
    await users.deleteUser(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('failed to remove user');
    res.status(400).render('error', {error: e});
  }
});

router.post('/users/:userId/addToBoard', async (req, res) => {
  try {
    const userId = req.params.userId;
    const boardId = req.body.boardId;   
    const role = req.body.role;         
    await boards.addMemberToBoard(boardId, userId, role);
    res.json({ success: true });
  } catch (error) {
    console.error('Could not add user to board');
    res.status(400).render('error', {error: e});
  }
});

export default router;
