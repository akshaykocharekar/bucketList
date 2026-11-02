import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import ItemCard from '../components/ItemCard.jsx';
import AddItemModal from '../components/AddItemModal.jsx';

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
    <div className="max-w-md mx-auto px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-accent/30 to-accent/5 rounded-3xl p-6 mb-6 border border-white/10"
      >
        <h1 className="text-2xl font-extrabold mb-1">My Bucket</h1>
        <p className="text-white/50 text-sm mb-4">{done} of {items.length} things done</p>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            className="h-full bg-accent rounded-full"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {items.map(item => (
          <div key={item._id} className="mb-3">
            <ItemCard item={item} onComplete={complete} onDelete={remove} />
          </div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <div className="text-center text-white/40 py-16">
          Nothing here yet. Add your first dream ✨
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-white text-2xl font-bold shadow-2xl z-20"
      >+</motion.button>

      <AddItemModal open={open} onClose={() => setOpen(false)} onAdd={add} />
    </div>
  );
}