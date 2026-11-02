import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', inviteCode: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 glow">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Secret<span className="text-accent">Bucket</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Just for us 🤫</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <>
              <input placeholder="Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent" />
              <input placeholder="Invite code" value={form.inviteCode}
                onChange={e => setForm({ ...form, inviteCode: e.target.value })}
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent" />
            </>
          )}
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent" />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent" />
          {err && <div className="text-red-400 text-sm">{err}</div>}
          <motion.button whileTap={{ scale: 0.97 }} disabled={busy}
            className="w-full bg-accent py-3 rounded-xl font-bold disabled:opacity-50">
            {busy ? '…' : mode === 'login' ? 'Enter' : 'Join'}
          </motion.button>
        </form>

        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}
          className="w-full mt-4 text-sm text-white/40 hover:text-white/70"
        >
          {mode === 'login' ? 'First time? Join with invite code' : 'Already have account? Log in'}
        </button>
      </motion.div>
    </div>
  );
}