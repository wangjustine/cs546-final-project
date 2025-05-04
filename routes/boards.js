import { Router } from 'express';
import * as boards from '../data/boards.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const newBoard = await boards.createBoard(req.body);
    res.status(200).json(newBoard);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const board = await boards.getBoardById(req.params.id);
    res.status(200).json(board);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

export default router;
