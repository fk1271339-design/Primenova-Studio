import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRightIcon, PlayIcon, SparklesIcon } from './Icons';
import AnimatedCounter from './AnimatedCounter';

const CYCLING_WORDS = ['Engineering.', 'Intelligence.', 'Momentum.', 'Innovation.'];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const displayX = useTransform(springX, (x) => x * 0.3);
  const displayY = useTransform(springY, (y) => y * 0.3);

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 180]);
  const opacityBg = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleContent = useTransform(scrollY, [0, 500], [1, 0.96]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / 35;
      const y = (clientY - innerHeight / 2) / 35;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[96vh] w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-4 md:px-8 border-b border-foreground/5"
    >
      {/* Subtle Digital Grid & Glowing Orbs Background */}
      <motion.div
        style={{ y: yBg, opacity: opacityBg }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[38vw] h-[38vw] rounded-full bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-rose-500/10 blur-[130px] animate-pulse duration-10000" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[42vw] h-[42vw] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* Main Interactive Hero Foreground Container */}
      <motion.div
        style={{ scale: scaleContent, x: displayX, y: displayY }}
        className="relative z-10 max-w-5xl text-center flex flex-col items-center"
      >
        {/* Glass Tag Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-xs font-semibold tracking-widest text-amber-400 mb-8 backdrop-blur-md"
        >
          <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
          DIGITAL ENGINEERING & APPLIED AI STUDIO
        </motion.div>

        {/* Editorial Animated Word Cycling Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight leading-[1.05] text-foreground"
        >
          Design.{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={CYCLING_WORDS[wordIndex]}
              initial={{ opacity: 0, y: 25, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -25, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent"
            >
              {CYCLING_WORDS[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed"
        >
          PrimeNova Studio crafts cinematic digital platforms, high-converting e-commerce stores, and cognitive AI engines for visionary enterprises.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate('/contact')}
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-black font-bold text-base shadow-[0_8px_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-all duration-300 active:scale-98"
          >
            Start a Project
            <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate('/portfolio')}
            className="group flex items-center gap-2.5 px-8 py-4 rounded-full bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground font-semibold text-base transition-all duration-300 hover:bg-foreground/10 dark:hover:bg-white/10 hover:scale-105 backdrop-blur-md"
          >
            Explore Work
          </button>

          <button
            onClick={() => setShowreelOpen(true)}
            className="group flex items-center gap-2 px-6 py-4 rounded-full text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground/10 dark:bg-white/10 text-foreground transition-transform group-hover:scale-110">
              <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
            </span>
            Showreel
          </button>
        </motion.div>

        {/* Floating UI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl text-left"
        >
          <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col gap-2 hover:border-amber-400/30 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">01 / DIGITAL ENGINEERING</span>
            <span className="text-sm font-bold text-foreground font-display">Full-Stack React & Spring Boot</span>
            <span className="text-xs text-muted-foreground font-light leading-relaxed">High-speed modular web apps with secure REST APIs & OAuth.</span>
          </div>

          <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col gap-2 hover:border-rose-400/30 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">02 / E-COMMERCE STORES</span>
            <span className="text-sm font-bold text-foreground font-display">Custom Storefronts & Marketplaces</span>
            <span className="text-xs text-muted-foreground font-light leading-relaxed">Scalable cart, checkout, inventory management & analytics.</span>
          </div>

          <div className="p-5 rounded-2xl liquid-glass border border-foreground/10 flex flex-col gap-2 hover:border-indigo-400/30 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">03 / APPLIED AI SOLUTIONS</span>
            <span className="text-sm font-bold text-foreground font-display">Agentic Workflows & Chat</span>
            <span className="text-xs text-muted-foreground font-light leading-relaxed">Embed cognitive assistants & intelligent automation in your product.</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Trust & Metrics Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 py-8 rounded-3xl liquid-glass border border-foreground/10"
      >
        <div className="flex flex-col items-center text-center p-4">
          <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-display">
            <AnimatedCounter value={100} suffix="%" />
          </span>
          <span className="text-xs font-mono text-muted-foreground mt-2 uppercase tracking-widest">
            Production Quality Guarantee
          </span>
        </div>
        <div className="flex flex-col items-center text-center p-4 border-y sm:border-y-0 sm:border-x border-foreground/10">
          <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-display">
            <AnimatedCounter value={12} suffix="+" />
          </span>
          <span className="text-xs font-mono text-muted-foreground mt-2 uppercase tracking-widest">
            Core Agency Services
          </span>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-display">
            <AnimatedCounter value={24} suffix="/7" />
          </span>
          <span className="text-xs font-mono text-muted-foreground mt-2 uppercase tracking-widest">
            Automated Support & AI Agents
          </span>
        </div>
      </motion.div>

      {/* Showreel Lightbox Modal */}
      {showreelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <button
              onClick={() => setShowreelOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
              aria-label="Close Showreel"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="PrimeNova Showreel"
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
