
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

function formatDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  // If it's exactly Jan 1 → assume it's a year-only entry
  if (dt.getMonth() === 0 && dt.getDate() === 1) return dt.getFullYear();
  return dt.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ItemCard({ item, onComplete, onDelete, shared = false }) {
  const { user } = useAuth();
  const iDone = item.completions?.some(c => (c.user?._id || c.user) === user.id);
  const dateLabel = formatDate(item.targetDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card border border-white/5 rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete(item._id)}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm shrink-0 transition ${
            iDone ? 'bg-accent border-accent' : 'border-white/20'
          }`}
        >
          {iDone && '✓'}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold ${iDone ? 'line-through text-white/40' : ''}`}>
            {item.emoji} {item.title}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            {dateLabel && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                🗓 {dateLabel}
              </span>
            )}
            {shared && (
              <span className="text-[11px] text-white/40">
                added by {item.createdBy?.name}
                {item.completions?.length > 0 && ` · ${item.completions.length} done`}
              </span>
            )}
          </div>

          {item.note && <div className="text-xs text-white/50 mt-1.5">{item.note}</div>}
        </div>
        {!shared && (
          <button
            onClick={() => onDelete(item._id)}
            className="text-white/20 hover:text-red-400 text-xs"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
}
