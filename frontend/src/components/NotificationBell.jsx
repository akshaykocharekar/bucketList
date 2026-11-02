import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const { count } = await api('/api/activity/unread-count');
        if (alive) setCount(count);
      } catch {}
    }
    poll();
    const t = setInterval(poll, 20000);
    return () => { alive = false; clearInterval(t); };
  }, [pathname]);

  return (
    <Link to="/activity" className="relative text-lg" title="Activity">
      🔔
      {count > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}