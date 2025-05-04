import { Router } from 'express';
import * as notifications from '../data/notifications.js';

const router = Router();

router.get('/:userId', async (req, res) => {
  try {
    const list = await notifications.getNotificationsByUser(req.params.userId);
    res.status(200).json(list);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.patch('/:notificationId/seen', async (req, res) => {
  try {
    await notifications.markAsSeen(req.params.notificationId);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;
