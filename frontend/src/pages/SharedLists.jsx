import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-4 pt-6"
    >
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Shared</h1>
          <p className="text-white/40 text-sm mt-1">Adventures with the squad</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="bg-accent px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)] flex items-center gap-2"
        >
          <span>+</span> New
        </motion.button>
      </div>

      {/* Lists */}
      {lists.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          className="text-center bg-card/50 border border-white/5 rounded-3xl py-16 px-6"
        >
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="font-bold text-lg mb-1">No shared lists yet</h3>
          <p className="text-white/40 text-sm">Create one and start planning with your friends.</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          <AnimatePresence>
            {lists.map(l => (
              <motion.div key={l._id} variants={itemAnim} layout>
                <Link 
                  to={`/shared/${l._id}`}
                  className="block group relative overflow-hidden bg-card border border-white/5 rounded-2xl p-5 hover:border-accent/40 transition-colors"
                >
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className="font-bold text-lg">{l.name}</div>
                      <div className="text-xs text-white/40 mt-1 flex items-center gap-1">
                        <span>👥</span> Shared with the squad
                      </div>
                    </div>
                    <div className="text-accent bg-accent/10 p-2 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              onClick={e => e.stopPropagation()}
              initial={{ y: "100%", opacity: 0.5 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onSubmit={create}
              className="bg-card w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">New Shared List</h2>
                <button type="button" onClick={() => setOpen(false)} className="text-white/40 hover:text-white text-xl">✕</button>
              </div>
              
              <input
                autoFocus value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Goa Trip 2026"
                className="w-full bg-ink border border-white/10 rounded-xl px-4 py-4 mb-6 outline-none focus:border-accent transition-colors text-lg"
              />
              
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full py-4 rounded-xl bg-accent font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                Create List
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}