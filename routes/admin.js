import { Router } from 'express';
import * as users from '../data/users.js';

const router = Router();

router.get('/users', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.category !== 'admin') 
      return res.status(403).render('error', { error: 'Only admins can access this page.' });
    const allUsers = await users.getAllUsers();
    res.render('adminUsers', { users: allUsers });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', { error: e });
  }
});

export default router;
