import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import AnimatedCounter from '../AnimatedCounter';
import { CheckIcon, DownloadIcon } from '../Icons';

const PortfolioAbout: React.FC = () => {
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = portfolioData.cvPath;
    link.download = 'Faiz_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 lg:px-16 bg-[#07080c] text-white overflow-hidden border-t border-white/10">
      {/* Ambient background glow */}
      <div className="glow-orb-blue top-1/2 -left-40 opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header with Number 02 */}
        <div className="flex items-center gap-4 mb-12">
          <span className="font-mono text-3xl sm:text-4xl font-bold text-blue-500/40">02</span>
          <div className="flex flex-col">
            <span className="text-xs font-mono tracking-[0.25em] text-blue-400 uppercase font-semibold">
              ABOUT ME
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white mt-1">
              Get to know <span className="text-blue-400">me</span>
            </h2>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bio & Traits */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="space-y-4 text-zinc-300 text-base md:text-lg font-light leading-relaxed">
              {portfolioData.bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Bullet Traits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4"
            >
              {portfolioData.traits.map((trait, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-zinc-200">{trait}</span>
                </div>
              ))}
            </motion.div>

            {/* Download CV CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4"
            >
              <button
                onClick={handleDownloadCV}
                className="btn-magnetic px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] inline-flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download CV
              </button>
            </motion.div>
          </div>

          {/* Right Column: Key Metrics Cards & Interactive Highlights */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {portfolioData.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
              >
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-white group-hover:text-blue-400 transition-colors flex items-center">
                  <AnimatedCounter value={stat.num} />
                  <span className="text-blue-500 ml-1">{stat.suffix}</span>
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-4">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioAbout;
