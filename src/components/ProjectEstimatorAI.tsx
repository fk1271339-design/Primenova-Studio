// ═══════════════════════════════════════════════════════════════
// ProjectEstimatorAI.tsx — AI-Powered Project Cost Estimator
// Users fill a smart form, Gemini generates a detailed proposal
// with cost breakdown, timeline, tech stack recommendations,
// and an auto-generated PDF-ready quote.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callGemini, isGeminiEnabled } from '../utils/geminiService';
import { COST_COMPONENTS, PRICING_TIERS } from '../utils/novaKnowledge';
import type { NovaMemory } from '../utils/novaEngine';

// ─── TYPES ──────────────────────────────────────────────────

interface EstimatorForm {
  projectType: string;
  industry: string;
  features: string[];
  budget: string;
  timeline: string;
  techPreference: string;
  description: string;
}

interface CostBreakdownItem {
  name: string;
  cost: number;
  description: string;
}

interface EstimatorResult {
  totalMin: number;
  totalMax: number;
  breakdown: CostBreakdownItem[];
  recommendedTier: string;
  techStack: string[];
  timeline: string;
  phases: { name: string; duration: string; tasks: string[] }[];
  aiSummary: string;
  highlights: string[];
}

// ─── CONSTANTS ───────────────────────────────────────────────

const PROJECT_TYPES = ['Website', 'E-commerce Store', 'Mobile App', 'SaaS Platform', 'Dashboard/Admin Panel', 'Landing Page', 'API/Backend', 'CRM System'];
const INDUSTRIES = ['Restaurant / Food', 'E-commerce / Retail', 'Healthcare / Medical', 'Education / Coaching', 'Real Estate', 'Gym / Fitness', 'Portfolio / Personal', 'SaaS / Tech', 'Agency / Corporate', 'Other'];
const FEATURES_LIST = ['Payment Gateway', 'Login/Signup', 'Admin Panel', 'Product Catalog', 'Booking System', 'Chat/Messaging', 'Push Notifications', 'Analytics Dashboard', 'Blog/CMS', 'Maps Integration', 'WhatsApp Integration', 'SEO Optimization', 'AI/Chatbot', 'Email Automation', 'Multi-language'];
const BUDGETS = ['Under ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹2,00,000', '₹2,00,000+', 'Flexible'];
const TIMELINES = ['ASAP (1–2 weeks)', '1 Month', '2–3 Months', '3–6 Months', 'Flexible'];

// ─── HELPERS ─────────────────────────────────────────────────

function buildFakeMemory(): NovaMemory {
  return {
    userName: null, projectType: null, industry: null, budget: null,
    preferredLanguage: 'english', extractedFeatures: [], pageTypePreference: null,
    conversationContext: 'estimator', askedForName: false, messageCount: 0,
    productType: null, preferredTech: null, timeline: null,
    discussedServices: [], lastIntent: '', conversationStage: 'pricing',
    decisions: {}, lastTopic: null, lastQuestion: null, pendingField: null,
  };
}

async function generateAIEstimate(form: EstimatorForm): Promise<EstimatorResult | null> {
  const costText = COST_COMPONENTS.map(c => `• ${c.name}: ₹${c.price.toLocaleString('en-IN')} — ${c.description}`).join('\n');

  const prompt = `You are PrimeNova Studio's expert project estimator. Generate a DETAILED cost estimate for the following project.

Project Details:
- Type: ${form.projectType}
- Industry: ${form.industry}
- Features Required: ${form.features.join(', ') || 'Basic features'}
- Budget Range: ${form.budget}
- Timeline: ${form.timeline}
- Tech Preference: ${form.techPreference || 'Any'}
- Description: ${form.description || 'Not specified'}

PrimeNova's Cost Components Reference:
${costText}

Return a JSON object with this EXACT structure (no markdown, just JSON):
{
  "totalMin": <number in INR>,
  "totalMax": <number in INR>,
  "breakdown": [
    { "name": "<component name>", "cost": <number>, "description": "<why needed>" }
  ],
  "recommendedTier": "<Starter|Professional|Enterprise>",
  "techStack": ["<tech1>", "<tech2>", ...],
  "timeline": "<realistic timeline string>",
  "phases": [
    { "name": "<phase name>", "duration": "<duration>", "tasks": ["<task1>", "<task2>"] }
  ],
  "highlights": ["<key value proposition 1>", "<key value proposition 2>", "<key value proposition 3>"],
  "aiSummary": "<2-3 sentence expert summary of what PrimeNova will build and why it's the right approach>"
}

Be specific, realistic, and helpful. Use Indian Rupees (₹). The breakdown should reflect the actual features requested.`;

  try {
    const result = await callGemini(prompt, buildFakeMemory(), []);
    if (!result.success) return null;

    // Extract JSON
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as EstimatorResult;
    return parsed;
  } catch {
    return null;
  }
}

// Rule-based fallback when no Gemini key
function ruleBasedEstimate(form: EstimatorForm): EstimatorResult {
  let min = 10000;
  let max = 15000;
  const breakdown: CostBreakdownItem[] = [{ name: 'Base Design & Development', cost: 10000, description: 'Core website structure and responsive design' }];

  const featureSet = form.features.map(f => f.toLowerCase());

  if (featureSet.includes('payment gateway')) { breakdown.push({ name: 'Payment Gateway', cost: 12000, description: 'Razorpay/Stripe integration' }); min += 12000; max += 12000; }
  if (featureSet.includes('login/signup')) { breakdown.push({ name: 'User Authentication', cost: 10000, description: 'Login, register, JWT auth' }); min += 10000; max += 10000; }
  if (featureSet.includes('admin panel')) { breakdown.push({ name: 'Admin Dashboard', cost: 20000, description: 'CMS and management panel' }); min += 20000; max += 25000; }
  if (featureSet.includes('product catalog')) { breakdown.push({ name: 'E-commerce Features', cost: 25000, description: 'Cart, catalog, checkout' }); min += 25000; max += 30000; }
  if (featureSet.includes('booking system')) { breakdown.push({ name: 'Booking System', cost: 15000, description: 'Appointment & slot booking' }); min += 15000; max += 20000; }
  if (featureSet.includes('analytics dashboard')) { breakdown.push({ name: 'Analytics Dashboard', cost: 25000, description: 'Charts and reporting' }); min += 25000; max += 30000; }
  if (featureSet.includes('ai/chatbot')) { breakdown.push({ name: 'AI Chatbot Integration', cost: 20000, description: 'Custom AI assistant' }); min += 20000; max += 25000; }

  const tier = min <= 30000 ? 'Starter' : min <= 80000 ? 'Professional' : 'Enterprise';

  return {
    totalMin: min,
    totalMax: max,
    breakdown,
    recommendedTier: tier,
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    timeline: form.timeline || '4–8 weeks',
    phases: [
      { name: 'Design & Planning', duration: '1 week', tasks: ['Wireframes', 'UI Design', 'Tech Architecture'] },
      { name: 'Development', duration: '3–6 weeks', tasks: ['Frontend', 'Backend', 'Database', 'APIs'] },
      { name: 'Testing & Launch', duration: '1 week', tasks: ['QA Testing', 'Bug Fixes', 'Deployment'] },
    ],
    highlights: ['Fully responsive design', 'SEO optimized', '6 months post-launch support'],
    aiSummary: `PrimeNova Studio will build a ${form.projectType} for your ${form.industry} business with ${form.features.length > 0 ? form.features.join(', ') : 'core features'}. The project will follow our proven development workflow with design, development, and testing phases. Add your Gemini API key for a more personalized AI estimate.`,
  };
}

// ─── RESULT DISPLAY ──────────────────────────────────────────

const ResultCard = ({ result, form }: { result: EstimatorResult; form: EstimatorForm }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>PrimeNova Studio — Project Estimate</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; color: #111; }
            h1 { color: #6d28d9; } h2 { color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            .cost { font-size: 32px; font-weight: bold; color: #6d28d9; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            td, th { padding: 10px 14px; border: 1px solid #e5e7eb; text-align: left; font-size: 13px; }
            th { background: #f9fafb; font-weight: 600; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; background: #ede9fe; color: #6d28d9; font-size: 11px; font-weight: 600; }
            .phase { margin: 8px 0; padding: 12px; border-left: 3px solid #6d28d9; background: #f5f3ff; }
            ul { margin: 4px 0; padding-left: 18px; }
            li { font-size: 12px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>`);
    win.document.close();
    win.print();
  };

  const tierColor = result.recommendedTier === 'Enterprise' ? '#f59e0b' : result.recommendedTier === 'Professional' ? '#6d28d9' : '#10b981';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Your Project Estimate</h3>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print / Save PDF
        </button>
      </div>

      {/* Hidden print content */}
      <div ref={printRef} style={{ display: 'none' }}>
        <h1>PrimeNova Studio — Project Estimate</h1>
        <p style={{ color: '#6b7280' }}>Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <hr />
        <h2>Project Overview</h2>
        <p><strong>Type:</strong> {form.projectType} | <strong>Industry:</strong> {form.industry}</p>
        <p><strong>Timeline:</strong> {result.timeline} | <strong>Tier:</strong> {result.recommendedTier}</p>
        <div className="cost">₹{result.totalMin.toLocaleString('en-IN')} – ₹{result.totalMax.toLocaleString('en-IN')}</div>
        <h2>Cost Breakdown</h2>
        <table><thead><tr><th>Component</th><th>Cost (₹)</th><th>Description</th></tr></thead>
          <tbody>{result.breakdown.map((item, i) => <tr key={i}><td>{item.name}</td><td>₹{item.cost.toLocaleString('en-IN')}</td><td>{item.description}</td></tr>)}</tbody>
        </table>
        <h2>Recommended Tech Stack</h2>
        <p>{result.techStack.join(' • ')}</p>
        <h2>Project Phases</h2>
        {result.phases.map((p, i) => (
          <div key={i} className="phase">
            <strong>{p.name}</strong> ({p.duration})<ul>{p.tasks.map((t, j) => <li key={j}>{t}</li>)}</ul>
          </div>
        ))}
        <h2>Summary</h2>
        <p>{result.aiSummary}</p>
        <div className="footer">
          <p>PrimeNova Studio | primenovastudioo@gmail.com | primenova.studio</p>
          <p>This is an approximate estimate. Final pricing subject to detailed discovery call.</p>
        </div>
      </div>

      {/* Visual cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Cost */}
        <div className="col-span-1 sm:col-span-1 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Estimated Cost</span>
          <div>
            <div className="text-2xl font-extrabold text-white mt-2">
              ₹{result.totalMin.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-slate-400">— ₹{result.totalMax.toLocaleString('en-IN')}</div>
          </div>
          <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}>
            {result.recommendedTier} Tier
          </span>
        </div>

        {/* Timeline */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Timeline</span>
          <div className="text-xl font-bold text-white mt-2">{result.timeline}</div>
          <span className="text-[10px] text-slate-500 mt-1">Estimated delivery</span>
        </div>

        {/* Tech Stack */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-2">Tech Stack</span>
          <div className="flex flex-wrap gap-1.5">
            {result.techStack.slice(0, 6).map(t => (
              <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-slate-300">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {result.aiSummary && (
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400">✨</span>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">AI Analysis</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{result.aiSummary}</p>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Cost Breakdown</span>
        </div>
        <div className="divide-y divide-white/5">
          {result.breakdown.map((item, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-white">{item.name}</div>
                <div className="text-[10px] text-slate-500">{item.description}</div>
              </div>
              <span className="text-xs font-bold text-violet-300">₹{item.cost.toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="px-5 py-3 flex items-center justify-between bg-violet-500/5">
            <span className="text-xs font-bold text-white">Total Estimate</span>
            <span className="text-sm font-extrabold text-violet-300">₹{result.totalMin.toLocaleString('en-IN')} – ₹{result.totalMax.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Project Phases */}
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-3">Project Phases</div>
        <div className="space-y-2">
          {result.phases.map((phase, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.015] flex gap-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{phase.name}</span>
                  <span className="text-[10px] text-slate-500">{phase.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {phase.tasks.map(t => (
                    <span key={t} className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      {result.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.highlights.map(h => (
            <span key={h} className="text-[11px] text-emerald-300 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              ✓ {h}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.015] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Ready to get started?</p>
          <p className="text-xs text-slate-400 mt-0.5">Book a free consultation to finalize the scope and timeline.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/contact"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Book Consultation
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN ESTIMATOR COMPONENT ────────────────────────────────

const ProjectEstimatorAI: React.FC = () => {
  const [form, setForm] = useState<EstimatorForm>({
    projectType: '', industry: '', features: [], budget: '', timeline: '', techPreference: '', description: '',
  });
  const [result, setResult] = useState<EstimatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const geminiOn = isGeminiEnabled();

  const toggleFeature = (f: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f],
    }));
  };

  const handleGenerate = async () => {
    if (!form.projectType || !form.industry) return;
    setLoading(true);
    setResult(null);

    let estimate: EstimatorResult | null = null;
    if (geminiOn) {
      estimate = await generateAIEstimate(form);
    }
    if (!estimate) {
      estimate = ruleBasedEstimate(form);
    }

    setResult(estimate);
    setLoading(false);
    setStep(3);
  };

  const steps = ['Project Type', 'Features', 'Budget & Timeline', 'Your Estimate'];

  return (
    <section className="relative w-full min-h-screen pt-[110px] pb-20 px-4 md:px-8 flex flex-col items-center bg-[#070709]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[300px] bg-gradient-to-b from-amber-900/10 to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-semibold text-amber-400 mb-4">
            <span className="animate-pulse">✨</span>
            {geminiOn ? 'AI-POWERED ESTIMATOR' : 'SMART ESTIMATOR'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Know Your Project Cost <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Instantly</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            {geminiOn
              ? 'Powered by Gemini AI — get a detailed, intelligent cost breakdown in seconds.'
              : 'Fill in your project details and get an instant cost estimate with timeline.'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 transition-all ${i === step ? 'text-white' : i < step ? 'text-violet-400' : 'text-slate-600'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${i === step ? 'bg-violet-600 border-violet-500 text-white' : i < step ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-[11px] font-medium hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-violet-500/40' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 0 — Project Type + Industry */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white">What are you building?</h3>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-2">Project Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PROJECT_TYPES.map(t => (
                      <button
                        key={t}
                        onClick={() => setForm(prev => ({ ...prev, projectType: t }))}
                        className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all text-left ${form.projectType === t ? 'bg-violet-600/20 border-violet-500/40 text-violet-300' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-2">Industry / Niche</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INDUSTRIES.map(ind => (
                      <button
                        key={ind}
                        onClick={() => setForm(prev => ({ ...prev, industry: ind }))}
                        className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all text-left ${form.industry === ind ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-2">Describe Your Project (Optional)</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what you want to build..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40 resize-none"
                  />
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!form.projectType || !form.industry}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next: Select Features →
                </button>
              </motion.div>
            )}

            {/* Step 1 — Features */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Which features do you need?</h3>
                  <span className="text-[10px] text-slate-500">{form.features.length} selected</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FEATURES_LIST.map(f => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${form.features.includes(f) ? 'bg-violet-600/25 border-violet-500/40 text-violet-300' : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/25 hover:text-white'}`}
                    >
                      {form.features.includes(f) ? '✓ ' : ''}{f}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Next: Budget & Timeline →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Budget + Timeline */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white">Budget & Timeline</h3>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-2">Your Budget Range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUDGETS.map(b => (
                      <button
                        key={b}
                        onClick={() => setForm(prev => ({ ...prev, budget: b }))}
                        className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${form.budget === b ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-2">Timeline</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIMELINES.map(t => (
                      <button
                        key={t}
                        onClick={() => setForm(prev => ({ ...prev, timeline: t }))}
                        className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${form.timeline === t ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-2">Tech Preference (Optional)</label>
                  <input
                    type="text"
                    value={form.techPreference}
                    onChange={e => setForm(prev => ({ ...prev, techPreference: e.target.value }))}
                    placeholder="e.g. React, Next.js, Flutter, WordPress..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={() => void handleGenerate()}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        {geminiOn ? 'Gemini is generating...' : 'Calculating...'}
                      </>
                    ) : (
                      <>{geminiOn ? '✨ Generate AI Estimate' : '⚡ Calculate Estimate'}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Results */}
            {step === 3 && result && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-4">
                <ResultCard result={result} form={form} />
                <button
                  onClick={() => { setStep(0); setResult(null); setForm({ projectType: '', industry: '', features: [], budget: '', timeline: '', techPreference: '', description: '' }); }}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  🔄 Start Over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing reference */}
        {step !== 3 && (
          <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
            <p className="text-[10px] text-slate-500 text-center uppercase font-mono tracking-wider mb-3">Reference Pricing Tiers</p>
            <div className="grid grid-cols-3 gap-3">
              {PRICING_TIERS.map(tier => (
                <div key={tier.name} className="text-center">
                  <div className="text-xs font-bold text-white">{tier.name}</div>
                  <div className="text-[10px] text-violet-400 font-semibold mt-0.5">{tier.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectEstimatorAI;
