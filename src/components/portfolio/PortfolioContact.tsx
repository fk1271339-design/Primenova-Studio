import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { API_BASE_URL } from '../../config';
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon, CheckIcon } from '../Icons';

const PortfolioContact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          subject: formData.subject || 'Portfolio Inquiry for Faiz',
          message: formData.message,
          projectType: 'Engineering Project',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ fullName: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg('Failed to send message. Please try again or email directly.');
      }
    } catch {
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 lg:px-16 bg-[#07080c] text-white overflow-hidden border-t border-white/10">
      {/* Background Ambient Effects */}
      <div className="glow-orb-blue top-1/3 left-0 opacity-30 pointer-events-none"></div>
      <div className="glow-orb-purple bottom-0 right-0 opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-blue-500/40">06</span>
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-[0.25em] text-blue-400 uppercase font-semibold">
                LET'S CONNECT
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white mt-1">
                Let's work <span className="text-blue-400">together</span>
              </h2>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-xs">
              Have a project in mind or want to talk software engineering? Reach out directly.
            </p>
            <a
              href="/contact"
              className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
            >
              Go to PrimeNova Contact Page ↗
            </a>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Globe Network Visual */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-display text-white">
                Contact Details
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Feel free to send a message using the form or connect directly through email or social platforms.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href={`mailto:${portfolioData.contact.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">EMAIL ME</span>
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {portfolioData.contact.email}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${portfolioData.contact.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">PHONE</span>
                    <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                      {portfolioData.contact.phone}
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">LOCATION</span>
                    <span className="text-sm font-bold text-white">
                      {portfolioData.contact.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Globe Network Illustration */}
            <div className="relative w-full aspect-square max-w-[280px] mx-auto opacity-70">
              <svg viewBox="0 0 200 200" className="w-full h-full text-blue-500 animate-spin-slow">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                <circle cx="100" cy="100" r="4" fill="#3b82f6" />
                <circle cx="140" cy="70" r="3" fill="#8b5cf6" />
                <circle cx="60" cy="130" r="3" fill="#3b82f6" />
              </svg>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 shadow-2xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <CheckIcon className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold font-display text-white">Message Sent Successfully!</h4>
                  <p className="text-sm text-zinc-400 font-light max-w-md">
                    Thank you for reaching out, Faiz will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-white hover:bg-white/20 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                        YOUR EMAIL *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry / Engineering Roles"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                      YOUR MESSAGE *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell me about your project requirements or how I can help..."
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-magnetic w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Send Message
                        <SendIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioContact;
