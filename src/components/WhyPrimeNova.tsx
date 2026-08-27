import React from 'react';
import { motion } from 'framer-motion';

const reasons = [
  {
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zM4 7a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V7zM18 7a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 15h16M4 19h16" />
      </svg>
    ),
    title: 'Design + Engineering Synthesis',
    description: 'We eliminate the friction between creative vision and code logic. Designers write CSS, engineers build design tokens.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Performance-First Standards',
    description: 'Sub-second load times, dynamic bundle splitting, and zero render layout shifts for maximum user conversion.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: 'Scalable Architecture',
    description: 'Modular React design systems paired with robust Spring Boot / MongoDB backends designed for enterprise volume.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Ready Integrations',
    description: 'Direct integration of LLM endpoints, custom cognitive RAG agents, and intelligent automated workflows.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Fluid Responsive UX',
    description: 'Tested across 320px to 4K resolutions with custom breakpoints, adaptive touch interactions, and fluid typography.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Transparent Communication',
    description: 'Weekly sprint demos, real-time shared communication channels, and clear milestone progress tracking.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Long-Term SLA Support',
    description: 'Post-launch maintenance, security audits, cloud deployment monitoring, and continuous product iteration.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Security-Conscious Infrastructure',
    description: 'Spring Security JWT protection, input sanitization against XSS/Injection, and encrypted MongoDB storage.',
  },
];

const WhyPrimeNova: React.FC = () => {
  return (
    <section id="why-us" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase"
        >
          THE PRIMENOVA ADVANTAGE
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl sm:text-5xl font-bold font-display mt-4 leading-tight text-foreground"
        >
          Why leading visionaries partner with PrimeNova Studio.
        </motion.h2>
        <p className="text-muted-foreground font-light mt-4 text-base leading-relaxed">
          We combine agency-grade creativity with software engineering rigor to turn ambitious ideas into digital reality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.08, duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="p-6 rounded-3xl liquid-glass border border-foreground/10 flex flex-col justify-between group hover:border-amber-400/30 transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-foreground font-display mb-3 group-hover:text-amber-400 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyPrimeNova;
