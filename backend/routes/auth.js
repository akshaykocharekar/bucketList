import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, inviteCode } = req.body;
  if (inviteCode !== process.env.INVITE_CODE)
    return res.status(403).json({ error: 'Wrong invite code' });
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Email taken' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    const id = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET).id;
    const user = await User.findById(id).select('-password');
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch {
    res.status(401).json({ error: 'Bad token' });
  }
});

router.get('/users', async (req, res) => {
  const users = await User.find().select('name email avatar');
  res.json(users);
});

export default router;