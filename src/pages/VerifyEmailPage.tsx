import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please check your link.');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully! You can now log in.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link may have expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error. Could not connect to verification server.');
      }
    };

    verify();
  }, [token]);

  // Auto-redirect to the login page shortly after a successful verification.
  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center pt-32 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl liquid-glass border border-foreground/10 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 animate-pulse" />
          <span className="text-white font-bold tracking-[0.18em] text-[13px] font-display">PRIMENOVA</span>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Verifying Email</h2>
            <p className="text-sm text-white/50">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Verification Complete!</h2>
            <p className="text-sm text-white/50 mb-6 px-4">{message}</p>
            <p className="text-xs text-white/40 mb-4">Redirecting you to sign in...</p>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Verification Failed</h2>
            <p className="text-sm text-white/50 mb-6 px-4">{message}</p>
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-xl border border-white/[0.08] text-white hover:bg-white/[0.04] text-xs font-semibold transition-colors"
            >
              Back to Signup
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
