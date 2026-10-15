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
    <section id="about" className="relative py-24 px-6 md:px-12 lg:px-16 bg-[#07080c] text-white overflow-hidden border-t border-white/[0.06]">
      {/* Ambient background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '-10%',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 mb-14"
        >
          <span className="font-classic italic text-4xl sm:text-5xl font-light text-amber-400/30">02</span>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono tracking-[0.3em] text-amber-400 uppercase font-medium">
              About Me
            </span>
            <h2 className="font-classic text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-1">
              Get to know <span className="italic text-amber-300">me</span>
            </h2>
          </div>
          <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-amber-400/20 to-transparent ml-4" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Bio & Traits */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Bio paragraphs with left gold border */}
            <div className="space-y-5 border-l-2 border-amber-400/20 pl-6">
              {portfolioData.bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-zinc-300 text-base md:text-lg font-light leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Traits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4"
            >
              {portfolioData.traits.map((trait, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/30 hover:bg-amber-400/[0.04] transition-all duration-300 group"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:bg-amber-400/20 transition-colors">
                    <CheckIcon className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-zinc-200 group-hover:text-amber-100 transition-colors">{trait}</span>
                </div>
              ))}
            </motion.div>

            {/* Download CV */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-2"
            >
              <button
                onClick={handleDownloadCV}
                className="group px-7 py-3.5 rounded-full bg-white/[0.04] border border-amber-400/30 text-amber-300 font-semibold text-sm hover:bg-amber-400/10 hover:border-amber-400/60 transition-all duration-300 shadow-[0_0_20px_rgba(212,168,83,0.1)] hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] inline-flex items-center gap-2.5"
              >
                <DownloadIcon className="w-4 h-4" />
                Download CV
              </button>
            </motion.div>
          </div>

          {/* Right Column: Stats Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {portfolioData.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-[#0f1017] border border-white/[0.06] hover:border-amber-400/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* top-left corner accent */}
                <div className="absolute top-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400/60 to-transparent rounded-full" />

                <span className="text-3xl sm:text-4xl font-extrabold font-display text-white group-hover:text-amber-400 transition-colors duration-300 flex items-center">
                  <AnimatedCounter value={stat.num} />
                  <span className="text-amber-400 ml-1">{stat.suffix}</span>
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 mt-4">
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
