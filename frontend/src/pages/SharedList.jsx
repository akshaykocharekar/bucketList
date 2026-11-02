import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import ItemCard from '../components/ItemCard.jsx';
import AddItemModal from '../components/AddItemModal.jsx';

export default function SharedList() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const its = await api(`/api/items/list/${id}`);
    setItems(its);
  }

  async function add({ title, emoji }) {
    const item = await api('/api/items', {
      method: 'POST',
      body: JSON.stringify({ listId: id, title, emoji }),
    });
    setItems([item, ...items]);
  }

  async function complete(itemId) {
    const updated = await api(`/api/items/${itemId}/complete`, { method: 'POST', body: '{}' });
    setItems(items.map(i => i._id === itemId ? updated : i));
  }

  const anyoneDone = items.filter(i => i.completions?.length > 0).length;
  const progress = items.length ? (anyoneDone / items.length) * 100 : 0;

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <Link to="/shared" className="text-white/40 text-sm">← back</Link>

      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-accent/30 to-accent/5 rounded-3xl p-6 my-4 border border-white/10"
      >
        <h1 className="text-2xl font-extrabold mb-1">Group progress</h1>
        <p className="text-white/50 text-sm mb-4">{anyoneDone} of {items.length} tackled by someone</p>
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
            <ItemCard item={item} onComplete={complete} shared />
          </div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <div className="text-center text-white/40 py-16">
          Empty. Add the first idea 🌟
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