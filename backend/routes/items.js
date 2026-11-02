import express from 'express';
import auth from '../middleware/auth.js';
import Item from '../models/Item.js';
import List from '../models/List.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/list/:listId', auth, async (req, res) => {
  const items = await Item.find({ list: req.params.listId })
    .populate('createdBy', 'name')
    .populate('completions.user', 'name')
    .sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', auth, async (req, res) => {
  const { listId, title, category, emoji, targetDate, note } = req.body;
  const list = await List.findById(listId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const item = await Item.create({
    list: listId, title, category, emoji, targetDate, note,
    createdBy: req.userId,
  });

  // log activity
  const user = await User.findById(req.userId).select('name');
  if (user) {
    await Activity.create({
      user: req.userId,
      type: 'item_added',
      listId,
      itemId: item._id,
      text: `${user.name} added "${title}"`,
      readBy: [req.userId],
    });
  }

  const populated = await Item.findById(item._id).populate('createdBy', 'name');
  res.json(populated);
});

router.patch('/:id', auth, async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', auth, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.post('/:id/complete', auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });

  const existing = item.completions.find(c => c.user.toString() === req.userId);

  if (existing) {
    // un-complete: remove from completions
    item.completions = item.completions.filter(c => c.user.toString() !== req.userId);
  } else {
    // complete: add completion + log activity
    item.completions.push({ user: req.userId, note: req.body.note || '' });

    const user = await User.findById(req.userId).select('name');
    if (user) {
      await Activity.create({
        user: req.userId,
        type: 'item_completed',
        listId: item.list,
        itemId: item._id,
        text: `${user.name} completed "${item.title}"`,
        readBy: [req.userId],
      });
    }
  }

  await item.save();

  const populated = await Item.findById(item._id)
    .populate('createdBy', 'name')
    .populate('completions.user', 'name');
  res.json(populated);
});

export default router;
