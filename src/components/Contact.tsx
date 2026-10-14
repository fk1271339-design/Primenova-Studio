import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, CheckIcon } from './Icons';
import { API_BASE_URL } from '../config';
import { ArrowRight, Clock, Mail, MapPin, Phone, Sparkles, Zap } from 'lucide-react';

/* ── Constants ──────────────────────────────────────────── */
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIAL_LINKS = [
  { href: 'https://github.com',    Icon: GithubIcon,   label: 'GitHub'    },
  { href: 'https://linkedin.com',  Icon: LinkedinIcon, label: 'LinkedIn'  },
  { href: 'https://twitter.com',   Icon: TwitterIcon,  label: 'Twitter'   },
  { href: 'https://instagram.com', Icon: InstagramIcon,label: 'Instagram' },
];

const INFO_ITEMS = [
  { Icon: Mail,    label: 'Email Us',       value: 'hello@primenova.studio', href: 'mailto:hello@primenova.studio' },
  { Icon: Clock,   label: 'Response Time',  value: 'Within 24 hours',        href: null },
  { Icon: MapPin,  label: 'Based In',       value: 'Global · Remote-First',  href: null },
  { Icon: Phone,   label: 'Call / WhatsApp',value: '+91 98765 43210',        href: 'tel:+919876543210' },
];

/* ── Types ──────────────────────────────────────────────── */
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

const EMPTY_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  budget: '',
  subject: '',
  message: '',
};

/* ── Shared input styles ─────────────────────────────────── */
const inputBase =
  'w-full px-4 py-3 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 ' +
  'bg-zinc-900/70 border border-zinc-800/80 ' +
  'focus:outline-none focus:border-amber-600/60 focus:ring-2 focus:ring-amber-600/15 ' +
  'hover:border-zinc-700/80 transition-all duration-200 backdrop-blur-sm';

const inputError = 'border-rose-500/60 focus:border-rose-500/60 focus:ring-rose-500/10';

/* ── Field wrapper ──────────────────────────────────────── */
const Field: React.FC<{
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, id, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
      {label}
      {required && <span className="text-amber-500 ml-0.5">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-[10.5px] text-rose-400 font-medium"
        >
          {error}
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors]     = useState<Partial<FormData>>({});
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<FormData> = {};
    if (!formData.fullName.trim()) next.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      next.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      next.email = 'Enter a valid email address';
    }
    if (!formData.message.trim()) next.message = 'Message is required';
    if (formData.phone && !/^[+0-9()\-\s]*$/.test(formData.phone)) {
      next.phone = 'Invalid characters in phone number';
    }
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
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData(EMPTY_FORM);
      } else {
        let detail = 'Could not submit your inquiry. Please try again later.';
        try {
          const data = await response.json();
          if (data?.message) detail = data.message;
          if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
            const fe: string[] = Object.values(data.fieldErrors);
            if (fe.length > 0) detail = fe[0];
          }
        } catch { /* keep default */ }
        setErrorMsg(detail);
        setStatus('idle');
      }
    } catch {
      setErrorMsg('Network error — please check your connection.');
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="relative w-full py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">

      {/* ── Background decoration ─────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full
          bg-amber-700/5 blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full
          bg-amber-900/6 blur-[100px]" />
        {/* Top border fade */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px
          bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Section Header ────────────────────────────────── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span className="hidden sm:block w-10 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
            <span className="text-[11px] font-mono font-bold text-amber-500/70 uppercase tracking-[0.2em]">
              Start a Conversation
            </span>
            <span className="hidden sm:block w-10 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-zinc-100 tracking-tight leading-tight"
          >
            Let's create{' '}
            <span className="relative inline-block text-amber-400">
              momentum
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full
                bg-gradient-to-r from-amber-600/0 via-amber-500/70 to-amber-600/0" />
            </span>
            .
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed"
          >
            Have a project in mind — web, mobile, AI, or branding? Drop us a line and we'll
            get back to you within 24 hours.
          </motion.p>
        </div>

        {/* ── Main Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT: Info panel ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit
              bg-amber-500/8 border border-amber-700/25">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono text-amber-400/80 font-medium">
                Available for new projects
              </span>
            </div>

            {/* Info cards */}
            <div className="flex flex-col gap-3">
              {INFO_ITEMS.map(({ Icon, label, value, href }) => (
                <div key={label}
                  className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800/60
                    bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700/60
                    hover:bg-zinc-900/80 transition-all duration-300 group"
                >
                  <div className="mt-0.5 w-8 h-8 flex-shrink-0 rounded-lg bg-amber-500/10 border border-amber-700/20
                    flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-500/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-mono text-zinc-600 uppercase tracking-widest mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a href={href}
                        className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors duration-200 truncate block">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-zinc-300 truncate">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-[10.5px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center
                      border border-zinc-800/70 bg-zinc-900/60 text-zinc-500
                      hover:border-amber-700/50 hover:bg-zinc-800/80 hover:text-amber-400
                      transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick-response promise */}
            <div className="mt-2 p-4 rounded-xl border border-amber-700/20 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-400">Fast Response Guarantee</span>
              </div>
              <p className="text-[11.5px] text-zinc-500 leading-relaxed">
                We review every inquiry personally and respond within 24 hours — often much faster.
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT: Form panel ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-8"
          >
            <div className="relative rounded-2xl border border-zinc-800/70 overflow-hidden
              bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 backdrop-blur-sm
              shadow-[0_0_60px_-20px_rgba(0,0,0,0.8)]">

              {/* Top inner glow */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-px
                bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
              <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2
                w-48 h-32 bg-amber-600/6 rounded-full blur-3xl" />

              <AnimatePresence mode="wait">
                {status !== 'success' ? (
                  /* ── FORM ──────────────────────────────────── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-7 sm:p-9 flex flex-col gap-5"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-500/70" />
                      <span className="text-xs font-mono text-zinc-500">New project inquiry</span>
                    </div>

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name" id="fullName" required error={errors.fullName}>
                        <input
                          type="text"
                          id="fullName"
                          placeholder="John Smith"
                          value={formData.fullName}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          className={`${inputBase} ${errors.fullName ? inputError : ''}`}
                        />
                      </Field>
                      <Field label="Email Address" id="email" required error={errors.email}>
                        <input
                          type="email"
                          id="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className={`${inputBase} ${errors.email ? inputError : ''}`}
                        />
                      </Field>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Phone" id="phone" error={errors.phone}>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className={`${inputBase} ${errors.phone ? inputError : ''}`}
                        />
                      </Field>
                      <Field label="Company" id="company">
                        <input
                          type="text"
                          id="company"
                          placeholder="Your company name"
                          value={formData.company}
                          onChange={(e) => handleChange('company', e.target.value)}
                          className={inputBase}
                        />
                      </Field>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Project Type" id="projectType">
                        <select
                          id="projectType"
                          value={formData.projectType}
                          onChange={(e) => handleChange('projectType', e.target.value)}
                          className={`${inputBase} appearance-none cursor-pointer`}
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="">Select a type...</option>
                          {PROJECT_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Budget Range" id="budget">
                        <select
                          id="budget"
                          value={formData.budget}
                          onChange={(e) => handleChange('budget', e.target.value)}
                          className={`${inputBase} appearance-none cursor-pointer`}
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="">Select a range...</option>
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    {/* Subject */}
                    <Field label="Subject" id="subject">
                      <input
                        type="text"
                        id="subject"
                        placeholder="Brief project title or topic"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className={inputBase}
                      />
                    </Field>

                    {/* Message */}
                    <Field label="Message / Project Scope" id="message" required error={errors.message}>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        className={`${inputBase} resize-none`}
                        style={{ minHeight: '110px' }}
                      />
                    </Field>

                    {/* Error message */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="px-4 py-3 rounded-xl bg-rose-500/8 border border-rose-500/25 text-rose-400 text-xs"
                        >
                          {errorMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      id="contact-submit-btn"
                      disabled={status === 'loading'}
                      className="group relative mt-1 flex items-center justify-center gap-2.5 w-full py-4 rounded-xl
                        font-semibold text-sm text-black bg-amber-500
                        hover:bg-amber-400 active:scale-[0.98]
                        disabled:opacity-60 disabled:cursor-not-allowed
                        shadow-[0_4px_20px_-4px_rgba(245,158,11,0.4)]
                        hover:shadow-[0_4px_28px_-4px_rgba(245,158,11,0.6)]
                        transition-all duration-250 overflow-hidden"
                    >
                      {/* Animated shimmer overlay */}
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700
                        bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                      {status === 'loading' ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-black/40 border-t-black animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[10.5px] text-zinc-600">
                      No spam. Your information is kept strictly confidential.
                    </p>
                  </motion.form>
                ) : (
                  /* ── SUCCESS STATE ─────────────────────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 flex flex-col items-center justify-center text-center min-h-[460px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center
                        shadow-[0_0_40px_rgba(245,158,11,0.35)] mb-8"
                    >
                      <CheckIcon className="w-10 h-10 text-black" />
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-2xl sm:text-3xl font-display font-black text-zinc-100 mb-3"
                    >
                      Message received!
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-sm text-zinc-500 max-w-sm leading-relaxed mb-8"
                    >
                      Thank you for reaching out to PrimeNova Studio. We review every inquiry
                      personally and will respond within 24 hours.
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setStatus('idle')}
                      className="text-xs font-mono text-amber-500 hover:text-amber-400 underline
                        underline-offset-4 transition-colors"
                    >
                      Send another message →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
