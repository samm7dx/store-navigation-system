import React, { useState } from 'react';
import { verifyAdmin } from '../services/api';

const AdminLogin = ({ onLoginSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await verifyAdmin(code);
      if (res.success) {
        localStorage.setItem("adminAuth", "true");
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Subject Code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="glass-card p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">Admin Authentication</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Enter Subject Code</label>
            <input 
              type="password"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-200 outline-none text-center tracking-widest text-lg"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
