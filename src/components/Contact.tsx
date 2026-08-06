import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, CheckIcon } from './Icons';
import { API_BASE_URL } from '../config';

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

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
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
      next.phone = 'Phone number contains invalid characters';
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
            const fieldErrors: string[] = Object.values(data.fieldErrors);
            if (fieldErrors.length > 0) detail = fieldErrors[0];
          }
        } catch {
          // keep default message
        }
        setErrorMsg(detail);
        setStatus('idle');
      }
    } catch {
      setErrorMsg('Network error — please check your connection and try again.');
      setStatus('idle');
    }
  };

  const inputClass = (hasError?: string) =>
    `px-4 py-3 rounded-xl bg-foreground/5 dark:bg-white/5 border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors ${
      hasError ? 'border-rose-500/60' : 'border-foreground/10'
    }`;

  return (
    <section id="contact" className="relative w-full max-w-5xl py-24 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start rounded-3xl liquid-glass border border-foreground/10 p-8 sm:p-12 overflow-hidden relative">
        {/* Cinematic light blur in background of card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-rose-500/10 rounded-full blur-[80px] pointer-events-none -z-10" />

        {/* Left column info */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:h-full justify-between">
          <div className="flex flex-col gap-6">
            <div className="text-sm font-semibold tracking-widest text-primary uppercase">
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-display leading-tight text-foreground">
              Let's create momentum.
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed">
              Have a branding, digital engineering, or applied AI project in mind? Or just want to bounce an idea off us? Drop us a line.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-6">
            <div>
              <div className="text-xs font-mono text-muted-foreground/60 uppercase">Direct Email</div>
              <a href="mailto:hello@primenova.studio" className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-300">
                hello@primenova.studio
              </a>
            </div>

            <div>
              <div className="text-xs font-mono text-muted-foreground/60 uppercase mb-3">Connect With Us</div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-105"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right column form */}
        <div className="lg:col-span-7 w-full relative">
          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5 w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="fullName" className="text-xs font-semibold text-foreground/80">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className={inputClass(errors.fullName)}
                    />
                    {errors.fullName && <span className="text-[10px] text-rose-500">{errors.fullName}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={inputClass(errors.email)}
                    />
                    {errors.email && <span className="text-[10px] text-rose-500">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-xs font-semibold text-foreground/80">Phone (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={inputClass(errors.phone)}
                    />
                    {errors.phone && <span className="text-[10px] text-rose-500">{errors.phone}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="text-xs font-semibold text-foreground/80">Company (Optional)</label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className={inputClass()}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="projectType" className="text-xs font-semibold text-foreground/80">Project Type</label>
                    <select
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => handleChange('projectType', e.target.value)}
                      className={`${inputClass()} appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-background">Select a project type...</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-background">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="budget" className="text-xs font-semibold text-foreground/80">Budget</label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleChange('budget', e.target.value)}
                      className={`${inputClass()} appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-background">Select a budget range...</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b} className="bg-background">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-xs font-semibold text-foreground/80">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className={inputClass(errors.subject)}
                  />
                  {errors.subject && <span className="text-[10px] text-rose-500">{errors.subject}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-semibold text-foreground/80">Project Scope / Message *</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className={`${inputClass(errors.message)} resize-none`}
                  />
                  {errors.message && <span className="text-[10px] text-rose-500">{errors.message}</span>}
                </div>

                {errorMsg && (
                  <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="mt-2 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-foreground text-background dark:bg-white dark:text-black font-semibold hover:opacity-90 transition-opacity duration-300 disabled:opacity-75 shadow-md active:scale-95"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border-2 border-background dark:border-black border-t-transparent animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <SendIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center p-8 border border-green-500/20 bg-green-500/5 rounded-3xl min-h-[350px]"
              >
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-black mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground font-display mb-3">
                  Message Sent Successfully
                </h3>
                <p className="text-muted-foreground font-light max-w-sm leading-relaxed">
                  Thank you for contacting PrimeNova Studio. We have received your inquiry and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-sm font-semibold text-primary hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Contact;
