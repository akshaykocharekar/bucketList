
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['item_added', 'item_completed', 'list_created'], required: true },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  text: { type: String, required: true },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
