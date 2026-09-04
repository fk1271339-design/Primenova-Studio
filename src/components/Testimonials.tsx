import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Pause, Play, Sparkles, LayoutGrid, Sliders, MousePointerClick } from 'lucide-react';
import { testimonialsData, type Testimonial } from '../data/testimonialsData';

const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Split testimonials into 2 rows for continuous dual infinite marquee
  const row1Data = testimonialsData.slice(0, 6);
  const row2Data = testimonialsData.slice(6, 12);

  const durationRow1 = 55;
  const durationRow2 = 65;

  const projectTypes = ['All', ...Array.from(new Set(testimonialsData.map((t) => t.projectType)))];

  const filteredTestimonials =
    selectedTag === 'All'
      ? testimonialsData
      : testimonialsData.filter((t) => t.projectType === selectedTag);

  const handleDoubleClick = () => {
    setIsPaused((prev) => !prev);
  };

  const renderCard = (item: Testimonial, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${item.id}`}
      className="w-[300px] sm:w-[350px] flex-shrink-0 mx-2.5 my-1.5 cursor-pointer select-none"
      onDoubleClick={handleDoubleClick}
      title="Double click to Pause / Resume"
    >
      <div className="rounded-xl p-4 sm:p-5 border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-[#0c0c0e]/95 backdrop-blur-md">
        {/* Top Gradient Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.avatarBg} opacity-90`} />

        <div>
          {/* Top Row: Rating + Verified Badge */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] font-mono font-bold text-amber-400 ml-1">5.0</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              Verified
            </div>
          </div>

          {/* Highlight Title */}
          <h3 className="text-xs sm:text-sm font-bold text-zinc-100 font-display line-clamp-1 leading-snug group-hover:text-amber-400 transition-colors">
            "{item.highlight}"
          </h3>

          {/* Review Text - Compact & Readable */}
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed font-normal italic line-clamp-3">
            "{item.review}"
          </p>
        </div>

        {/* Footer: Category & Client Info */}
        <div className="mt-4 pt-3 border-t border-zinc-800/70">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-2 py-0.5 rounded bg-zinc-900 text-amber-400/90 border border-amber-500/20 text-[9px] font-mono font-medium uppercase tracking-wider">
              {item.projectType}
            </span>
            <span className="text-[9px] font-mono text-zinc-500">{item.date}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.avatarBg} p-0.5 shadow flex-shrink-0`}>
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-bold font-display text-[10px] text-white">
                {item.avatar}
              </div>
            </div>

            <div className="min-w-0">
              <h4 className="text-xs font-bold text-zinc-100 truncate font-display group-hover:text-amber-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate">
                {item.role} • <span className="text-zinc-300">{item.company}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="w-full py-16 relative overflow-hidden bg-black/40">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono font-bold uppercase tracking-widest mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          CLIENT REVIEWS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-zinc-100 tracking-tight"
        >
          Trusted by Visionary{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            Founders & Engineers
          </span>
        </motion.h2>

        {/* Toolbar Controls */}
        <div className="mt-5 flex items-center justify-center flex-wrap gap-3">
          {/* Mode Switcher */}
          <div className="inline-flex items-center p-1 rounded-full bg-zinc-900/90 border border-zinc-800">
            <button
              onClick={() => setViewMode('marquee')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'marquee'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3 h-3" />
              Carousel
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              All ({testimonialsData.length})
            </button>
          </div>

          {/* Marquee Pause/Play status & Double-Click Hint */}
          {viewMode === 'marquee' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-xs font-mono text-amber-400 cursor-pointer transition-all"
              >
                {isPaused ? <Play className="w-3 h-3 fill-amber-400" /> : <Pause className="w-3 h-3" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-900/50 px-2.5 py-1 rounded-full border border-zinc-800/60">
                <MousePointerClick className="w-3 h-3 text-amber-400" />
                Double-click card to {isPaused ? 'resume' : 'pause'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CONTINUOUS MARQUEE CAROUSEL MODE */}
      {viewMode === 'marquee' ? (
        <div
          className="relative w-full overflow-hidden py-2"
          onDoubleClick={handleDoubleClick}
        >
          {/* Side Fade Gradients */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#070709] via-[#070709]/80 to-transparent z-10" />

          {/* Pause Status Indicator */}
          {isPaused && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-mono font-bold shadow-md flex items-center gap-1 pointer-events-none">
              <Pause className="w-2.5 h-2.5 fill-black" /> Carousel Paused (Double Clicked)
            </div>
          )}

          {/* ROW 1: Running Right to Left */}
          <div className="flex w-full mb-1">
            <div
              className="animate-marquee-left"
              style={{
                animationDuration: `${durationRow1}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {[...row1Data, ...row1Data, ...row1Data].map((item, idx) =>
                renderCard(item, `row1-${idx}`)
              )}
            </div>
          </div>

          {/* ROW 2: Running Left to Right */}
          <div className="flex w-full">
            <div
              className="animate-marquee-right"
              style={{
                animationDuration: `${durationRow2}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {[...row2Data, ...row2Data, ...row2Data].map((item, idx) =>
                renderCard(item, `row2-${idx}`)
              )}
            </div>
          </div>
        </div>
      ) : (
        /* GRID MODE (VIEW ALL) */
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center flex-wrap gap-1.5 mb-6">
            {projectTypes.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredTestimonials.map((item) => (
              <div key={item.id} className="w-full">
                {renderCard(item, 'grid')}
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
