
import express from 'express';
import auth from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// latest 50 activities, excluding ones the current user caused
router.get('/', auth, async (req, res) => {
  const acts = await Activity.find({ user: { $ne: req.userId } })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(acts);
});

// how many are unread for me
router.get('/unread-count', auth, async (req, res) => {
  const count = await Activity.countDocuments({
    user: { $ne: req.userId },
    readBy: { $ne: req.userId },
  });
  res.json({ count });
});

// mark all as read
router.post('/read', auth, async (req, res) => {
  await Activity.updateMany(
    { user: { $ne: req.userId }, readBy: { $ne: req.userId } },
    { $addToSet: { readBy: req.userId } }
  );
  res.json({ ok: true });
});

export default router;
