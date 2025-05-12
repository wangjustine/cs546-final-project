import { Router } from 'express';
import boardsRouter from './boards.js';
import commentsRouter from './comments.js';
import notificationsRouter from './notifications.js';
import tasksRouter from './tasks.js';
import usersRouter from './users.js';
import users from '../data/users.js'
import {isAuthenticated, isAdmin, redirectIfLoggedIn} from '../middleware.js';

const router = Router();

//public routes
router.get('/', (req, res) => {
  res.redirect('/login');
});
router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', redirectIfLoggedIn, (req, res) => {
  res.render('register', { title: 'Register' });
});

//private routes

router.get('/user', isAuthenticated, (req, res) => {
  res.redirect(`/user/${req.session.user._id}`);
});

router.get('/user/:id', isAuthenticated, async (req, res) => {
  try {
    if (req.session.user._id !== req.params.id) {
      return res.status(403).render('error', { error: '403 Forbidden' });
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


// dashboard

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});



// Admin route
router.get('/admin', isAdmin, (req, res) => {
  res.render('adminDashboard', { user: req.session.user });
});



router.use('/boards', boardsRouter);
router.use('/comments', commentsRouter);
router.use('/notifications', notificationsRouter);
router.use('/tasks', tasksRouter);
router.use('/users', usersRouter);

export default router;
