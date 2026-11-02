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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.form
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%", opacity: 0.5 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onSubmit={submit}
            className="bg-card w-full max-w-md rounded-3xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Dream</h2>
              <button type="button" onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>

            <input
              autoFocus value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Skydive in New Zealand"
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-accent transition-colors"
            />

            <label className="block text-xs text-white/50 mb-2">Pick an icon</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {EMOJIS.map(e => (
                <motion.button 
                  whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                  type="button" key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-colors ${emoji === e ? 'bg-accent shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-ink'}`}>
                  {e}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1">Target date</label>
                <input type="date" value={targetDate}
                  onChange={e => { setTargetDate(e.target.value); if (e.target.value) setYear(''); }}
                  className="w-full bg-ink border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1">…or just year</label>
                <input type="number" min="1900" max="2200" placeholder="2026" value={year}
                  onChange={e => { setYear(e.target.value); if (e.target.value) setTargetDate(''); }}
                  className="w-full bg-ink border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent" />
              </div>
            </div>

            <label className="block text-xs text-white/50 mb-1">Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Why this matters…" rows={2}
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 mb-6 outline-none focus:border-accent resize-none" />

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full py-4 rounded-xl bg-accent font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              Add to Bucket
            </motion.button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}