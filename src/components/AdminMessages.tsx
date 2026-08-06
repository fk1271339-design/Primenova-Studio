import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XIcon } from './Icons';
import { API_BASE_URL } from '../config';

interface ContactItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  subject?: string;
  message: string;
  status?: string;
  ipAddress?: string;
  browser?: string;
  operatingSystem?: string;
  device?: string;
  country?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Stats {
  totalMessages: number;
  unreadMessages: number;
  repliedMessages: number;
  todayMessages: number;
}

interface PageResponse {
  content: ContactItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

const PAGE_SIZE = 8;

const FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'REPLIED', label: 'Replied' },
  { value: 'CLOSED', label: 'Archived' },
];

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  READ: 'Read',
  REPLIED: 'Replied',
  CLOSED: 'Archived',
};

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-amber-500/15 text-amber-500 border-amber-500/25',
  READ: 'bg-sky-500/15 text-sky-500 border-sky-500/25',
  REPLIED: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25',
  CLOSED: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25',
};

// ─── Local inline SVG icons (project convention) ───────────────
const IconWrapper = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {props.children}
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="2" />
  </IconWrapper>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

const ArchiveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <rect x="3" y="4" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

const ReplyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M9 14l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10h11a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

const MailOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M2 8l10-5 10 5v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 9l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </IconWrapper>
);

const InboxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 5h13l3.5 7v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7l3.5-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </IconWrapper>
);

const StatCard: React.FC<{ label: string; value: number | undefined; accent: string; sub?: string }> = ({ label, value, accent, sub }) => (
  <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col">
    <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">{label}</span>
    <span className={`text-3xl font-extrabold font-display mt-2 ${accent}`}>{value ?? '—'}</span>
    {sub && <span className="text-[10px] text-muted-foreground mt-1">{sub}</span>}
  </div>
);

const AdminMessages: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<ContactItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<ContactItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactItem | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('primenova_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/contacts/stats`, { headers: getHeaders() });
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error('Failed to fetch contact stats', e);
    }
  }, []);

  const fetchList = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) });
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      const res = await fetch(`${API_BASE_URL}/admin/contacts?${params.toString()}`, { headers: getHeaders() });
      if (res.ok) {
        const data: PageResponse = await res.json();
        setMessages(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (e) {
      console.error('Failed to fetch contacts', e);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchList()]).finally(() => setLoading(false));
  }, [fetchStats, fetchList]);

  const refresh = () => {
    fetchStats();
    fetchList();
  };

  const changeStatus = async (contact: ContactItem, status: string) => {
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/contacts/${contact.id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSelected((prev) => (prev && prev.id === contact.id ? { ...prev, status } : prev));
        refresh();
      } else {
        alert('Could not update status');
      }
    } catch {
      alert('Could not update status');
    } finally {
      setBusy(false);
    }
  };

  /**
   * Opens a message's details and, when it is still NEW, silently marks it
   * READ so the unread counter stays accurate as soon as the admin looks at it.
   */
  const openDetails = async (contact: ContactItem) => {
    setSelected(contact);
    if ((contact.status || 'NEW') !== 'NEW') return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/contacts/${contact.id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'READ' }),
      });
      if (res.ok) {
        setSelected((prev) => (prev && prev.id === contact.id ? { ...prev, status: 'READ' } : prev));
        fetchStats();
      }
    } catch {
      // Non-critical — reading is best-effort
    }
  };

  const replyTo = (c: ContactItem) => {
    const subject = encodeURIComponent(`Re: ${c.subject || 'Your PrimeNova Studio inquiry'}`);
    const body = encodeURIComponent(`Hi ${c.fullName},\n\nThanks for reaching out to PrimeNova Studio.\n\n`);
    return `mailto:${c.email}?subject=${subject}&body=${body}`;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/contacts/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        setDeleteTarget(null);
        setSelected(null);
        if (messages.length === 1 && page > 0) {
          setPage(page - 1); // effect refetches
        } else {
          refresh();
        }
      } else {
        alert('Could not delete contact');
      }
    } catch {
      alert('Could not delete contact');
    } finally {
      setBusy(false);
    }
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  const statusBadge = (status?: string) => {
    const s = status || 'NEW';
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[s] || STATUS_STYLES.NEW}`}>
        {STATUS_LABELS[s] || s}
      </span>
    );
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Messages" value={stats?.totalMessages} accent="text-foreground" sub="All inquiries" />
        <StatCard label="Unread" value={stats?.unreadMessages} accent="text-amber-500" sub="Awaiting attention" />
        <StatCard label="Replied" value={stats?.repliedMessages} accent="text-emerald-500" sub="Responded to" />
        <StatCard label="Today's" value={stats?.todayMessages} accent="text-sky-500" sub="Received today" />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search name, email, subject, company..."
          className="px-4 py-2.5 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground text-xs w-full md:max-w-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 ${
                statusFilter === f.value
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                  : 'bg-transparent border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/25'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl liquid-glass border border-foreground/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <InboxIcon className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <div className="text-sm font-semibold text-foreground">No messages found</div>
            <div className="text-xs text-muted-foreground mt-1">Try changing the filter or search query.</div>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-foreground/10 text-muted-foreground uppercase font-mono bg-foreground/5">
              <tr>
                <th className="p-4">Visitor</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Project / Budget</th>
                <th className="p-4">Status</th>
                <th className="p-4">Received</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {messages.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openDetails(c)}
                  className="hover:bg-foreground/5 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {c.fullName}
                      {(c.status || 'NEW') === 'NEW' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unread" />
                      )}
                    </div>
                    <div className="text-muted-foreground text-[10px]">{c.email}</div>
                  </td>
                  <td className="p-4 font-medium text-foreground/90 max-w-[200px] truncate">{c.subject || '—'}</td>
                  <td className="p-4">
                    <div className="font-medium text-amber-500">{c.projectType || 'N/A'}</div>
                    <div className="text-muted-foreground text-[10px] font-mono">{c.budget || ''}</div>
                  </td>
                  <td className="p-4">{statusBadge(c.status)}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{formatDateTime(c.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(c);
                        }}
                        title="View details"
                        className="p-2 rounded-lg bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-amber-500 hover:border-amber-500/30 transition-colors"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(c);
                        }}
                        title="Delete"
                        className="p-2 rounded-lg bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 transition-colors"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {messages.length} of {totalElements} message{totalElements === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-3">
          <button
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-foreground/10 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="font-mono">
            Page {page + 1} / {Math.max(1, totalPages)}
          </span>
          <button
            disabled={page >= totalPages - 1 || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-foreground/10 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !busy && setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl liquid-glass border border-foreground/10 bg-background p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {statusBadge(selected.status)}
                    <span className="text-[10px] font-mono text-muted-foreground">{formatDateTime(selected.createdAt)}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-foreground leading-snug">
                    {selected.subject || 'Project Inquiry'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  aria-label="Close"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-foreground/3 dark:bg-white/3 border border-foreground/10">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">From</div>
                    <div className="font-semibold text-foreground">{selected.fullName}</div>
                    <a href={`mailto:${selected.email}`} className="text-primary text-xs hover:underline">
                      {selected.email}
                    </a>
                    {selected.phone && <div className="text-xs text-muted-foreground mt-1">{selected.phone}</div>}
                    {selected.company && <div className="text-xs text-muted-foreground mt-1">{selected.company}</div>}
                  </div>
                  <div className="p-4 rounded-xl bg-foreground/3 dark:bg-white/3 border border-foreground/10">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Project</div>
                    <div className="text-sm font-semibold text-amber-500">{selected.projectType || 'Not specified'}</div>
                    <div className="text-xs text-muted-foreground mt-1">Budget: <span className="font-mono">{selected.budget || 'Not specified'}</span></div>
                  </div>
                </div>

                {/* Message */}
                <div className="p-4 rounded-xl bg-foreground/3 dark:bg-white/3 border border-foreground/10">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Message</div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Metadata */}
                <div className="p-4 rounded-xl bg-foreground/3 dark:bg-white/3 border border-foreground/10">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Visitor Metadata</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-muted-foreground/70">Browser</div>
                      <div className="text-foreground font-medium">{selected.browser || '—'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground/70">OS</div>
                      <div className="text-foreground font-medium">{selected.operatingSystem || '—'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground/70">Device</div>
                      <div className="text-foreground font-medium">{selected.device || '—'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground/70">IP Address</div>
                      <div className="text-foreground font-medium font-mono">{selected.ipAddress || '—'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground/70">Country</div>
                      <div className="text-foreground font-medium">{selected.country || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selected.status !== 'READ' && (
                    <button
                      disabled={busy}
                      onClick={() => changeStatus(selected, 'READ')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs font-semibold hover:text-sky-500 hover:border-sky-500/30 transition-colors disabled:opacity-50"
                    >
                      <MailOpenIcon className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}
                  {selected.status !== 'REPLIED' && (
                    <button
                      disabled={busy}
                      onClick={() => changeStatus(selected, 'REPLIED')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs font-semibold hover:text-emerald-500 hover:border-emerald-500/30 transition-colors disabled:opacity-50"
                    >
                      <ReplyIcon className="w-3.5 h-3.5" /> Mark Replied
                    </button>
                  )}
                  {selected.status !== 'CLOSED' && (
                    <button
                      disabled={busy}
                      onClick={() => changeStatus(selected, 'CLOSED')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs font-semibold hover:text-zinc-400 hover:border-zinc-500/30 transition-colors disabled:opacity-50"
                    >
                      <ArchiveIcon className="w-3.5 h-3.5" /> Archive
                    </button>
                  )}
                  <a
                    href={replyTo(selected)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/25 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                    title="Open your email client with a pre-filled reply"
                  >
                    <ReplyIcon className="w-3.5 h-3.5" /> Reply via Email
                  </a>
                  <button
                    disabled={busy}
                    onClick={() => setDeleteTarget(selected)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !busy && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl liquid-glass border border-foreground/10 bg-background p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500">
                <TrashIcon className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold font-display text-foreground mb-2">Delete this message?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                "{deleteTarget.subject || 'Project Inquiry'}" from <span className="text-foreground font-semibold">{deleteTarget.fullName}</span> will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  disabled={busy}
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-xs font-semibold hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={busy}
                  onClick={handleDelete}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                >
                  {busy ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckIcon className="w-3.5 h-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
