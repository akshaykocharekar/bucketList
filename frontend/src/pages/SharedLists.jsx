import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

export default function SharedLists() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const all = await api('/api/lists');
    setLists(all.filter(l => l.type === 'shared'));
  }

  async function create(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await api('/api/lists', {
      method: 'POST',
      body: JSON.stringify({ name, type: 'shared' }),
    });
    setName(''); setOpen(false); load();
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Shared Lists</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-accent px-4 py-2 rounded-xl text-sm font-semibold"
        >+ New</button>
      </div>

      <AnimatePresence>
        {lists.map(l => (
          <motion.div
            key={l._id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-3"
          >
            <Link to={`/shared/${l._id}`}
              className="block bg-card border border-white/5 rounded-2xl p-4 hover:border-accent/40 transition">
              <div className="font-semibold">📋 {l.name}</div>
              <div className="text-xs text-white/40 mt-1">tap to open</div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>

      {lists.length === 0 && (
        <div className="text-center text-white/40 py-16">
          No shared lists yet. Create one! 🌍
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              onClick={e => e.stopPropagation()}
              initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
              onSubmit={create}
              className="bg-card w-full max-w-md rounded-3xl p-5 border border-white/10"
            >
              <h2 className="text-lg font-bold mb-3">New shared list</h2>
              <input
                autoFocus value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Goa Trip 2026"
                className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-accent"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-ink text-white/60">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-accent font-semibold">Create</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}