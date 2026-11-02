import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  function confirmLogout() {
    if (window.confirm('Log out?')) logout();
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 backdrop-blur bg-ink/70 border-b border-white/5"
    >
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-extrabold text-lg tracking-tight">
          🎯 Secret<span className="text-accent">Bucket</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/shared"
            className={`text-sm ${pathname.startsWith('/shared') ? 'text-accent' : 'text-white/70'}`}
          >
            Shared
          </Link>
          <NotificationBell />
          <span className="text-xs text-white/60">{user.name}</span>
          <button
            onClick={confirmLogout}
            className="text-xs text-white/30 hover:text-red-400 transition"
            title="Log out"
          >
            ⏻
          </button>
        </div>
      </div>
    </motion.nav>
  );
}