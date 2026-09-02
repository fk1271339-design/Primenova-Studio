import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Pause, Play, Sparkles } from 'lucide-react';
import { testimonialsData, type Testimonial } from '../data/testimonialsData';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonialsData.length;

  // Auto-play slider interval
  useEffect(() => {
    if (isAutoPlaying && viewMode === 'carousel') {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, total, viewMode]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Get current 3 items to show on desktop (looping)
  const getVisibleTestimonials = () => {
    const items: Testimonial[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % total;
      items.push(testimonialsData[idx]);
    }
    return items;
  };

  const visibleItems = getVisibleTestimonials();

  return (
    <section id="testimonials" className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          CLIENT TESTIMONIALS & REVIEWS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-foreground tracking-tight"
        >
          Trusted by Visionary{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            Founders & Leaders
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed font-light"
        >
          Here is what our clients have to say about working with PrimeNova Studio on high-stakes software engineering, web applications, and AI innovations.
        </motion.p>

        {/* View Mode Switcher */}
        <div className="mt-6 inline-flex items-center p-1 rounded-full bg-foreground/5 border border-foreground/10">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              viewMode === 'carousel'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Carousel Slider
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            View All ({total} Reviews)
          </button>
        </div>
      </div>

      {/* CAROUSEL MODE */}
      {viewMode === 'carousel' ? (
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Grid Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${currentIndex}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="liquid-glass rounded-2xl p-6 sm:p-7 border border-foreground/10 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Top Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.avatarBg}`} />

                  {/* Top Row: Rating + Verified */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified Client
                      </div>
                    </div>

                    {/* Review Highlight */}
                    <h3 className="text-base font-bold text-foreground font-display line-clamp-1 group-hover:text-amber-400 transition-colors">
                      "{item.highlight}"
                    </h3>

                    {/* Review Content */}
                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-light italic">
                      "{item.review}"
                    </p>
                  </div>

                  {/* Project Tag & Client Info */}
                  <div className="mt-6 pt-5 border-t border-foreground/10">
                    <div className="mb-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-foreground/5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        {item.projectType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Avatar with gradient ring */}
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.avatarBg} p-0.5 shadow-md flex-shrink-0`}>
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold font-display text-xs text-foreground">
                          {item.avatar}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate font-display">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.role} • <span className="text-foreground/80 font-medium">{item.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
            {/* Left/Right Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                aria-label="Previous Review"
                className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-amber-500 hover:text-black border border-foreground/10 flex items-center justify-center transition-all shadow-md active:scale-95 text-foreground cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Review"
                className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-amber-500 hover:text-black border border-foreground/10 flex items-center justify-center transition-all shadow-md active:scale-95 text-foreground cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 flex items-center justify-center transition-all text-xs font-mono text-muted-foreground cursor-pointer"
                title={isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-1.5">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === i
                      ? 'w-6 bg-amber-400 shadow-sm shadow-amber-400/50'
                      : 'w-2 bg-foreground/20 hover:bg-foreground/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Slide Index Counter */}
            <div className="text-xs font-mono text-muted-foreground">
              Review <span className="text-amber-400 font-bold">{currentIndex + 1}</span> of {total}
            </div>
          </div>
        </div>
      ) : (
        /* GRID MODE (VIEW ALL REVIEWS) */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonialsData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
              className="liquid-glass rounded-2xl p-6 sm:p-7 border border-foreground/10 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.avatarBg}`} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground font-display group-hover:text-amber-400 transition-colors">
                  "{item.highlight}"
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-light italic">
                  "{item.review}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-foreground/10">
                <div className="mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-foreground/5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {item.projectType}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.avatarBg} p-0.5 shadow-md flex-shrink-0`}>
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold font-display text-xs text-foreground">
                      {item.avatar}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate font-display">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.role} • <span className="text-foreground/80 font-medium">{item.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Testimonials;
