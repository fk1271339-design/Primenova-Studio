import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import AdminMessages from '../components/AdminMessages';

interface UserItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  provider: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

interface UserSessionItem {
  id: string;
  email: string;
  loginType: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
}

interface AnalyticsData {
  totalUsers: number;
  totalContacts: number;
  totalSessions: number;
  manualLogins: number;
  googleLogins: number;
  githubLogins: number;
  googleUsersCount: number;
  githubUsersCount: number;
  credentialsUsersCount: number;
}

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'contacts' | 'projects' | 'pricing' | 'notifications' | 'sessions'>('analytics');
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [sessions, setSessions] = useState<UserSessionItem[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [userSearch, setUserSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getHeaders = () => {
    const token = localStorage.getItem('primenova_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/analytics`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Failed to fetch analytics', e);
    }
  };

  const fetchUsers = async (search = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users?search=${encodeURIComponent(search)}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/sessions`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error('Failed to fetch sessions', e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/contacts/stats`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUnreadMessages(data.unreadMessages ?? 0);
      }
    } catch (e) {
      console.error('Failed to fetch unread count', e);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchAnalytics(), fetchUsers(), fetchSessions(), fetchNotifications(), fetchUnreadCount()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (res.ok) fetchNotifications();
    } catch (e) {
      console.error('Could not mark notification read', e);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications/read-all`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      if (res.ok) fetchNotifications();
    } catch (e) {
      console.error('Could not mark all notifications read', e);
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchUsers(userSearch);
      }
    } catch (e) {
      alert('Could not update user status');
    }
  };

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('primenova_token');
      const res = await fetch(`${API_BASE_URL}/admin/contacts/export`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'primenova_contacts.csv';
        a.click();
      }
    } catch (e) {
      alert('Could not export CSV');
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
            SYSTEM CONTROL CENTER
          </span>
          <h1 className="text-3xl font-bold font-display text-foreground">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="p-2.5 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground relative hover:bg-foreground/10 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotificationMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl border border-foreground/10 p-4 shadow-2xl z-50 overflow-hidden"
                  style={{ background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(28px)' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-foreground/10 mb-3">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">Notifications</span>
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="text-[10px] text-muted-foreground hover:text-white"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No recent notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-amber-500/10 border-amber-500/30 text-foreground' : 'bg-foreground/5 border-foreground/10 text-muted-foreground'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{n.title}</span>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                          </div>
                          <p className="text-[11px] mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-xs shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Total Users</span>
            <span className="text-3xl font-extrabold font-display text-foreground mt-2">{analytics.totalUsers}</span>
            <span className="text-[10px] text-amber-500 font-medium mt-1">Google: {analytics.googleUsersCount} | Email: {analytics.credentialsUsersCount}</span>
          </div>

          <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Contact Inquiries</span>
            <span className="text-3xl font-extrabold font-display text-foreground mt-2">{analytics.totalContacts}</span>
            <span className="text-[10px] text-emerald-500 font-medium mt-1">Stored in MongoDB</span>
          </div>

          <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Total Logins</span>
            <span className="text-3xl font-extrabold font-display text-foreground mt-2">{analytics.totalSessions}</span>
            <span className="text-[10px] text-indigo-500 font-medium mt-1">Audit Logged</span>
          </div>

          <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Unread Alerts</span>
            <span className="text-3xl font-extrabold font-display text-amber-400 mt-2">{unreadNotificationsCount}</span>
            <span className="text-[10px] text-rose-500 font-medium mt-1">Notifications Bell</span>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-foreground/10 mb-6 gap-4 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Overview' },
          { id: 'users', label: `Users (${users.length})` },
          { id: 'contacts', label: 'Inquiries', badge: unreadMessages },
          { id: 'projects', label: 'Projects' },
          { id: 'pricing', label: 'Pricing' },
          { id: 'sessions', label: `Audit Log (${sessions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === tab.id ? 'border-b-2 border-amber-400 text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.badge && tab.badge > 0 ? (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Users View */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                fetchUsers(e.target.value);
              }}
              placeholder="Search users by name or email..."
              className="px-4 py-2.5 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground text-xs w-full max-w-sm"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl liquid-glass border border-foreground/10">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-foreground/10 text-muted-foreground uppercase font-mono bg-foreground/5">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-foreground/5">
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{u.fullName}</div>
                      <div className="text-muted-foreground text-[10px]">{u.email}</div>
                    </td>
                    <td className="p-4 font-mono">{u.provider}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-500' : 'bg-foreground/10 text-muted-foreground'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleUserStatusToggle(u.id, u.status)}
                        className="px-3 py-1 rounded-lg bg-foreground/5 border border-foreground/10 text-[10px] font-semibold hover:bg-rose-500/10 hover:text-rose-500"
                      >
                        {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Contacts View */}
      {activeTab === 'contacts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AdminMessages />
        </motion.div>
      )}

      {/* Projects Management Architecture View */}
      {activeTab === 'projects' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">Project Showcase Manager</h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Frontend CRUD Engine</span>
          </div>
          <div className="p-8 rounded-2xl liquid-glass border border-foreground/10 text-center space-y-4">
            <p className="text-xs text-muted-foreground">Portfolio items are dynamically managed through the Portfolio showcase matrix.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <span className="font-bold text-xs text-foreground block">Nova OS</span>
                <span className="text-[10px] text-amber-400 font-mono">AI Category • Published</span>
              </div>
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <span className="font-bold text-xs text-foreground block">Aether Brand System</span>
                <span className="text-[10px] text-amber-400 font-mono">Branding Category • Published</span>
              </div>
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <span className="font-bold text-xs text-foreground block">Synthetix Storefront</span>
                <span className="text-[10px] text-amber-400 font-mono">E-Commerce Category • Published</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Management Architecture View */}
      {activeTab === 'pricing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">Pricing Tier Manager</h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Active Disclosures Enabled</span>
          </div>
          <div className="p-8 rounded-2xl liquid-glass border border-foreground/10 text-center space-y-4">
            <p className="text-xs text-muted-foreground">Pricing packages feature clear disclosures ("Starting from", "Custom quote") and feature lists.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <span className="font-bold text-xs text-foreground block">Starter Website ($2,499)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Active Tier</span>
              </div>
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <span className="font-bold text-xs text-foreground block">Business Website ($4,999)</span>
                <span className="text-[10px] text-amber-400 font-mono">Recommended Tier</span>
              </div>
              <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                <span className="font-bold text-xs text-foreground block">AI Agent & LLM Solution</span>
                <span className="text-[10px] text-indigo-400 font-mono">Indicative Pricing Tier</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sessions Audit View */}
      {(activeTab === 'sessions' || activeTab === 'analytics') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider mb-2">Recent Login Sessions</h2>
          <div className="overflow-x-auto rounded-2xl liquid-glass border border-foreground/10">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-foreground/10 text-muted-foreground uppercase font-mono bg-foreground/5">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Login Type</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Login Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-foreground/5">
                    <td className="p-4 font-semibold text-foreground">{s.email}</td>
                    <td className="p-4 font-mono text-indigo-400">{s.loginType}</td>
                    <td className="p-4 text-muted-foreground font-mono">{s.ipAddress}</td>
                    <td className="p-4 text-muted-foreground">{new Date(s.loginTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
