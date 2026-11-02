import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, default: '' },
  completedAt: { type: Date, default: Date.now },
}, { _id: false });

const itemSchema = new mongoose.Schema({
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'other' },
  emoji: { type: String, default: '⭐' },
  status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  note: { type: String, default: '' },
  targetDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completions: [completionSchema],
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);