
import express from 'express';
import auth from '../middleware/auth.js';
import List from '../models/List.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const lists = await List.find({
    $or: [{ owner: req.userId }, { type: 'shared' }]
  }).populate('owner', 'name');
  res.json(lists);
});

router.post('/', auth, async (req, res) => {
  const { name, type } = req.body;
  const list = await List.create({
    name, type, owner: type === 'personal' ? req.userId : null,
  });

  // log activity only for shared lists — personal list creation isn't news
  if (type === 'shared') {
    const user = await User.findById(req.userId).select('name');
    if (user) {
      await Activity.create({
        user: req.userId,
        type: 'list_created',
        listId: list._id,
        text: `${user.name} started shared list "${name}"`,
        readBy: [req.userId],
      });
    }
  }

  res.json(list);
});

export default router;
