import { Router } from 'express';
import * as tasks from '../data/tasks.js';

const router = Router();

router.post('/:taskId', async (req, res) => {
  try {
    const { userId, commentText } = req.body;
    const comment = await tasks.addComment(req.params.taskId, userId, commentText);
    res.status(200).json(comment);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;
