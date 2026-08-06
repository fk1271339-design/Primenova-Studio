import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'form' | 'loading' | 'success'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus('form');
        setError(data?.message || 'Could not send reset link. Please try again later.');
        return;
      }
      // The backend always returns the same success message regardless of whether
      // the account exists (prevents account enumeration).
      setStatus('success');
    } catch {
      setStatus('form');
      setError('Network error — please check your connection and try again.');
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

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 animate-pulse" />
          <span className="text-white font-bold tracking-[0.18em] text-[13px] font-display">PRIMENOVA</span>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Check Your Inbox</h2>
            <p className="text-sm text-white/50 mb-6 px-4 leading-relaxed">
              If an account exists for <span className="text-white/80 font-medium">{email.trim()}</span>,
              a password reset link has been sent. Please allow up to a minute for delivery.
            </p>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-lg font-semibold text-white mb-1">Forgot Password</h2>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              Enter your account email and we'll send you a secure link to reset your password.
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
              >
                {error}
              </motion.div>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/40 transition-colors"
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <p className="text-xs text-white/40">
              Remembered it?{' '}
              <Link to="/login" className="text-amber-400 hover:underline font-medium">
                Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
