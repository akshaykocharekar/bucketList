import { Routes, Route, Navigate } from 'react-router-dom';
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
  if (loading) return <div className="p-10 text-center text-white/50">Loading…</div>;
  if (!user) return <Login />;
  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shared" element={<SharedLists />} />
        <Route path="/shared/:id" element={<SharedList />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <InstallPrompt />
    </div>
  );
}