import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Pause, Play, Sparkles, Quote, Gauge, LayoutGrid, Sliders } from 'lucide-react';
import { testimonialsData, type Testimonial } from '../data/testimonialsData';

const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('slow');
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Split testimonials into 2 rows for dual continuous infinite marquee
  const row1Data = testimonialsData.slice(0, 6);
  const row2Data = testimonialsData.slice(6, 12);

  // Get speed duration in seconds based on state
  const getDuration = (baseSeconds: number) => {
    if (speed === 'slow') return baseSeconds * 1.6;
    if (speed === 'fast') return baseSeconds * 0.6;
    return baseSeconds;
  };

  const durationRow1 = getDuration(55);
  const durationRow2 = getDuration(65);

  // Extract unique project types for filtering in grid mode
  const projectTypes = ['All', ...Array.from(new Set(testimonialsData.map((t) => t.projectType)))];

  const filteredTestimonials =
    selectedTag === 'All'
      ? testimonialsData
      : testimonialsData.filter((t) => t.projectType === selectedTag);

  const renderCard = (item: Testimonial, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${item.id}`}
      className="w-[340px] sm:w-[400px] flex-shrink-0 mx-3 my-2"
    >
      <div className="liquid-glass rounded-2xl p-6 sm:p-7 border border-foreground/10 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full min-h-[300px] bg-background/40 backdrop-blur-xl">
        {/* Animated Accent Top Border */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.avatarBg} opacity-80 group-hover:opacity-100 transition-opacity`} />
        
        {/* Decorative Watermark Quote Icon */}
        <Quote className="absolute -bottom-2 -right-2 w-24 h-24 text-foreground/[0.03] group-hover:text-amber-500/[0.06] transition-colors pointer-events-none" />

        <div>
          {/* Top Row: Stars + Verified Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shadow-inner">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              ))}
              <span className="text-[11px] font-mono font-bold text-amber-400 ml-1">5.0</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verified Client
            </div>
          </div>

          {/* Review Highlight */}
          <h3 className="text-base sm:text-lg font-bold text-foreground font-display line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
            "{item.highlight}"
          </h3>

          {/* Detailed Review Text - High contrast & readable font */}
          <p className="mt-3 text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed font-normal tracking-wide italic">
            "{item.review}"
          </p>
        </div>

        {/* Card Footer: Category Tag + Client Bio */}
        <div className="mt-6 pt-4 border-t border-foreground/10">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400/90 border border-amber-500/20 text-[10px] font-mono font-medium uppercase tracking-wider">
              {item.projectType}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">{item.date}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Avatar with dynamic glow ring */}
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.avatarBg} p-0.5 shadow-lg group-hover:scale-105 transition-transform flex-shrink-0`}>
              <div className="w-full h-full rounded-full bg-background/90 flex items-center justify-center font-bold font-display text-xs text-foreground tracking-wider">
                {item.avatar}
              </div>
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-foreground truncate font-display group-hover:text-amber-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {item.role} • <span className="text-foreground/90 font-medium">{item.company}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="w-full py-24 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-4xl mx-auto mb-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          CLIENT REVIEWS & TESTIMONIALS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display text-foreground tracking-tight"
        >
          Trusted by Visionary{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            Founders & Engineers
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
        >
          Real stories from industry leaders on how PrimeNova Studio delivered high-performance web applications, AI integrations, and enterprise software.
        </motion.p>

        {/* Carousel Control Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex items-center justify-center flex-wrap gap-3 sm:gap-4"
        >
          {/* Mode Switcher */}
          <div className="inline-flex items-center p-1 rounded-full bg-foreground/5 border border-foreground/10 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setViewMode('marquee')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'marquee'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/25 font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Continuous Marquee Carousel
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/25 font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              View All ({testimonialsData.length} Reviews)
            </button>
          </div>

          {/* Marquee Specific Speed & Pause Controls */}
          {viewMode === 'marquee' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-xs text-muted-foreground">
              {/* Play/Pause Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 cursor-pointer font-mono font-medium transition-all"
                title={isPaused ? 'Resume Scrolling' : 'Pause Scrolling'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              {/* Speed Switcher */}
              <div className="hidden sm:flex items-center gap-1 border-l border-foreground/10 pl-2">
                <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-mono mr-1">Speed:</span>
                <button
                  onClick={() => setSpeed('slow')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    speed === 'slow'
                      ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                      : 'hover:text-foreground'
                  }`}
                >
                  Slow (Easy Read)
                </button>
                <button
                  onClick={() => setSpeed('normal')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    speed === 'normal'
                      ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                      : 'hover:text-foreground'
                  }`}
                >
                  Normal
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* CONTINUOUS MARQUEE CAROUSEL MODE */}
      {viewMode === 'marquee' ? (
        <div
          className="relative w-full overflow-hidden py-4 pause-on-hover cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Side Fade Gradient Overlays for Smooth Translucent Edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

          {/* Pause Notification Banner */}
          {isPaused && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-amber-500/90 text-black text-[11px] font-mono font-bold shadow-lg flex items-center gap-1.5 animate-fade-in pointer-events-none">
              <Pause className="w-3 h-3 fill-black" /> Continuous Scroll Paused (Hovered)
            </div>
          )}

          {/* ROW 1: Running Right to Left */}
          <div className="flex w-full mb-4">
            <div
              className="animate-marquee-left"
              style={{
                animationDuration: `${durationRow1}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {/* Duplicate row 1 items 3 times for seamless infinite loop across all screens */}
              {[...row1Data, ...row1Data, ...row1Data].map((item, idx) =>
                renderCard(item, `row1-${idx}`)
              )}
            </div>
          </div>

          {/* ROW 2: Running Left to Right (Reverse direction for dynamic motion) */}
          <div className="flex w-full">
            <div
              className="animate-marquee-right"
              style={{
                animationDuration: `${durationRow2}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {/* Duplicate row 2 items 3 times for seamless infinite loop */}
              {[...row2Data, ...row2Data, ...row2Data].map((item, idx) =>
                renderCard(item, `row2-${idx}`)
              )}
            </div>
          </div>
        </div>
      ) : (
        /* GRID MODE (VIEW ALL REVIEWS FILTERABLE) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tags */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {projectTypes.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground border border-foreground/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Responsive Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
