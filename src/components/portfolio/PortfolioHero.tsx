import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import AnimatedCounter from '../AnimatedCounter';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, MailIcon, ArrowUpRightIcon } from '../Icons';

interface PortfolioHeroProps {
  onNavigate: (sectionId: string) => void;
}

const statCardsConfig = [
  { label: 'Years Experience', num: 2, suffix: '+', accent: 'from-purple-500 via-indigo-500 to-blue-500' },
  { label: 'Projects Delivered', num: 20, suffix: '+', accent: 'from-amber-500 via-orange-500 to-red-500' },
  { label: 'Happy Clients', num: 10, suffix: '+', accent: 'from-cyan-400 via-teal-500 to-blue-600' },
  { label: 'Dedication Rate', num: 100, suffix: '%', accent: 'from-rose-500 via-pink-500 to-purple-600' },
  { label: 'Code Quality', num: 99, suffix: '%', accent: 'from-emerald-400 via-teal-400 to-green-500' },
  { label: 'API Performance', num: 100, suffix: 'ms', accent: 'from-blue-500 via-sky-400 to-cyan-400' },
];

/* ─── Floating particles canvas for cinematic depth ─── */
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; o: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.1,
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
        ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
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
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.4 }}
    />
  );
};

/* ─── Staggered animation variants ─── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const PortfolioHero: React.FC<PortfolioHeroProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 lg:px-16 overflow-hidden bg-[#08080a] text-white">
      {/* ─── Ambient background layers ─── */}
      <ParticleField />

      {/* Warm cinematic glow behind portrait */}
      <div className="golden-halo"></div>

      {/* Secondary cool accent glow — top-left */}
      <div
        className="absolute pointer-events-none z-[1]"
        style={{
          top: '5%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle noise overlay for cinematic texture */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* ─── Main Hero Grid ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center my-auto py-8"
      >
        {/* ══════ Left Column: Typography & Identity ══════ */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Classic serif italic tagline */}
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-violet-400/60 to-transparent"></span>
            <span className="font-classic italic text-sm sm:text-base tracking-wide text-zinc-300/80">
              Hello, I'm
            </span>
          </motion.div>

          {/* Giant display name — MD + FAIZ */}
          <motion.div variants={fadeUp} className="flex flex-col select-none">
            {/* First name with serif 'MD' prefix */}
            <div className="flex items-baseline gap-3 lg:gap-5">
              <span className="font-classic italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-violet-300/70 font-light tracking-wide">
                Md
              </span>
              <span className="font-hero-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-white uppercase tracking-tight leading-[0.88]">
                FAIZ
              </span>
            </div>

            {/* SOFTWARE — gradient shimmer text */}
            <span className="font-hero-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold uppercase tracking-tight leading-[0.88] my-1 text-gradient-shimmer cursor-default">
              SOFTWARE
            </span>

            {/* ENGINEER — solid white */}
            <span className="font-hero-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-white uppercase tracking-tight leading-[0.88]">
              ENGINEER
            </span>
          </motion.div>

          {/* Decorative accent line */}
          <motion.div variants={fadeUp} className="mt-6 w-48 hero-line-accent"></motion.div>

          {/* Subtitle — classic serif italic mixed with modern */}
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg text-[13px] sm:text-sm md:text-base text-zinc-400 font-light leading-relaxed tracking-wide"
          >
            Building <span className="font-classic italic text-zinc-300">high-performance</span> digital architectures where precision meets
            cinematic experience. Specialized in <span className="font-classic italic text-zinc-300">scalable systems</span> and interactive
            engineering.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('projects')}
              className="btn-magnetic group px-8 py-4 rounded-full bg-white text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center gap-2.5"
            >
              View Work
              <ArrowUpRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={handleContactClick}
              className="btn-magnetic group px-8 py-4 rounded-full bg-white/[0.04] border border-white/15 text-white font-medium text-xs uppercase tracking-wider hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 backdrop-blur-sm flex items-center gap-2.5"
            >
              Get in touch
              <ArrowUpRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={fadeUp} className="mt-12 flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-mono">Find me on</span>
            <div className="flex items-center gap-2.5">
              {portfolioData.contact.socials.map((social) => {
                const renderIcon = () => {
                  switch (social.icon) {
                    case 'github':
                      return <GithubIcon className="w-4 h-4" />;
                    case 'linkedin':
                      return <LinkedinIcon className="w-4 h-4" />;
                    case 'twitter':
                      return <TwitterIcon className="w-4 h-4" />;
                    case 'instagram':
                      return <InstagramIcon className="w-4 h-4" />;
                    default:
                      return <MailIcon className="w-4 h-4" />;
                  }
                };
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 flex items-center justify-center hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                  >
                    {renderIcon()}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ══════ Right Column: Portrait with cinematic blend ══════ */}
        <motion.div
          variants={fadeScale}
          className="lg:col-span-5 relative flex justify-center items-center min-h-[500px] lg:min-h-[620px]"
        >
          {/* Ambient ring glow behind portrait */}
          <div
            className="absolute z-0 pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234,138,56,0.18) 0%, rgba(234,138,56,0.05) 50%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Portrait photo with smooth vignette edge blend */}
          <div className="relative z-[3] w-full max-w-md flex justify-center items-end">
            {/* Top edge fade */}
            <div className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #08080a 0%, transparent 100%)' }} />
            {/* Bottom edge fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, #08080a 0%, transparent 100%)' }} />
            {/* Left edge fade */}
            <div className="absolute top-0 bottom-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #08080a 0%, transparent 100%)' }} />
            {/* Right edge fade */}
            <div className="absolute top-0 bottom-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #08080a 0%, transparent 100%)' }} />
            
            <img
              src="/assets/faiz-hero-2.png"
              alt="Faiz — Software Engineer"
              className="w-full h-auto max-h-[680px] object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
              style={{ filter: 'contrast(1.06) brightness(1.02) saturate(1.05)' }}
            />
          </div>

          {/* Right edge floating status pill */}
          <div className="hidden xl:flex absolute right-[-30px] top-1/2 transform -translate-y-1/2 flex-col items-center gap-3 py-6 px-2.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-zinc-400 tracking-widest uppercase backdrop-blur-md">
            <span className="text-zinc-600">•••</span>
            <span className="writing-vertical text-zinc-300">AVAILABLE FOR</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse my-1"></span>
            <span className="writing-vertical text-emerald-400">FREELANCE</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ─── Marquee Stats Row ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="relative z-20 mt-8 w-full overflow-hidden py-4 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md shadow-2xl"
      >
        <div className="animate-marquee-left flex items-center gap-6">
          {[...statCardsConfig, ...statCardsConfig].map((stat, idx) => (
            <div
              key={idx}
              className="relative min-w-[240px] sm:min-w-[280px] p-6 rounded-2xl bg-[#0f1017]/90 border border-white/[0.06] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shrink-0 group cursor-pointer"
            >
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white group-hover:text-blue-400 transition-colors duration-300 flex items-center">
                  <AnimatedCounter value={stat.num} />
                  <span className="text-blue-400 ml-1">{stat.suffix}</span>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 mt-2 block">
                  {stat.label}
                </span>
              </div>

              {/* Accent gradient bar */}
              <div className={`mt-4 h-0.5 w-full rounded-full bg-gradient-to-r ${stat.accent} opacity-40 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PortfolioHero;
