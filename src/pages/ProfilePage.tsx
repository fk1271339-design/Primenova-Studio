import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const ProfilePage: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('primenova_token') || sessionStorage.getItem('primenova_token');

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'security' | 'notifications'>('dashboard');

  // Profile Fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [company, setCompany] = useState(user?.company || '');
  const [location, setLocation] = useState(user?.location || '');

  // Edit / Status States
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Sessions State
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Fetch active sessions
  const fetchSessions = async () => {
    if (!token) return;
    try {
      setIsLoadingSessions(true);
      const response = await fetch(`${API_BASE_URL}/user/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Trigger sessions fetch when switching to security tab
  useEffect(() => {
    if (activeTab === 'security') {
      fetchSessions();
    }
  }, [activeTab]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      setIsSaving(true);
      await updateUserProfile({ fullName, phone, avatar, bio, website, company, location });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/user/sessions/revoke/${sessionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setMessage({ type: 'success', text: 'Device session revoked successfully.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to revoke session.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error revoking session.' });
    }
  };

  const handleRevokeOthers = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/user/sessions/revoke-others`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchSessions();
        setMessage({ type: 'success', text: 'All other device sessions have been signed out.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to revoke other sessions.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error revoking other sessions.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/user/account`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          logout();
          navigate('/');
        } else {
          alert('Could not delete account. Please try again.');
        }
      } catch (err) {
        alert('Network error trying to delete account.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[90vh] w-full pt-28 pb-16 px-4 md:px-8 flex justify-center text-white">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 mt-6">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl flex flex-col items-center text-center"
          >
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-black font-extrabold text-2xl font-display shadow-lg overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-md" />
            </div>

            <h2 className="text-md font-semibold tracking-tight text-white">{user.fullName}</h2>
            <p className="text-xs text-white/40 mt-0.5 truncate max-w-full">{user.email}</p>

            <div className="mt-4 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[9px] font-bold font-mono tracking-wider text-amber-400 uppercase">
                {user.role}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[9px] font-bold font-mono tracking-wider text-white/50 uppercase">
                {user.provider}
              </span>
            </div>

            {user.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-xs shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Admin Dashboard
              </button>
            )}
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl p-2.5 flex flex-col gap-1"
          >
            {[
              { id: 'dashboard', label: 'Dashboard', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              )},
              { id: 'profile', label: 'Profile Details', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )},
              { id: 'security', label: 'Security & Sessions', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              )},
              { id: 'notifications', label: 'Notifications', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-1-2.5m-5 5.5v.01M4 17h5m-5 0a3.001 3.001 0 003 3h10a3 3 0 003-3m-12 0a3 3 0 01-3-3V11a6.002 6.002 0 016-6 6 6 0 016 6v3a3 3 0 00-3 3" /></svg>
              )}
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setMessage(null); }}
                className={`w-full py-2.5 px-3.5 rounded-xl text-[13px] font-medium flex items-center gap-3 transition-colors ${
                  activeTab === tab.id
                    ? 'text-white bg-white/[0.05] border-l-2 border-amber-400'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

            <div className="border-t border-white/[0.06] pt-2 mt-2">
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full py-2.5 px-3.5 rounded-xl text-[13px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.04] flex items-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="p-8 rounded-3xl border border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl shadow-2xl min-h-[500px]"
          >
            {/* Status Messages */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}
              >
                {message.type === 'success' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                {message.text}
              </div>
            )}

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-white tracking-tight">Welcome back, {user.fullName.split(' ')[0]} 👋</h2>
                  <p className="text-xs text-white/40 mt-1">Here is a quick overview of your workspace telemetry and account usage.</p>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'Last Login', val: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today', col: 'text-amber-400' },
                    { label: 'Active Projects', val: '04', col: 'text-sky-400' },
                    { label: 'Inbound Messages', val: '12', col: 'text-emerald-400' },
                    { label: 'Paid Invoices', val: '$0.00', col: 'text-zinc-300' },
                    { label: 'AI Credits Remaining', val: '150 / 150', col: 'text-rose-400' },
                    { label: 'Storage Utilized', val: '1.2 GB / 10 GB', col: 'text-indigo-400' }
                  ].map((stat, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1.5">
                      <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">{stat.label}</span>
                      <span className={`text-lg font-bold font-display ${stat.col}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* Dynamic Welcome card */}
                <div className="p-6 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-rose-500/5 border border-amber-500/10 flex flex-col md:flex-row items-center gap-4 justify-between mt-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Need advice on launching your SaaS startup?</h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed max-w-lg">
                      Nova, our AI Business Consultant is waiting to audit your site architecture, review SEO targets, and outline cost-optimal models.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/ai-assistant')}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold text-xs shrink-0 hover:opacity-90 transition-opacity"
                  >
                    Consult Nova
                  </button>
                </div>
              </div>
            )}

            {/* TAB: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-white tracking-tight">Edit Profile</h2>
                  <p className="text-xs text-white/40 mt-1">Manage your public information, biography and company details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-amber-400/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-amber-400/30 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Avatar URL</label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-amber-400/30 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Bio / Description</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell us about yourself or your business..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-amber-400/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-amber-400/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-amber-400/30 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Delhi, India"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-amber-400/30 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  ) : 'Save Profile Changes'}
                </button>
              </form>
            )}

            {/* TAB: SECURITY & ACTIVE SESSIONS */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-white tracking-tight">Security & Device Sessions</h2>
                  <p className="text-xs text-white/40 mt-1">Review active device logs connected to your credential tokens and revoke session privileges.</p>
                </div>

                {/* Sessions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">Active Device Sign-ins</h3>
                    <button
                      onClick={handleRevokeOthers}
                      className="text-[11px] text-amber-400/80 hover:text-amber-400 font-semibold transition-colors"
                    >
                      Logout Other Devices
                    </button>
                  </div>

                  {isLoadingSessions ? (
                    <div className="flex items-center gap-2 py-4">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="text-xs text-white/40">Loading session telemetry...</span>
                    </div>
                  ) : sessions.length === 0 ? (
                    <span className="text-xs text-white/30 block py-2">No active sessions found.</span>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((sess, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/60">
                              {sess.device && sess.device.toLowerCase().includes('phone') ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-semibold text-white/80">{sess.operatingSystem || 'Unknown OS'} - {sess.browser || 'Unknown Browser'}</span>
                              <span className="text-[10px] text-white/40">{sess.ipAddress} • {sess.country || 'Delhi'} • {new Date(sess.loginTime).toLocaleString()}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRevokeSession(sess.id)}
                            className="text-[10px] font-semibold text-rose-400/80 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-500/[0.05] border border-transparent hover:border-rose-500/10 transition-all shrink-0"
                          >
                            Sign Out
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                <div className="border-t border-white/[0.06] pt-6 mt-6 flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div>
                    <span className="text-xs text-rose-400 font-bold block">Danger Zone</span>
                    <span className="text-[11px] text-white/40 mt-0.5 block leading-relaxed">
                      Permanently terminate this PrimeNova account, cleaning all MongoDB data and revoking current OAuth profiles.
                    </span>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-xs hover:bg-rose-500 hover:text-white transition-all shrink-0"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-white tracking-tight">System Notifications</h2>
                  <p className="text-xs text-white/40 mt-1">Stay updated with automatic alerts, server updates, invoice payments and usage stats.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Project Setup Complete', desc: 'Your website review with Nova engine has been finalized.', date: '3 hours ago', read: false },
                    { label: 'Invoice Paid', desc: 'Payment receipt for Bronze Tier proposal is now downloadable in account panel.', date: '1 day ago', read: true },
                    { label: 'AI Credit Consumption Warning', desc: 'You have consumed 15% of your allocated consultation tokens.', date: '2 days ago', read: true },
                    { label: 'Password Changed Successfully', desc: 'Secure security parameters on user credentials updated.', date: '5 days ago', read: true },
                  ].map((notif, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-colors ${
                        notif.read
                          ? 'bg-white/[0.01] border-white/[0.04] text-white/50'
                          : 'bg-white/[0.02] border-amber-500/10 text-white'
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-transparent' : 'bg-amber-400 animate-pulse'}`} />
                        <div>
                          <h4 className="text-xs font-semibold text-white/90">{notif.label}</h4>
                          <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">{notif.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/30 shrink-0 font-medium">{notif.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
