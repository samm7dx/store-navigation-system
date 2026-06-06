import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminLogin from './components/AdminLogin';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">Smart Store Navigator</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <span className="font-semibold text-indigo-600 block">Algorithm:</span>
            Dijkstra
          </div>
          <div>
            <span className="font-semibold text-indigo-600 block">Complexity:</span>
            O(V²)
          </div>
          <div>
            <span className="font-semibold text-indigo-600 block">Data Structures:</span>
            <ul className="list-disc pl-5 font-mono text-xs bg-gray-50 p-2 rounded mt-1">
              <li>dist[][]</li>
              <li>visited[][]</li>
              <li>parentRow[][]</li>
              <li>parentCol[][]</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            Analysis and Design of Algorithms (ADA) Project
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAdminAuthenticated(true);
    } else if (location.pathname === '/admin') {
      setIsAdminAuthenticated(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAdminAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center glass-card p-4 px-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-indigo-900 tracking-tight">Smart Store Navigator</h1>
          <button onClick={() => setShowAbout(true)} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition font-medium">About Project</button>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Home</Link>
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Admin Panel</Link>
              <button onClick={handleLogout} className="text-sm bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full hover:bg-red-100 transition font-medium">Logout</button>
            </div>
          ) : (
            <Link to="/admin" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">Admin Panel</Link>
          )}
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={
            isAdminAuthenticated ? <Admin /> : <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />
          } />
        </Routes>
      </main>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
