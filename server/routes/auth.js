const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sign = (u) => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ name: u.name, email: u.email, role: u.role });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (typeof email !== 'string' || !EMAIL.test(email.trim())) return res.status(400).json({ message: 'Invalid email' });
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    const user = await User.create({
      name: typeof name === 'string' ? name.trim().slice(0, 80) : '',
      email: email.trim(),
      passwordHash: await bcrypt.hash(password, 10),
      role: 'athlete', // never taken from the request
    });
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Email already registered' });
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) {
    next(e);
  }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    res.json(pub(user));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
