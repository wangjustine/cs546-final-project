import { Router } from 'express';
import * as users from '../data/users.js';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const user = await users.getUserById(req.params.id);
        if (!user) {
            res.redirect('/login');
        }
        res.status(200).json(user);
    } catch (e) {
        throw e;
    }
}
);
router.get('/:id', async (req, res) => {
  try {
    const user = await users.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/email/:email', async (req, res) => {
  try {
    const user = await users.getUserByEmail(req.params.email);
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

export default router;
