import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);
  const [manualShow, setManualShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('installDismissed');
    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
      if (!dismissed) setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const t = setTimeout(() => {
      if (!dismissed && !deferred) {
        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        if (!standalone) setManualShow(true);
      }
    }, 4000);

    return () => {
      clearTimeout(t);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [deferred]);

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setShow(false);
  }

  function dismiss() {
    localStorage.setItem('installDismissed', '1');
    setShow(false);
    setManualShow(false);
  }

  return (
    <AnimatePresence>
      {(show || manualShow) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-card border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-2xl">
            <div className="text-2xl">📲</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Install Secret Bucket</div>
              <div className="text-xs text-white/50">
                {show ? 'Add to home screen' : 'Menu → "Add to Home Screen"'}
              </div>
            </div>
            {show && (
              <button onClick={install} className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                Install
              </button>
            )}
            <button onClick={dismiss} className="text-white/40 text-xs px-1">✕</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}