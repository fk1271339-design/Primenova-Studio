import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, Pause, Play, Quote, LayoutGrid, Rows2 } from 'lucide-react';
import { testimonialsData, type Testimonial } from '../data/testimonialsData';

/* ── Stat strip data ────────────────────────────────────── */
const STATS = [
  { value: '98%', label: 'Client Satisfaction' },
  { value: '12+', label: 'Reviews' },
  { value: '4.9', label: 'Avg. Rating' },
  { value: '100%', label: 'On-Time Delivery' },
];

/* ── Single testimonial card ────────────────────────────── */
const TestimonialCard: React.FC<{ item: Testimonial; compact?: boolean }> = ({
  item,
  compact = false,
}) => (
  <div
    className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-800/70
      bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 backdrop-blur-sm
      hover:border-amber-700/50 hover:shadow-[0_8px_40px_-8px_rgba(180,100,20,0.18)]
      transition-all duration-500 ease-out select-none
      ${compact ? 'p-5' : 'p-6 sm:p-7'}`}
  >
    {/* Subtle inner glow on hover */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
      bg-[radial-gradient(ellipse_at_top_left,rgba(180,100,20,0.06),transparent_60%)]" />

    {/* Top: Stars + Badge */}
    <div className="flex items-center justify-between mb-4">
      {/* Stars */}
      <div className="flex items-center gap-[3px]">
        {[...Array(item.rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
        ))}
      </div>

      {/* Verified */}
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/6 border border-amber-700/20 text-amber-500/70 text-[10px] font-medium tracking-wide">
        <CheckCircle2 className="w-3 h-3" />
        <span>Verified</span>
      </div>
    </div>

    {/* Large Decorative Quote */}
    <Quote
      className="absolute top-4 right-5 w-10 h-10 text-amber-600/8 rotate-180 pointer-events-none"
      strokeWidth={1}
    />

    {/* Highlight headline */}
    <h3
      className={`font-display font-bold text-zinc-100 leading-snug mb-2.5
        group-hover:text-amber-300 transition-colors duration-300
        ${compact ? 'text-sm' : 'text-base sm:text-[1.05rem]'}`}
    >
      "{item.highlight}"
    </h3>

    {/* Review body */}
    <p className={`text-zinc-400 leading-relaxed font-normal italic flex-1
      ${compact ? 'text-[11.5px] line-clamp-3' : 'text-[12.5px] line-clamp-4'}`}>
      {item.review}
    </p>

    {/* Divider */}
    <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

    {/* Footer: Avatar + Project tag */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar circle */}
        <div className={`flex-shrink-0 rounded-full bg-gradient-to-br ${item.avatarBg}
          flex items-center justify-center font-display font-bold text-zinc-100 shadow-inner
          ${compact ? 'w-8 h-8 text-[10px]' : 'w-9 h-9 text-xs'}`}>
          {item.avatar}
        </div>

        <div className="min-w-0">
          <h4 className={`font-display font-semibold text-zinc-200 truncate leading-none
            ${compact ? 'text-xs' : 'text-sm'}`}>
            {item.name}
          </h4>
          <p className="text-[10.5px] text-zinc-500 truncate mt-0.5">
            {item.role} &bull; <span className="text-zinc-400">{item.company}</span>
          </p>
        </div>
      </div>

      <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/40
        text-[9px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:block text-right leading-tight max-w-[90px] line-clamp-2">
        {item.projectType}
      </span>
    </div>
  </div>
);

/* ── Marquee Row ────────────────────────────────────────── */
const MarqueeRow: React.FC<{
  data: Testimonial[];
  direction: 'left' | 'right';
  duration: number;
  paused: boolean;
  onDoubleClick: () => void;
}> = ({ data, direction, duration, paused, onDoubleClick }) => (
  <div className="flex w-full overflow-hidden" onDoubleClick={onDoubleClick}>
    <div
      className={direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}
      style={{
        animationDuration: `${duration}s`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      {[...data, ...data, ...data].map((item, idx) => (
        <div
          key={`${direction}-${idx}-${item.id}`}
          className="w-[300px] sm:w-[360px] flex-shrink-0 mx-2.5 my-2"
        >
          <TestimonialCard item={item} compact />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const row1 = testimonialsData.slice(0, 6);
  const row2 = testimonialsData.slice(6, 12);

  const projectTypes = ['All', ...Array.from(new Set(testimonialsData.map((t) => t.projectType)))];
  const filtered =
    selectedTag === 'All'
      ? testimonialsData
      : testimonialsData.filter((t) => t.projectType === selectedTag);

  const featured = testimonialsData[0];

  return (
    <section
      id="testimonials"
      className="relative w-full py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #09080700 0%, #0a0906 6%, #0a0906 94%, #09080700 100%)' }}
    >
      {/* ── Ambient background orbs ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[320px]
          bg-amber-700/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px]
          bg-amber-900/8 rounded-full blur-[100px]" />
        {/* Decorative ruled lines */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-zinc-800/40 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-zinc-800/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── Section label + Heading ───────────────────────── */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            {/* Ruled lines + label */}
            <span className="hidden sm:block w-12 h-px bg-gradient-to-r from-transparent to-amber-600/60" />
            <span className="text-[11px] font-mono font-bold text-amber-500/80 uppercase tracking-[0.2em]">
              Client Stories
            </span>
            <span className="hidden sm:block w-12 h-px bg-gradient-to-l from-transparent to-amber-600/60" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-zinc-100 tracking-tight leading-tight"
          >
            Trusted by{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-amber-400">Visionaries</span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full
                bg-gradient-to-r from-amber-600/0 via-amber-500/70 to-amber-600/0" />
            </span>
            {' '}&amp; Engineers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed"
          >
            Real results from real partnerships — every review earned through craft, speed, and commitment.
          </motion.p>
        </div>

        {/* ── Stat Strip ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-14 rounded-2xl overflow-hidden border border-zinc-800/60"
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-5 px-4
                bg-zinc-900/60 backdrop-blur-sm
                hover:bg-zinc-800/60 transition-colors duration-300"
            >
              <span className="text-2xl sm:text-3xl font-display font-black text-amber-400 leading-none tracking-tight">
                {s.value}
              </span>
              <span className="mt-1 text-[10.5px] font-medium text-zinc-500 uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Featured Spotlight Card ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 relative rounded-2xl border border-amber-700/30 overflow-hidden
            bg-gradient-to-br from-zinc-900 via-zinc-950 to-black
            shadow-[0_0_60px_-20px_rgba(180,100,20,0.25)]"
        >
          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-40 h-40
            bg-[radial-gradient(circle_at_top_left,rgba(180,100,20,0.12),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40
            bg-[radial-gradient(circle_at_bottom_right,rgba(180,100,20,0.08),transparent_70%)] pointer-events-none" />

          <div className="relative p-8 sm:p-10 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            {/* Giant quote icon */}
            <div className="hidden lg:flex flex-shrink-0 w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-600/20 items-center justify-center">
              <Quote className="w-8 h-8 text-amber-500/60" strokeWidth={1.5} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                ))}
                <span className="ml-2 text-xs font-mono text-amber-500/80 font-semibold">5.0</span>
                <span className="ml-auto flex items-center gap-1 text-[11px] text-amber-500/60 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Client
                </span>
              </div>

              <blockquote className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-zinc-100
                leading-snug tracking-tight mb-5">
                "{featured.highlight}"
              </blockquote>

              <p className="text-[13px] sm:text-sm text-zinc-400 leading-relaxed italic mb-6 max-w-2xl">
                {featured.review}
              </p>

              {/* Client info */}
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${featured.avatarBg} flex-shrink-0
                  flex items-center justify-center font-display font-bold text-sm text-zinc-100 shadow-lg`}>
                  {featured.avatar}
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-zinc-200">{featured.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{featured.role} &bull; {featured.company}</p>
                </div>
                <span className="ml-auto hidden sm:block px-3 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/40
                  text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  {featured.projectType}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── View Toggle + Controls ────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          {/* Left: mode toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900/80 border border-zinc-800/80 gap-0.5">
            <button
              onClick={() => setViewMode('marquee')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200
                ${viewMode === 'marquee'
                  ? 'bg-amber-500/90 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Rows2 className="w-3 h-3" />
              Live Feed
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200
                ${viewMode === 'grid'
                  ? 'bg-amber-500/90 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <LayoutGrid className="w-3 h-3" />
              All {testimonialsData.length}
            </button>
          </div>

          {/* Right: Pause/Play (marquee only) */}
          {viewMode === 'marquee' && (
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800
                hover:border-amber-700/50 text-xs font-mono text-zinc-400 hover:text-amber-400
                cursor-pointer transition-all duration-200"
            >
              {isPaused
                ? <><Play className="w-3 h-3 fill-amber-400 text-amber-400" /> Resume</>
                : <><Pause className="w-3 h-3" /> Pause</>}
            </button>
          )}
        </div>
      </div>

      {/* ── Marquee Mode ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {viewMode === 'marquee' && (
          <motion.div
            key="marquee"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="relative w-full overflow-hidden"
          >
            {/* Side fade masks */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-40 z-10
              bg-gradient-to-r from-[#0a0906] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-40 z-10
              bg-gradient-to-l from-[#0a0906] to-transparent" />

            {/* Paused indicator */}
            {isPaused && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5
                px-4 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-mono font-bold
                shadow-lg pointer-events-none">
                <Pause className="w-2.5 h-2.5 fill-black" /> Paused — Double-click to resume
              </div>
            )}

            <MarqueeRow data={row1} direction="left" duration={55} paused={isPaused} onDoubleClick={() => setIsPaused(p => !p)} />
            <MarqueeRow data={row2} direction="right" duration={68} paused={isPaused} onDoubleClick={() => setIsPaused(p => !p)} />
          </motion.div>
        )}

        {/* ── Grid Mode ──────────────────────────────────── */}
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10"
          >
            {/* Tag filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {projectTypes.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium tracking-wide cursor-pointer transition-all duration-200
                    ${selectedTag === tag
                      ? 'bg-amber-500/90 text-black font-semibold shadow-sm'
                      : 'bg-zinc-900/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'}`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Masonry-style 3-col grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -8 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <TestimonialCard item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom subtle rule ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>
    </section>
  );
};

export default Testimonials;
