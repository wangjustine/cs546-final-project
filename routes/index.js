import { Router } from 'express';
import boardsRouter from './boards.js';
import commentsRouter from './comments.js';
import notificationsRouter from './notifications.js';
import tasksRouter from './tasks.js';
import usersRouter from './users.js';
import users from '../data/users.js'
const router = Router();

router.get('/', (req, res) => {
  res.redirect('/login');
});
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});
router.get('/user', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect(`/user/${req.session.user._id}`);
});

router.use('/boards', boardsRouter);
router.use('/comments', commentsRouter);
router.use('/notifications', notificationsRouter);
router.use('/tasks', tasksRouter);
router.use('/users', usersRouter);
router.get('/user/:id', async (req, res) => {
  try {
    if (!req.session.user || req.session.user._id !== req.params.id) {
      return res.redirect('/login');
    }

    const user = await users.getUserById(req.params.id);
    res.render('users', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      category: user.category,
      preference: user.preference
    });
  } catch (e) {
    res.status(404).render('error', { error: 'User not found' });
  }
});
export default router;
