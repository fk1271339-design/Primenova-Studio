import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import type { ExperienceItem } from '../../data/portfolioData';

const PortfolioExperience: React.FC = () => {
  return (
    <section id="experience" className="relative py-24 px-6 md:px-12 lg:px-16 bg-[#07080c] text-white overflow-hidden border-t border-white/10">
      {/* Glow Orbs */}
      <div className="glow-orb-purple top-1/2 left-10 opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-blue-500/40">05</span>
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-[0.25em] text-blue-400 uppercase font-semibold">
                MY JOURNEY
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white mt-1">
                Experience <span className="text-blue-400">Timeline</span>
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-xs">
            My professional career path and key engineering roles.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 md:pl-0">
          {/* Vertical Connecting Line (Mobile & Desktop) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transform -translate-x-1/2"></div>

          <div className="space-y-12 md:space-y-16 relative z-10">
            {portfolioData.experiences.map((item: ExperienceItem, idx: number) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={`flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card Side */}
                  <div className="w-full md:w-1/2 pl-8 md:pl-0 md:px-8">
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-blue-500/40 transition-all shadow-xl group">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                          {item.period}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          {item.company}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-blue-400 transition-colors">
                        {item.role}
                      </h3>

                      <p className="text-xs sm:text-sm text-zinc-300 font-light mt-3 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                        {item.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-zinc-400"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Central Node Indicator */}
                  <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#07080c] border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)] z-20">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                  </div>

                  {/* Empty Spacer Side */}
                  <div className="hidden md:block w-1/2"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioExperience;
