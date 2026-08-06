import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRightIcon, PlayIcon, SparklesIcon } from './Icons';
import AnimatedCounter from './AnimatedCounter';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [showreelOpen, setShowreelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const displayX = useTransform(springX, (x) => x * 0.4);
  const displayY = useTransform(springY, (y) => y * 0.4);

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 200]);
  const opacityBg = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleContent = useTransform(scrollY, [0, 500], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / 30;
      const y = (clientY - innerHeight / 2) / 30;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95svh] w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-16 px-4 md:px-8 border-b border-foreground/5"
    >
      {/* Dynamic Cinematic Background Layer */}
      <motion.div
        style={{ y: yBg, opacity: opacityBg }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/* Soft, rich glowing gradient blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-amber-500/10 to-rose-500/10 blur-[120px] dark:from-amber-500/5 dark:to-rose-500/5 animate-pulse duration-10000" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[140px] dark:from-indigo-500/5 dark:to-purple-500/5" />
        
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* Main Interactive Foreground Container */}
      <motion.div
        style={{ scale: scaleContent, x: displayX, y: displayY }}
        className="relative z-10 max-w-5xl text-center flex flex-col items-center"
      >
        {/* Glass Tag Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-xs font-semibold tracking-wider text-primary mb-8 backdrop-blur-md"
        >
          <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
          APPLIED AI & CREATIVE BRANDING STUDIO
        </motion.div>

        {/* Cinematic Staggered Reveal Tagline with Rotating Word */}
        {(() => {
          const rotatingWords = ['Intelligence.', 'Creativity.', 'Dreams.', 'Innovation.', 'Engineering.', 'Excellence.'];
          const [wordIndex, setWordIndex] = React.useState(0);

          React.useEffect(() => {
            const interval = setInterval(() => {
              setWordIndex((prev) => (prev + 1) % rotatingWords.length);
            }, 2500);
            return () => clearInterval(interval);
          }, []);

          const headingClass = "text-4xl sm:text-6xl md:text-8xl font-black font-display tracking-tight leading-none bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent dark:from-white dark:via-white dark:to-neutral-500";

          return (
            <h1 className={`${headingClass} text-center`}>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
              >
                Design.{' '}
              </motion.span>
              <span className="inline-block relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
              >
                Momentum.
              </motion.span>
            </h1>
          );
        })()}

        {/* Smooth Paragraph Fade */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed"
        >
          Primenova Studio blends human craft with applied AI to build brands,
          products, and experiences that move fast and feel inevitable.
        </motion.p>

        {/* CTAs with Magnetic Glows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate('/contact')}
            className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background dark:bg-white dark:text-black font-semibold text-base transition-all duration-300 hover:scale-105 shadow-[0_10px_30px_rgba(255,255,255,0.08)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.03)] hover:shadow-primary/20"
          >
            Get In Touch
            <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setShowreelOpen(true)}
            className="group flex items-center gap-2.5 px-8 py-4 rounded-full bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground font-semibold text-base transition-all duration-300 hover:bg-foreground/10 dark:hover:bg-white/10 hover:scale-105 backdrop-blur-md"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-black shadow-md transition-transform duration-300 group-hover:scale-110">
              <PlayIcon className="w-4 h-4 ml-0.5" />
            </span>
            Watch Showreel
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Cinematic Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 1.0 }}
        className="relative z-10 w-full max-w-5xl mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 py-8 rounded-3xl liquid-glass border border-foreground/10"
      >
        <div className="flex flex-col items-center text-center p-4">
          <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-display">
            <AnimatedCounter value={100} suffix="+" />
          </span>
          <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
            Brands Built
          </span>
        </div>
        <div className="flex flex-col items-center text-center p-4 border-y sm:border-y-0 sm:border-x border-foreground/10">
          <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-display">
            <AnimatedCounter value={98} suffix="%" />
          </span>
          <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
            Satisfaction Rate
          </span>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-display">
            <AnimatedCounter value={25} suffix="+" />
          </span>
          <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
            AI Integrations
          </span>
        </div>
      </motion.div>

      {/* Showreel Lightbox Dialog */}
      {showreelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <button
              onClick={() => setShowreelOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Close Showreel"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Primenova Showreel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Hero;
