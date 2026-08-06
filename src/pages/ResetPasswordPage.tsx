import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'form' | 'loading' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Reset token is missing. Please check your link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Password has been reset successfully.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Reset failed. The link may have expired.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center pt-32 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl liquid-glass border border-foreground/10 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 animate-pulse" />
          <span className="text-white font-bold tracking-[0.18em] text-[13px] font-display">PRIMENOVA</span>
        </div>

        {/* Form State */}
        {status === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-lg font-semibold text-white mb-1">Set New Password</h2>
            <p className="text-xs text-white/50 mb-4">Enter your new password below.</p>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
              >
                {message}
              </motion.div>
            )}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/40 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/40 transition-colors"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] text-white/40 hover:text-white/60 transition-colors"
            >
              {showPassword ? 'Hide passwords' : 'Show passwords'}
            </button>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mb-4" />
            <p className="text-sm text-white/50">Resetting your password...</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Password Reset!</h2>
            <p className="text-sm text-white/50 mb-6 px-4">{message}</p>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Reset Failed</h2>
            <p className="text-sm text-white/50 mb-6 px-4">{message}</p>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl border border-white/[0.08] text-white hover:bg-white/[0.04] text-xs font-semibold transition-colors"
            >
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
