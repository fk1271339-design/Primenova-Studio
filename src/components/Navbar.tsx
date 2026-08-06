import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MenuIcon, XIcon, SunIcon, MoonIcon } from './Icons';
import { API_BASE_URL, BACKEND_ORIGIN } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'AI Assistant', path: '/ai-assistant' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
];

// ── Arrow Icon for CTA ──
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Navbar: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ── Scroll Detection ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handleClick = () => setShowProfileMenu(false);
    if (showProfileMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showProfileMenu]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = useCallback(() => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  }, [logout, navigate]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <motion.nav
          initial={false}
          animate={{
            paddingTop: scrolled ? 6 : 10,
            paddingBottom: scrolled ? 6 : 10,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`hidden lg:flex items-center gap-1 px-6 rounded-full transition-all duration-500 max-w-[980px] w-full border ${
            scrolled
              ? 'border-white/[0.08] bg-black/75 shadow-xl shadow-black/45'
              : 'border-white/[0.05] bg-white/[0.02] shadow-lg shadow-black/15'
          }`}
          style={{
            backdropFilter: scrolled ? 'blur(24px) saturate(160%)' : 'blur(18px) saturate(140%)',
            WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(160%)' : 'blur(18px) saturate(140%)',
          }}
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 mr-8 group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 shadow-[0_0_8px_rgba(251,146,60,0.4)] group-hover:shadow-[0_0_14px_rgba(251,146,60,0.6)] transition-shadow duration-300" />
            <span className="text-white font-bold tracking-[0.18em] text-[13px] font-display group-hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] transition-all duration-300 group-hover:scale-[1.03] origin-left">
              PRIMENOVA
            </span>
          </Link>

          {/* ── Nav Links ── */}
          <div className="flex items-center gap-0.5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative px-3.5 py-2 text-[13px] font-medium transition-all duration-250 rounded-lg group"
              >
                {/* Active indicator — glowing underline */}
                {isActive(item.path) && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_1px_8px_rgba(251,146,60,0.4)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-all duration-250 ${
                    isActive(item.path)
                      ? 'text-white font-semibold'
                      : 'text-white/50 group-hover:text-white/90 group-hover:-translate-y-[1px]'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/[0.04] transition-all duration-300 group"
              aria-label="Toggle Theme"
            >
              <span className="block group-hover:rotate-[20deg] transition-transform duration-500">
                {darkMode ? <SunIcon className="w-[18px] h-[18px]" /> : <MoonIcon className="w-[18px] h-[18px]" />}
              </span>
            </button>

            {/* Separator */}
            <div className="w-px h-5 bg-white/[0.06] mx-1" />

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-250 group"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-black font-bold text-[11px] overflow-hidden shadow-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        user.fullName.charAt(0).toUpperCase()
                      )}
                    </div>
                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-[2px] border-black/80 shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
                  </div>
                  <span className="text-[12px] font-medium text-white/80 max-w-[72px] truncate group-hover:text-white transition-colors">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <svg className={`w-3 h-3 text-white/30 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ── Profile Dropdown ── */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="absolute right-0 top-[calc(100%+8px)] w-60 rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/40 z-50"
                      style={{
                        background: 'rgba(12,12,14,0.92)',
                        backdropFilter: 'blur(24px)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3.5 border-b border-white/[0.06]">
                        <p className="text-[13px] font-semibold text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-white/40 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-bold uppercase tracking-widest border border-amber-500/10">
                          {user.role}
                        </span>
                      </div>

                      {/* Menu Links */}
                      <div className="py-1.5 px-1.5">
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                        >
                          <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Profile
                        </Link>

                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                          >
                            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                            Dashboard
                          </Link>
                        )}

                        <Link
                          to="/ai-assistant"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                        >
                          <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                          Saved Chats
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-white/[0.06] px-1.5 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* Sign In — Premium outlined glass button */}
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-[7px] text-[12px] font-medium text-white/60 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:border-amber-400/30 hover:text-white hover:bg-white/[0.04] hover:shadow-[0_0_12px_rgba(251,146,60,0.08)] transition-all duration-300"
                >
                  Sign In
                </button>

                {/* Get Started CTA */}
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="group flex items-center gap-1.5 px-4.5 py-[7px] text-[12px] font-semibold rounded-lg bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-black hover:shadow-[0_4px_20px_rgba(251,146,60,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Get Started
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </>
            )}
          </div>
        </motion.nav>

        {/* ── Mobile Navbar ── */}
        <motion.div
          initial={false}
          animate={{ paddingTop: scrolled ? 10 : 14, paddingBottom: scrolled ? 10 : 14 }}
          transition={{ duration: 0.3 }}
          className={`flex lg:hidden w-full max-w-md items-center justify-between px-6 rounded-full border transition-all duration-500 ${
            scrolled
              ? 'border-white/[0.06] bg-black/70 shadow-xl shadow-black/30'
              : 'border-white/[0.04] bg-white/[0.02] shadow-lg shadow-black/10'
          }`}
          style={{
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          }}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 shadow-[0_0_8px_rgba(251,146,60,0.4)]" />
            <span className="text-white font-bold tracking-[0.18em] text-[12px] font-display">PRIMENOVA</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white/40 hover:text-amber-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <SunIcon className="w-[18px] h-[18px]" /> : <MoonIcon className="w-[18px] h-[18px]" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-[76px] left-4 right-4 rounded-2xl border border-white/[0.06] p-4 flex flex-col gap-1 z-40 lg:hidden shadow-2xl shadow-black/30"
              style={{
                background: 'rgba(10,10,12,0.94)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 text-center rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-white bg-white/[0.05] font-semibold'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-white/[0.06] pt-3 mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/[0.04] text-white font-medium text-[13px] transition-colors"
                    >
                      <div className="relative">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-black font-bold text-[10px] overflow-hidden">
                          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-[1.5px] border-[#0a0a0c]" />
                      </div>
                      {user.fullName}
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="py-3 text-center font-medium rounded-xl text-rose-400/80 text-[13px] hover:bg-rose-500/[0.06] transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setIsOpen(false); setShowAuthModal(true); }}
                      className="py-3 text-center font-medium rounded-xl text-white/70 text-[13px] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setIsOpen(false); setShowAuthModal(true); }}
                      className="py-3 text-center font-semibold rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black text-[13px] shadow-lg transition-all"
                    >
                      Get Started →
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══ Premium Auth Modal ═══ */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// Premium Auth Modal Component
// ═══════════════════════════════════════════════════════════════

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccessMsg(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    try {
      setIsLoading(true);
      if (mode === 'login') {
        await login(email, password, rememberMe);
      } else {
        await signup(fullName, email, password);
      }
      resetForm();
      onClose();
      navigate('/profile');
    } catch (err: any) {
      const msg = err.message || 'Authentication failed';
      // Check if this is a verification success message
      if (msg.includes('verify your email') || msg.includes('PrimeNova Studio')) {
        setSuccessMsg(msg);
        setError(null);
      } else {
        setError(msg);
        setSuccessMsg(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg(data.message || 'Password reset link sent to your inbox.');
        setError(null);
      } else {
        setError(data.message || 'Could not send reset link.');
        setSuccessMsg(null);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_ORIGIN}/oauth2/authorization/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `${BACKEND_ORIGIN}/oauth2/authorization/github`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[400px] rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/50"
            style={{
              background: 'rgba(14,14,16,0.96)',
              backdropFilter: 'blur(24px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors z-10"
            >
              <XIcon className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
                <span className="text-white font-bold tracking-[0.15em] text-[12px] font-display">PRIMENOVA</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display tracking-tight">
                {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password'}
              </h2>
              <p className="text-[12px] text-white/40 mt-1.5">
                {mode === 'login'
                  ? 'Sign in to access your dashboard & AI history'
                  : mode === 'signup'
                  ? 'Join PrimeNova Studio to build amazing products'
                  : 'Enter your email to receive a reset link'}
              </p>
            </div>

            {/* Body */}
            <div className="px-8 pt-5 pb-8">

              {/* ─── Forgot Password Mode ─── */}
              {mode === 'forgot' ? (
                <>
                  {/* Success Message */}
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/15 text-emerald-400 text-[12px] text-center leading-relaxed"
                    >
                      {successMsg}
                    </motion.div>
                  )}

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-3 rounded-xl bg-rose-500/[0.08] border border-rose-500/10 text-rose-400 text-[12px] text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 text-[13px] focus:outline-none focus:border-amber-400/30 focus:ring-1 focus:ring-amber-400/10 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-black font-semibold text-[13px] hover:opacity-90 hover:shadow-[0_4px_20px_rgba(251,146,60,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </form>

                  <p className="text-center text-[12px] text-white/30 mt-5">
                    <button
                      onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                      className="text-amber-400/80 hover:text-amber-400 font-medium transition-colors"
                    >
                      ← Back to Sign In
                    </button>
                  </p>
                </>
              ) : (
                <>
                  {/* ─── Login / Signup Mode ─── */}

                  {/* OAuth Buttons */}
                  <div className="flex flex-col gap-2.5 mb-5">
                    <button
                      onClick={handleGoogleLogin}
                      className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/80 text-[13px] font-medium hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-200"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      Continue with Google
                    </button>

                    <button
                      onClick={handleGitHubLogin}
                      className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/80 text-[13px] font-medium hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Continue with GitHub
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-mono">or</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {/* Success Message (green) */}
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/15 text-emerald-400 text-[12px] text-center leading-relaxed whitespace-pre-line"
                    >
                      {successMsg}
                    </motion.div>
                  )}

                  {/* Error (red) */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-3 rounded-xl bg-rose-500/[0.08] border border-rose-500/10 text-rose-400 text-[12px] text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {mode === 'signup' && (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 text-[13px] focus:outline-none focus:border-amber-400/30 focus:ring-1 focus:ring-amber-400/10 transition-all"
                      />
                    )}

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 text-[13px] focus:outline-none focus:border-amber-400/30 focus:ring-1 focus:ring-amber-400/10 transition-all"
                    />

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 text-[13px] focus:outline-none focus:border-amber-400/30 focus:ring-1 focus:ring-amber-400/10 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>

                    {mode === 'login' && (
                      <div className="flex items-center justify-between">
                        {/* Remember Me Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-4 h-4 rounded-[5px] border border-white/[0.1] bg-white/[0.03] peer-checked:bg-amber-400/20 peer-checked:border-amber-400/40 transition-all flex items-center justify-center">
                              {rememberMe && (
                                <svg className="w-2.5 h-2.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] text-white/35 group-hover:text-white/50 transition-colors">Remember me</span>
                        </label>

                        {/* Forgot Password Link */}
                        <button
                          type="button"
                          onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); }}
                          className="text-[11px] text-amber-400/70 hover:text-amber-400 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-black font-semibold text-[13px] hover:opacity-90 hover:shadow-[0_4px_20px_rgba(251,146,60,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          {mode === 'login' ? 'Sign In' : 'Create Account'}
                        </>
                      )}
                    </button>
                  </form>

                  {/* Toggle Mode */}
                  <p className="text-center text-[12px] text-white/30 mt-5">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccessMsg(null); }}
                      className="text-amber-400/80 hover:text-amber-400 font-medium transition-colors"
                    >
                      {mode === 'login' ? 'Create account' : 'Sign in'}
                    </button>
                  </p>

                  {/* Footer Text */}
                  <p className="text-center text-[10px] text-white/15 mt-4 leading-relaxed">
                    By continuing, you agree to our <span className="text-white/25 hover:text-white/40 cursor-pointer transition-colors">Terms</span> & <span className="text-white/25 hover:text-white/40 cursor-pointer transition-colors">Privacy Policy</span>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
