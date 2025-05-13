import { Router } from 'express';
import users from '../data/users.js';
import {validateUserInput, isNonEmptyString, isValidEmail, isValidObjectId} from '../validation.js';
import bcrypt from 'bcrypt';

let router = Router();


// GET users
router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect(`/user/${req.session.user._id}`);
});


// GET: user by ID
router.get('/user/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) throw 'Invalid user ID';
    if (!req.session.user || req.session.user._id !== req.params.id) {
      return res.status(403).redirect('/login');
    }

    let user = await users.getUserById(req.params.id);
    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      category: user.category,
      preference: user.preference
    };
    res.redirect(`/user/${user._id}`);
  } catch (e) {
    res.status(404).render('error', { error: 'User not found!' });
  }
});



// POST: register user
router.post('/register', async (req, res) => {
  try {
    let {firstName, lastName, email, password, category, preference} = req.body;
    
    email = email?.toLowerCase().trim();
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    password = password?.trim();

    validateUserInput({ firstName, lastName, email, password })
    
    let user = await users.createUser(firstName, lastName, email, password, category, preference);
    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      category: user.category,
      preference: user.preference
    };
    res.render('login', {message: 'registered!'});
  } catch (e) {
    res.render('error', { error: e });
  }
});

// POST: login
router.post('/login', async (req, res) => {
  try {
    let {email, password} = req.body;
    email = email?.toLowerCase().trim();
    password = password?.trim();

    if (!isValidEmail(email)) throw 'Invalid email format!';
    if (!isNonEmptyString(password)) throw 'Password is required!';

    let user = await users.getUserByEmail(email);
    let match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) throw 'invalid email or password!';

    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      category: user.category,
      preference: user.preference
    };
    if (user.category === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('/dashboard');
    }

  } catch (e) {
    res.render('error', { error: e })
}});

// GET: logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
    res.render('error', { error: e });
    }
    res.render('logout', {message: 'logged out!'});
  });
});


export default router;
