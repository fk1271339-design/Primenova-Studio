import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import type { Skill } from '../../data/portfolioData';

const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps & Tools'] as const;

const PortfolioSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredSkills = activeCategory === 'All'
    ? portfolioData.skills
    : portfolioData.skills.filter((s) => s.category === activeCategory);

  const getTechBadge = (name: string) => {
    switch (name.toLowerCase()) {
      case 'java':
        return { short: 'JAVA', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
      case 'spring boot':
        return { short: 'BOOT', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
      case 'react':
        return { short: 'REACT', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' };
      case 'typescript':
        return { short: 'TS', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
      case 'javascript':
        return { short: 'JS', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' };
      case 'tailwind css':
        return { short: 'CSS', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' };
      case 'node.js':
        return { short: 'NODE', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
      case 'mongodb':
        return { short: 'MONGO', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
      case 'postgresql':
        return { short: 'POSTGRES', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' };
      case 'docker':
        return { short: 'DOCKER', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' };
      default:
        return { short: name.substring(0, 4).toUpperCase(), color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' };
    }
  };

  const row1 = portfolioData.skills.slice(0, 8);
  const row2 = portfolioData.skills.slice(8);

  const renderSkillCard = (skill: Skill, key: string) => {
    const badge = getTechBadge(skill.name);
    return (
      <div
        key={key}
        className="w-[200px] p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.07] transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:-translate-y-1 group"
      >
        <div className={`px-3 py-1 rounded-lg border text-[11px] font-mono font-bold tracking-widest mb-3 ${badge.color} group-hover:scale-105 transition-transform`}>
          {badge.short}
        </div>
        <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
          {skill.name}
        </span>
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mt-1">
          {skill.category}
        </span>
      </div>
    );
  };

  return (
    <section id="skills" className="relative py-24 px-6 md:px-12 lg:px-16 bg-[#08080a] text-white overflow-hidden border-t border-white/10">
      {/* Soft Ambient Glows */}
      <div className="glow-orb-amber top-1/3 left-1/4 opacity-20 pointer-events-none"></div>
      <div className="glow-orb-purple bottom-10 right-1/4 opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-amber-500/30">03</span>
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-[0.25em] text-amber-400 uppercase font-semibold">
                MY SKILLS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-white mt-1">
                Technologies I <span className="text-amber-400">work with</span>
              </h2>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeCategory === 'All' ? (
        /* WebNex-Style Translucent Running Marquee Rows */
        <div className="space-y-6 overflow-hidden">
          {/* Row 1: Left moving infinite ticker */}
          <div className="animate-marquee-left flex items-center gap-5">
            {[...row1, ...row1, ...row1].map((skill: Skill, idx: number) =>
              renderSkillCard(skill, `row1-${skill.name}-${idx}`)
            )}
          </div>

          {/* Row 2: Right moving infinite ticker */}
          <div className="animate-marquee-right flex items-center gap-5">
            {[...row2, ...row2, ...row2].map((skill: Skill, idx: number) =>
              renderSkillCard(skill, `row2-${skill.name}-${idx}`)
            )}
          </div>
        </div>
      ) : (
        /* Filtered Translucent Grid View */
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filteredSkills.map((skill: Skill) => {
            const badge = getTechBadge(skill.name);
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.07] transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:-translate-y-1 group"
              >
                <div className={`px-3 py-1 rounded-lg border text-[11px] font-mono font-bold tracking-widest mb-3 ${badge.color} group-hover:scale-105 transition-transform`}>
                  {badge.short}
                </div>
                <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {skill.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mt-1">
                  {skill.category}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PortfolioSkills;
