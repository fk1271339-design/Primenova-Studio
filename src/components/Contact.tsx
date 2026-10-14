import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { API_BASE_URL } from '../config';
import {
  GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, CheckIcon,
} from './Icons';
import {
  ArrowUpRight, Mail, Globe, Clock4,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const PROJECT_TYPES = [
  'Website Development',
  'Mobile App Development',
  'Branding & Identity',
  'UI/UX Design',
  'AI & Automation',
  'Digital Marketing & SEO',
  'Other',
];

const BUDGET_RANGES = [
  'Under $1,000',
  '$1,000 – $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000+',
];

const SOCIAL = [
  { href: 'https://github.com',    Icon: GithubIcon,   label: 'GitHub'    },
  { href: 'https://linkedin.com',  Icon: LinkedinIcon, label: 'LinkedIn'  },
  { href: 'https://twitter.com',   Icon: TwitterIcon,  label: 'Twitter'   },
  { href: 'https://instagram.com', Icon: InstagramIcon,label: 'Instagram' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  subject: string;
  message: string;
}

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', company: '',
  projectType: '', budget: '', subject: '', message: '',
};

/* ─────────────────────────────────────────────────────────
   FLOATING LABEL INPUT
   Label floats up when field is focused / filled
───────────────────────────────────────────────────────── */
const FloatingInput: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}> = ({ id, label, type = 'text', value, onChange, error, required, placeholder }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative group">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={lifted ? (placeholder ?? '') : ''}
        className={`
          peer w-full bg-transparent pt-6 pb-2.5 px-0 text-sm text-zinc-100 font-medium
          border-0 border-b outline-none transition-colors duration-300
          placeholder-zinc-600
          ${error
            ? 'border-rose-500/60 focus:border-rose-400'
            : 'border-zinc-700/80 focus:border-amber-500'}
        `}
        required={required}
      />
      {/* Floating label */}
      <label
        htmlFor={id}
        className={`absolute left-0 font-medium transition-all duration-250 pointer-events-none
          ${lifted
            ? 'top-0 text-[10px] tracking-widest uppercase'
            : 'top-5 text-sm'}
          ${error
            ? 'text-rose-400'
            : lifted && focused
              ? 'text-amber-500'
              : lifted
                ? 'text-zinc-500'
                : 'text-zinc-500'}`}
      >
        {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      {/* Animated underline */}
      <span
        className={`absolute bottom-0 left-0 h-px transition-all duration-300 ease-out
          bg-amber-500 ${focused ? 'w-full' : 'w-0'}`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-[10px] text-rose-400 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   FLOATING LABEL SELECT
───────────────────────────────────────────────────────── */
const FloatingSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ id, label, value, onChange, options }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative group">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ colorScheme: 'dark' }}
        className="peer w-full bg-transparent pt-6 pb-2.5 px-0 text-sm text-zinc-100 font-medium
          border-0 border-b border-zinc-700/80 outline-none focus:border-amber-500
          transition-colors duration-300 cursor-pointer appearance-none"
      >
        <option value="" className="bg-zinc-950">—</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-zinc-950">{o}</option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`absolute left-0 font-medium transition-all duration-250 pointer-events-none
          ${lifted ? 'top-0 text-[10px] tracking-widest uppercase text-zinc-500' : 'top-5 text-sm text-zinc-500'}`}
      >
        {label}
      </label>
      <span className={`absolute bottom-0 left-0 h-px transition-all duration-300 bg-amber-500 ${focused ? 'w-full' : 'w-0'}`} />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   FLOATING LABEL TEXTAREA
───────────────────────────────────────────────────────── */
const FloatingTextarea: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
}> = ({ id, label, value, onChange, error, required, rows = 4 }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative group">
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          peer w-full bg-transparent pt-6 pb-2.5 px-0 text-sm text-zinc-100 font-medium
          border-0 border-b outline-none resize-none transition-colors duration-300
          ${error ? 'border-rose-500/60 focus:border-rose-400' : 'border-zinc-700/80 focus:border-amber-500'}
        `}
        required={required}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 font-medium transition-all duration-250 pointer-events-none
          ${lifted ? 'top-0 text-[10px] tracking-widest uppercase' : 'top-5 text-sm'}
          ${error ? 'text-rose-400' : lifted && focused ? 'text-amber-500' : 'text-zinc-500'}`}
      >
        {label}{required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      <span className={`absolute bottom-0 left-0 h-px transition-all duration-300 bg-amber-500 ${focused ? 'w-full' : 'w-0'}`} />
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-[10px] text-rose-400 font-medium">
          {error}
        </motion.p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MARQUEE TICKER (horizontal scrolling tag line)
───────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'Web Design', 'AI Integration', 'Brand Strategy', 'Mobile Apps',
  'Cloud Architecture', 'UI/UX Design', 'Digital Marketing', 'Automation',
];

const Ticker: React.FC = () => (
  <div className="relative w-full overflow-hidden border-t border-b border-zinc-800/60 py-3 my-10">
    <div
      className="flex gap-0 whitespace-nowrap"
      style={{ animation: 'ticker-scroll 22s linear infinite' }}
    >
      {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-4 px-6 text-[11px] font-mono font-bold
          text-zinc-600 uppercase tracking-[0.15em]">
          {item}
          <span className="w-1 h-1 rounded-full bg-amber-600/50 flex-shrink-0" />
        </span>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN CONTACT COMPONENT
═══════════════════════════════════════════════════════════ */
const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [errors, setErrors]     = useState<Partial<FormData>>({});
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-10%' });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<FormData> = {};
    if (!formData.fullName.trim()) next.fullName = 'Required';
    if (!formData.email.trim()) next.email = 'Required';
    else if (!EMAIL_REGEX.test(formData.email.trim())) next.email = 'Invalid email';
    if (!formData.message.trim()) next.message = 'Required';
    if (formData.phone && !/^[+0-9()\-\s]*$/.test(formData.phone))
      next.phone = 'Invalid characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    if (!validate()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setStatus('success'); setFormData(EMPTY); }
      else {
        let msg = 'Could not submit. Please try again.';
        try { const d = await res.json(); if (d?.message) msg = d.message; } catch {}
        setErrorMsg(msg);
        setStatus('idle');
      }
    } catch {
      setErrorMsg('Network error — please check your connection.');
      setStatus('idle');
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg,transparent 0%,#070604 4%,#070604 96%,transparent 100%)' }}
    >
      {/* ── Ticker strip ─────────────────────────────────── */}
      <Ticker />

      {/* ── Main layout ──────────────────────────────────── */}
      <div className="relative max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 pb-28">

        {/* Large decorative background number */}
        <div className="pointer-events-none select-none absolute -top-10 right-0 text-[22vw]
          font-display font-black text-zinc-900/30 leading-none tracking-tighter hidden lg:block">
          04
        </div>

        {/* ── TOP: editorial heading ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 pt-4"
        >
          {/* eyebrow */}
          <div className="flex items-center gap-4 mb-7">
            <span className="text-[11px] font-mono font-bold text-amber-500/60 uppercase tracking-[0.25em]">
              04 / Contact
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-zinc-700/60 to-transparent max-w-[120px]" />
          </div>

          {/* Headline — large editorial */}
          <h2 className="font-display font-black text-zinc-100 leading-[0.92] tracking-tight
            text-[clamp(2.8rem,7vw,6.5rem)]">
            Let's build<br />
            <em className="not-italic relative inline-block text-amber-400">
              something
              {/* underline squiggle accent */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 overflow-visible" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M0,8 Q25,0 50,6 Q75,12 100,6 Q125,0 150,6 Q175,12 200,6"
                  stroke="rgba(245,158,11,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </em>
            <br />remarkable.
          </h2>
        </motion.div>

        {/* ── GRID: left panel + form ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 lg:gap-20 items-start relative z-10">

          {/* ── LEFT: Contact info ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-10"
          >
            {/* Subheading copy */}
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-sm font-light">
              Have a branding, engineering, or AI project in mind? Or just want to
              bounce an idea? We review every inquiry personally.
            </p>

            {/* Horizontal rule */}
            <div className="h-px w-full bg-gradient-to-r from-zinc-700/60 to-transparent" />

            {/* Contact details */}
            <div className="flex flex-col gap-7">
              {[
                { icon: Mail,   label: 'Email',         val: 'hello@primenova.studio', href: 'mailto:hello@primenova.studio' },
                { icon: Clock4, label: 'Response',       val: 'Within 24 hours',        href: null },
                { icon: Globe,  label: 'Availability',   val: 'Global · Remote-First',  href: null },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="group flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0">
                    <Icon className="w-4 h-4 text-amber-600/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 mb-1">
                      {label}
                    </p>
                    {href
                      ? <a href={href} className="text-sm font-semibold text-zinc-300 hover:text-amber-400 transition-colors">{val}</a>
                      : <p className="text-sm font-semibold text-zinc-300">{val}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal rule */}
            <div className="h-px w-full bg-gradient-to-r from-zinc-700/60 to-transparent" />

            {/* Socials */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 mb-4">
                Follow Us
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="group flex items-center gap-1.5 text-zinc-600 hover:text-amber-400 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability indicator */}
            <div className="inline-flex items-center gap-2.5 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-xs font-mono text-amber-500/70">
                Available for new work
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT: Form ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {status !== 'success' ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-8"
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FloatingInput id="fullName" label="Full Name" required
                      value={formData.fullName} onChange={(v) => handleChange('fullName', v)}
                      error={errors.fullName} />
                    <FloatingInput id="email" label="Email Address" type="email" required
                      value={formData.email} onChange={(v) => handleChange('email', v)}
                      error={errors.email} />
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FloatingInput id="phone" label="Phone" type="tel"
                      value={formData.phone} onChange={(v) => handleChange('phone', v)}
                      error={errors.phone} />
                    <FloatingInput id="company" label="Company"
                      value={formData.company} onChange={(v) => handleChange('company', v)} />
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FloatingSelect id="projectType" label="Project Type"
                      value={formData.projectType} onChange={(v) => handleChange('projectType', v)}
                      options={PROJECT_TYPES} />
                    <FloatingSelect id="budget" label="Budget Range"
                      value={formData.budget} onChange={(v) => handleChange('budget', v)}
                      options={BUDGET_RANGES} />
                  </div>

                  {/* Subject */}
                  <FloatingInput id="subject" label="Subject"
                    value={formData.subject} onChange={(v) => handleChange('subject', v)}
                    placeholder="Brief project title" />

                  {/* Message */}
                  <FloatingTextarea id="message" label="Tell us about your project" required rows={5}
                    value={formData.message} onChange={(v) => handleChange('message', v)}
                    error={errors.message} />

                  {/* Divider */}
                  <div className="h-px w-full bg-zinc-800/60" />

                  {/* Bottom row: error + button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Error */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.p
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          className="text-xs text-rose-400 flex-1"
                        >{errorMsg}</motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      id="contact-submit-btn"
                      disabled={status === 'loading'}
                      className="group relative ml-auto flex items-center gap-3 px-8 py-4
                        font-display font-bold text-sm tracking-wide overflow-hidden
                        bg-amber-500 text-black rounded-full
                        hover:bg-amber-400 active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-[0_0_32px_-8px_rgba(245,158,11,0.45)]
                        hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.65)]
                        transition-all duration-300"
                    >
                      {/* Shimmer overlay */}
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                        transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent
                        pointer-events-none" />

                      {status === 'loading' ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10.5px] font-mono text-zinc-700 text-right">
                    Strictly confidential · No spam, ever.
                  </p>
                </motion.form>

              ) : (
                /* ── Success State ────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-start gap-8 py-12"
                >
                  {/* Animated check */}
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center
                      shadow-[0_0_48px_rgba(245,158,11,0.35)]"
                  >
                    <CheckIcon className="w-8 h-8 text-black" />
                  </motion.div>

                  <div>
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                      className="text-[11px] font-mono text-amber-500/70 uppercase tracking-[0.2em] mb-3"
                    >
                      Message received
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="font-display font-black text-4xl sm:text-5xl text-zinc-100 leading-tight tracking-tight"
                    >
                      We'll be in<br />touch soon.
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                      className="mt-4 text-sm text-zinc-500 max-w-sm leading-relaxed"
                    >
                      Thank you for reaching out to PrimeNova Studio. We personally review
                      every inquiry and typically respond within 24 hours.
                    </motion.p>
                  </div>

                  <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                    onClick={() => setStatus('idle')}
                    className="text-xs font-mono text-zinc-600 hover:text-amber-400 transition-colors underline underline-offset-4"
                  >
                    ← Send another message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Ticker CSS injected globally via style tag */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
};

export default Contact;
