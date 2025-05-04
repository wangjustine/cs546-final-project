import { Router } from 'express';
import boardsRouter from './boards.js';
import commentsRouter from './comments.js';
import notificationsRouter from './notifications.js';
import tasksRouter from './tasks.js';
import usersRouter from './users.js';

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
router.use('/boards', boardsRouter);
router.use('/comments', commentsRouter);
router.use('/notifications', notificationsRouter);
router.use('/tasks', tasksRouter);
router.use('/users', usersRouter);

export default router;
