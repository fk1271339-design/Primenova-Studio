// ═══════════════════════════════════════════════════════════════
// AdminAIInsights.tsx — AI-powered analytics for Nova conversations
// Shows lead quality, top intents, service interest, and smart
// summaries using Gemini to analyze conversation patterns.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { callGemini, isGeminiEnabled } from '../utils/geminiService';
import type { NovaMemory } from '../utils/novaEngine';

// ─── TYPES ──────────────────────────────────────────────────

interface ChatSessionSummary {
  id: string;
  userId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  novaUserName?: string;
  novaIndustry?: string;
  novaProjectType?: string;
  novaBudget?: string;
  novaConversationStage?: string;
  novaExtractedFeatures?: string[];
  novaDiscussedServices?: string[];
  novaPreferredLanguage?: string;
}

// ─── LEAD SCORE CALC ─────────────────────────────────────────

function calcLeadScore(session: ChatSessionSummary): number {
  let score = 0;

  if (session.novaUserName) score += 15;
  if (session.novaBudget) score += 25;
  if (session.novaIndustry) score += 15;
  if (session.novaProjectType) score += 10;
  if (session.novaExtractedFeatures && session.novaExtractedFeatures.length > 0) score += 15;
  if (session.messageCount > 5) score += 10;
  if (session.messageCount > 10) score += 10;
  if (session.novaConversationStage === 'closing') score += 20;
  else if (session.novaConversationStage === 'recommendation') score += 15;
  else if (session.novaConversationStage === 'pricing') score += 10;

  return Math.min(score, 100);
}

function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-rose-400';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-emerald-500/10 border-emerald-500/20';
  if (score >= 40) return 'bg-amber-500/10 border-amber-500/20';
  return 'bg-rose-500/10 border-rose-500/20';
}

function scoreLabel(score: number): string {
  if (score >= 70) return 'Hot Lead 🔥';
  if (score >= 40) return 'Warm Lead 🌡️';
  return 'Cold Lead ❄️';
}

// ─── STATS CARDS ─────────────────────────────────────────────

const StatCard = ({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) => (
  <div className={`p-5 rounded-2xl border ${color ?? 'border-white/5 bg-white/[0.02]'} flex flex-col gap-1`}>
    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">{label}</span>
    <span className="text-2xl font-extrabold font-display text-white">{value}</span>
    {sub && <span className="text-[10px] text-slate-500">{sub}</span>}
  </div>
);

// ─── GEMINI INSIGHT PANEL ─────────────────────────────────────

const GeminiInsightPanel = ({ sessions }: { sessions: ChatSessionSummary[] }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateInsight = async () => {
    if (!isGeminiEnabled() || sessions.length === 0) return;
    setLoading(true);

    const summaryData = sessions.slice(0, 15).map(s => ({
      industry: s.novaIndustry,
      budget: s.novaBudget,
      stage: s.novaConversationStage,
      features: s.novaExtractedFeatures?.join(', '),
      messages: s.messageCount,
      lang: s.novaPreferredLanguage,
    }));

    const prompt = `You are a business analyst for PrimeNova Studio. Analyze these Nova AI chatbot conversation sessions and provide a concise executive summary with key insights.

Session Data (last ${summaryData.length} conversations):
${JSON.stringify(summaryData, null, 2)}

Provide:
1. **Top 3 Industries** users are inquiring about
2. **Most requested features**
3. **Average lead quality** (hot/warm/cold breakdown)
4. **Language distribution** (Hindi/Hinglish/English)
5. **Key recommendations** for the sales team (2-3 bullet points)

Keep it concise, professional, and actionable. Use bullet points. Max 200 words.`;

    const fakeMemory: NovaMemory = {
      userName: null, projectType: null, industry: null, budget: null,
      preferredLanguage: null, extractedFeatures: [], pageTypePreference: null,
      conversationContext: 'admin', askedForName: false, messageCount: 0,
      productType: null, preferredTech: null, timeline: null,
      discussedServices: [], lastIntent: '', conversationStage: 'initial',
      decisions: {}, lastTopic: null, lastQuestion: null, pendingField: null,
    };

    const result = await callGemini(prompt, fakeMemory, []);
    setInsight(result.success ? result.text : 'Could not generate insight. Check Gemini API key.');
    setLoading(false);
    setGenerated(true);
  };

  return (
    <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 col-span-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-semibold text-white">Gemini AI Business Insights</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20 font-semibold">
            {isGeminiEnabled() ? 'Live' : 'API Key Required'}
          </span>
        </div>
        {isGeminiEnabled() && (
          <button
            onClick={() => void generateInsight()}
            disabled={loading}
            className="text-[11px] px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : generated ? '🔄 Refresh' : '✨ Generate Insights'}
          </button>
        )}
      </div>

      {!isGeminiEnabled() && (
        <p className="text-xs text-slate-400">
          Add <code className="text-violet-300 bg-violet-500/10 px-1 rounded">VITE_GEMINI_API_KEY</code> in your <code className="text-slate-300 bg-white/5 px-1 rounded">.env</code> file to enable AI-powered insights.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.1s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
          <span className="text-xs text-slate-400 ml-1">Gemini is analyzing conversations...</span>
        </div>
      )}

      {insight && !loading && (
        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap mt-2 space-y-1">
          {insight.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-semibold text-white">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.startsWith('• ') || line.startsWith('- ')) {
              return <p key={i} className="pl-3 text-slate-400">{line}</p>;
            }
            if (/^\d+\./.test(line)) {
              return <p key={i} className="font-medium text-violet-300">{line}</p>;
            }
            return <p key={i}>{line}</p>;
          })}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────

const AdminAIInsights: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSessionSummary | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('primenova_token');
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Try to fetch all chat sessions (admin endpoint)
        const res = await fetch(`${API_BASE_URL}/admin/chat-sessions`, { headers: getHeaders() });
        if (res.ok) {
          const data = (await res.json()) as ChatSessionSummary[];
          // Add message count if not present
          setSessions(data.map(s => ({ ...s, messageCount: s.messageCount || 0 })));
        }
      } catch {
        // If endpoint doesn't exist yet, use empty state
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    void fetchSessions();
  }, []);

  // ── Compute stats ──
  const hotLeads = sessions.filter(s => calcLeadScore(s) >= 70).length;
  const warmLeads = sessions.filter(s => { const sc = calcLeadScore(s); return sc >= 40 && sc < 70; }).length;
  const coldLeads = sessions.filter(s => calcLeadScore(s) < 40).length;

  const industryCount: Record<string, number> = {};
  sessions.forEach(s => {
    if (s.novaIndustry) industryCount[s.novaIndustry] = (industryCount[s.novaIndustry] || 0) + 1;
  });
  const topIndustries = Object.entries(industryCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const featureCount: Record<string, number> = {};
  sessions.forEach(s => {
    s.novaExtractedFeatures?.forEach(f => {
      featureCount[f] = (featureCount[f] || 0) + 1;
    });
  });
  const topFeatures = Object.entries(featureCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Conversations" value={sessions.length} sub="Nova AI sessions" />
        <StatCard label="Hot Leads 🔥" value={hotLeads} sub="Score ≥ 70" color="border-emerald-500/20 bg-emerald-500/5" />
        <StatCard label="Warm Leads 🌡️" value={warmLeads} sub="Score 40–69" color="border-amber-500/20 bg-amber-500/5" />
        <StatCard label="Cold Leads ❄️" value={coldLeads} sub="Score < 40" color="border-rose-500/20 bg-rose-500/5" />
      </div>

      {/* Gemini Insights Panel */}
      <GeminiInsightPanel sessions={sessions} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Industries */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
            Top Industries Inquiring
          </h3>
          {topIndustries.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No industry data yet</p>
          ) : (
            <div className="space-y-2.5">
              {topIndustries.map(([industry, count]) => {
                const pct = Math.round((count / sessions.length) * 100);
                return (
                  <div key={industry}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">{industry}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Features */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
            Most Requested Features
          </h3>
          {topFeatures.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No feature data yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topFeatures.map(([feature, count]) => (
                <span
                  key={feature}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5"
                >
                  {feature}
                  <span className="w-4 h-4 rounded-full bg-violet-500/30 text-violet-300 text-[9px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lead Table */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Conversation Lead Scores
          </h3>
          <span className="text-[10px] text-slate-500">{sessions.length} total sessions</span>
        </div>

        {sessions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-400 mb-1">No conversation data yet</p>
            <p className="text-xs text-slate-500">Leads will appear here once users chat with Nova</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 text-slate-400 uppercase font-mono bg-white/[0.01]">
                <tr>
                  <th className="p-4">Lead</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions
                  .sort((a, b) => calcLeadScore(b) - calcLeadScore(a))
                  .map(session => {
                    const score = calcLeadScore(session);
                    return (
                      <tr
                        key={session.id}
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                        onClick={() => setSelectedSession(session)}
                      >
                        <td className="p-4">
                          <div className="font-semibold text-white">
                            {session.novaUserName ?? 'Anonymous'}
                          </div>
                          <div className="text-slate-500 text-[10px]">
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{session.novaIndustry ?? '—'}</td>
                        <td className="p-4 text-slate-300">{session.novaBudget ?? '—'}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-slate-400 capitalize">
                            {session.novaConversationStage ?? 'initial'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-bold text-base ${scoreColor(score)}`}>{score}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${scoreBg(score)} ${scoreColor(score)}`}>
                            {scoreLabel(score)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSession(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl"
            style={{ background: 'rgba(8,8,12,0.96)', backdropFilter: 'blur(24px)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">
                Lead Detail — {selectedSession.novaUserName ?? 'Anonymous'}
              </h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-slate-400 hover:text-white transition-colors text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Industry', value: selectedSession.novaIndustry },
                { label: 'Project Type', value: selectedSession.novaProjectType },
                { label: 'Budget', value: selectedSession.novaBudget },
                { label: 'Language', value: selectedSession.novaPreferredLanguage },
                { label: 'Stage', value: selectedSession.novaConversationStage },
                { label: 'Messages', value: selectedSession.messageCount },
              ].map(({ label, value }) => (
                value ? (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-medium capitalize">{String(value)}</span>
                  </div>
                ) : null
              ))}

              {selectedSession.novaExtractedFeatures && selectedSession.novaExtractedFeatures.length > 0 && (
                <div className="pt-1">
                  <p className="text-slate-400 mb-2">Features Requested</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSession.novaExtractedFeatures.map(f => (
                      <span key={f} className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/15 border border-violet-500/20 text-violet-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-between">
                <span className="text-slate-400">Lead Score</span>
                <span className={`text-xl font-extrabold ${scoreColor(calcLeadScore(selectedSession))}`}>
                  {calcLeadScore(selectedSession)}/100 — {scoreLabel(calcLeadScore(selectedSession))}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminAIInsights;
