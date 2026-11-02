
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['⭐', '✈️', '🏔️', '🍜', '🎸', '🏄', '🎨', '📚', '🚗', '🪂', '🎯', '❤️'];

export default function AddItemModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [targetDate, setTargetDate] = useState('');
  const [year, setYear] = useState('');
  const [note, setNote] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    // Build a date string: if user picked a full date use it,
    // otherwise if only year → use Jan 1 of that year
    let finalDate = null;
    if (targetDate) finalDate = targetDate;
    else if (year) finalDate = `${year}-01-01`;

    await onAdd({ title, emoji, targetDate: finalDate, note });
    setTitle(''); setEmoji('⭐'); setTargetDate(''); setYear(''); setNote('');
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.form
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
            onSubmit={submit}
            className="bg-card w-full max-w-md rounded-3xl p-5 border border-white/10 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold mb-3">New bucket item</h2>

            <input
              autoFocus value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Skydive in New Zealand"
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 mb-3 outline-none focus:border-accent"
            />

            <div className="flex flex-wrap gap-2 mb-3">
              {EMOJIS.map(e => (
                <button type="button" key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-2 rounded-xl ${emoji === e ? 'bg-accent' : 'bg-ink'}`}>
                  {e}
                </button>
              ))}
            </div>

            <label className="block text-xs text-white/50 mb-1">Target date (optional)</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => { setTargetDate(e.target.value); if (e.target.value) setYear(''); }}
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 mb-3 outline-none focus:border-accent"
            />

            <label className="block text-xs text-white/50 mb-1">…or just a year</label>
            <input
              type="number"
              min="1900" max="2200"
              placeholder="e.g. 2026"
              value={year}
              onChange={e => { setYear(e.target.value); if (e.target.value) setTargetDate(''); }}
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 mb-3 outline-none focus:border-accent"
            />

            <label className="block text-xs text-white/50 mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Why this matters…"
              rows={2}
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-accent resize-none"
            />

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-ink text-white/60">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-accent font-semibold">
                Add
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
