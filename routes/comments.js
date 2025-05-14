import { Router } from 'express';
import comments from '../data/comments.js';
import tasks from '../data/tasks.js';
import boards from '../data/boards.js';
let router = Router();

router.post('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.session.user?._id;
    const { commentText } = req.body;

    if (!commentText)
      res.status(400).render('error', { error: 'Comment text is required' });

    await comments.addComment(taskId, userId, commentText);
    const task = await tasks.getTaskById(taskId);
    const board = await boards.getBoardById(task.boardId);
    const boardTasks = await tasks.getTasksByBoardId(task.boardId);

    res.render('board', {board,tasks: boardTasks,message: 'Comment added!'
    });

  } catch (e) {
    console.error('Error adding comment:', e);
    res.status(400).render('error', { error: e.toString() });
  }
});
export default router;
