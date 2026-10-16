import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRightIcon, PlayIcon, SparklesIcon } from './Icons';
import AnimatedCounter from './AnimatedCounter';

const CYCLING_WORDS = ['Engineering.', 'Intelligence.', 'Momentum.', 'Innovation.'];

/* ─── Floating particles for Home Hero ─── */
const HomeParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; o: number; gold: boolean }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.4 + 0.05,
        gold: Math.random() > 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212, 168, 83, ${p.o})`
          : `rgba(255, 255, 255, ${p.o * 0.4})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

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
      mouseX.set((clientX - innerWidth / 2) / 35);
      mouseY.set((clientY - innerHeight / 2) / 35);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[96vh] w-full flex flex-col items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 md:px-8 border-b border-foreground/5 bg-[#08080a]"
    >
      {/* Floating particles */}
      <HomeParticles />

      {/* Ambient glows */}
      <motion.div
        style={{ y: yBg, opacity: opacityBg }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/* Gold center glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.04) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Violet bottom-right accent */}
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,168,83,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,168,83,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ scale: scaleContent, x: displayX, y: displayY }}
        className="relative z-10 max-w-5xl text-center flex flex-col items-center"
      >
        {/* Classic serif badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-amber-400/25 bg-amber-400/[0.06] text-xs font-mono tracking-widest text-amber-400 mb-10 backdrop-blur-md"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          DIGITAL ENGINEERING &amp; APPLIED AI STUDIO
        </motion.div>

        {/* Main headline — classic serif + modern word cycle */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] as [number,number,number,number] }}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.02] text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Design.{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={CYCLING_WORDS[wordIndex]}
              initial={{ opacity: 0, y: 25, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -25, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="inline-block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
            >
              {CYCLING_WORDS[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* Decorative gold rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 w-32 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
        />

        {/* Subtitle with serif italic emphasis */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed"
        >
          PrimeNova Studio crafts{' '}
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-zinc-200">
            cinematic digital platforms
          </span>
          , high-converting e-commerce stores, and{' '}
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-zinc-200">
            cognitive AI engines
          </span>{' '}
          for visionary enterprises.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center items-center"
        >
          {/* Primary — Gold gradient */}
          <button
            onClick={() => navigate('/contact')}
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-bold text-sm uppercase tracking-wider shadow-[0_8px_40px_rgba(212,168,83,0.35)] hover:shadow-[0_8px_50px_rgba(212,168,83,0.5)] hover:scale-105 transition-all duration-300"
          >
            Start a Project
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary — glass outline */}
          <button
            onClick={() => navigate('/portfolio')}
            className="group flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/[0.04] border border-white/10 text-white font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-white/[0.08] hover:border-amber-400/30 hover:scale-105 backdrop-blur-md"
          >
            Explore Work
          </button>

          {/* Showreel */}
          <button
            onClick={() => setShowreelOpen(true)}
            className="group flex items-center gap-2 px-4 py-4 rounded-full text-zinc-400 hover:text-amber-300 text-sm font-semibold transition-colors duration-300"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] group-hover:border-amber-400/30 group-hover:bg-amber-400/[0.06] text-white transition-all group-hover:scale-110">
              <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
            </span>
            Showreel
          </button>
        </motion.div>

        {/* Service Cards — unified gold accent numbers */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl text-left"
        >
          {[
            {
              num: '01',
              label: 'DIGITAL ENGINEERING',
              title: 'Full-Stack React & Spring Boot',
              desc: 'High-speed modular web apps with secure REST APIs & OAuth.',
            },
            {
              num: '02',
              label: 'E-COMMERCE STORES',
              title: 'Custom Storefronts & Marketplaces',
              desc: 'Scalable cart, checkout, inventory management & analytics.',
            },
            {
              num: '03',
              label: 'APPLIED AI SOLUTIONS',
              title: 'Agentic Workflows & Chat',
              desc: 'Embed cognitive assistants & intelligent automation in your product.',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col gap-3 hover:border-amber-400/25 hover:bg-amber-400/[0.03] transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              {/* Top gold accent bar */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-400/40 via-amber-400/20 to-transparent" />
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-light text-amber-400/50 group-hover:text-amber-400/80 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {card.num}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-amber-400/60 transition-colors">{card.label}</span>
              </div>
              <span className="text-sm font-bold text-white">{card.title}</span>
              <span className="text-xs text-zinc-500 font-light leading-relaxed">{card.desc}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Trust Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="relative z-10 w-full max-w-4xl mt-10 sm:mt-14 grid grid-cols-3 divide-x divide-white/[0.06] px-4 sm:px-8 py-5 sm:py-7 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-amber-400/[0.08] backdrop-blur-md"
      >
        {[
          { value: 100, suffix: '%', label: 'Production Quality' },
          { value: 12, suffix: '+', label: 'Core Agency Services' },
          { value: 24, suffix: '/7', label: 'AI-Powered Support' },
        ].map((metric, i) => (
          <div key={i} className="flex flex-col items-center text-center p-2 sm:p-4 group">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white group-hover:text-amber-400 transition-colors duration-300">
              <AnimatedCounter value={metric.value} suffix={metric.suffix} />
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 mt-1 sm:mt-2 uppercase tracking-widest">
              {metric.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Showreel Modal */}
      {showreelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-amber-400/20"
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
