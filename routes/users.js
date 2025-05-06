import { Router } from 'express';
import * as users from '../data/users.js';
import bcrypt from 'bcrypt';

const router = Router();


// GET: user by ID
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

// GET: user by email
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

// POST: register user
router.post('/register', async (req, res) => {
  try {
    const {firstName, lastName, email, password, category, preference} = req.body;
    if (!firstName || !lastName || !email || !password) throw 'missing fields!';
    
    const user = await userData.createUser(firstName, lastName, email, password, category, preference);
    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      category: user.category
    };
    res.status(200).json({ message: 'user registered!', user: req.session.user });
  } catch (e) {
    res.status(400).json({error: e});
  }
});

// POST: login
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) throw 'missing email or password!';

    const user = await userData.getUserByEmail(email);
    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) throw 'invalid email or password!';

    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      category: user.category
    };
    res.status(200).json({message: 'logged in!', user: req.session.user});
  } catch (e) {
    res.status(401).json({error: e});
  }
});

// GET: logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'could not log out!' });
    }
    res.redirect('/login');
  });
});


export default router;
