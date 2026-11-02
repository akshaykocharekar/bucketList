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
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 backdrop-blur-xl bg-ink/80 border-b border-white/5"
      >
        <div className="max-w-md mx-auto flex items-center justify-between px-5 py-4">
          {/* Removed the emoji, added a sleek text logo */}
          <Link to="/" className="font-extrabold text-xl tracking-tighter">
            Secret<span className="text-accent">Bucket</span>
          </Link>

          <div className="flex items-center gap-5">
            {/* Shared Link with active underline */}
            <Link
              to="/shared"
              className={`relative text-sm font-medium transition-colors ${
                pathname.startsWith('/shared') ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              Shared
              {pathname.startsWith('/shared') && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent rounded-full"
                />
              )}
            </Link>
            
            <NotificationBell />
          </div>
        </div>
      </motion.nav>

      {/* 👇 Subtle Footer / User Bar (Mobile Friendly) */}
      <div className="max-w-md mx-auto px-5 py-6 flex justify-between items-center text-xs text-white/40">
        <span>Logged in as <strong className="text-white/70">{user.name}</strong></span>
        <button
          onClick={confirmLogout}
          className="hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <span>Log out</span>
          <span>⏻</span>
        </button>
      </div>
    </>
  );
}