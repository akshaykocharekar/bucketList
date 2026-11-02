import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import SharedLists from './pages/SharedLists.jsx';
import SharedList from './pages/SharedList.jsx';
import Activity from './pages/Activity.jsx';
import Navbar from './components/Navbar.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-ink text-accent">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-4xl">
        ⏳
      </motion.div>
    </div>
  );
  
  if (!user) return <Login />;

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/shared" element={<SharedLists />} />
          <Route path="/shared/:id" element={<SharedList />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
      <InstallPrompt />
    </div>
  );
}