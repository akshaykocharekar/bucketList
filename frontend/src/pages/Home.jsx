import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import ItemCard from '../components/ItemCard.jsx';
import AddItemModal from '../components/AddItemModal.jsx';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const lists = await api('/api/lists');
    let personal = lists.find(l => l.type === 'personal');
    if (!personal) {
      personal = await api('/api/lists', {
        method: 'POST',
        body: JSON.stringify({ name: 'My Bucket', type: 'personal' }),
      });
    }
    setList(personal);
    const its = await api(`/api/items/list/${personal._id}`);
    setItems(its);
  }

  async function add({ title, emoji, targetDate, note }) {
    const item = await api('/api/items', {
      method: 'POST',
      body: JSON.stringify({ listId: list._id, title, emoji, targetDate, note }),
    });
    setItems([item, ...items]);
  }

  async function complete(id) {
    const updated = await api(`/api/items/${id}/complete`, { method: 'POST', body: '{}' });
    setItems(items.map(i => i._id === id ? updated : i));
  }

  async function remove(id) {
    await api(`/api/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i._id !== id));
  }

  const done = items.filter(i => i.completions?.length > 0).length;
  const progress = items.length ? (done / items.length) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-4 pt-6"
    >
      {/* 🌟 Animated Header Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative overflow-hidden bg-gradient-to-br from-accent/30 to-accent/5 rounded-3xl p-6 mb-6 border border-white/10"
      >
        {/* Animated Glow Effect inside the card */}
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-accent rounded-full blur-3xl pointer-events-none"
        />

        <h1 className="text-3xl font-extrabold mb-1 relative z-10">My Bucket</h1>
        <p className="text-white/60 text-sm mb-4 relative z-10">{done} of {items.length} things done</p>
        
        {/* Springy Progress Bar */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden relative z-10 shadow-inner">
          <motion.div
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="h-full bg-gradient-to-r from-accent to-purple-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
          />
        </div>
      </motion.div>

      {/* 🚀 Animated List */}
      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/40 py-16">
          Nothing here yet. Add your first dream ✨
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          <AnimatePresence>
            {items.map(item => (
              <motion.div variants={itemAnim} key={item._id} className="mb-3">
                <ItemCard item={item} onComplete={complete} onDelete={remove} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 🔮 Pulsing FAB (Floating Action Button) */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent text-white text-3xl font-light shadow-[0_0_20px_rgba(139,92,246,0.6)] z-20 flex items-center justify-center"
      >
        +
      </motion.button>

      <AddItemModal open={open} onClose={() => setOpen(false)} onAdd={add} />
    </motion.div>
  );
}