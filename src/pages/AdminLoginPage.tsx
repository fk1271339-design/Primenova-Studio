import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      await login(email, password, false);
      
      const token = localStorage.getItem('primenova_token');
      const profileRes = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const userData = await profileRes.json();

      if (userData.role !== 'ADMIN') {
        setError('Access denied. Administrator privileges required.');
        return;
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Admin login failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center pt-32 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl liquid-glass border border-amber-500/20 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
            ADMIN PORTAL
          </span>
          <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">System Control</h1>
          <p className="text-sm text-muted-foreground mt-2 font-light">
            Enter administrator credentials to manage PrimeNova Studio
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@primenova.studio"
              required
              className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-black font-semibold text-sm hover:opacity-90 shadow-lg shadow-amber-500/20 transition-all duration-300 active:scale-98 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
