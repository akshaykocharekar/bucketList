import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function Activity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api('/api/activity');
        setItems(data);
        await api('/api/activity/read', { method: 'POST', body: '{}' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-4">Activity</h1>

      {loading && <div className="text-white/40 text-center py-10">Loading…</div>}

      {!loading && items.length === 0 && (
        <div className="text-center text-white/40 py-16">
          No activity yet. Add or complete something ✨
        </div>
      )}

      {items.map(a => (
        <motion.div
          key={a._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-white/5 rounded-2xl p-4 mb-3"
        >
          <div className="text-sm">{a.text}</div>
          <div className="text-xs text-white/40 mt-1">{timeAgo(a.createdAt)}</div>
        </motion.div>
      ))}
    </div>
  );
}