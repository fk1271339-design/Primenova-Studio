import React from 'react';
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

const PortfolioHero: React.FC<PortfolioHeroProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 lg:px-16 overflow-hidden bg-[#08080a] text-white">
      {/* Warm Golden Backlight Glow behind Faiz */}
      <div className="golden-halo"></div>

      {/* Subtle Background Cyber Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>

      {/* Main Hero Section Grid */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">
        {/* Left Column: Huge Typography & Identity */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-xs font-mono tracking-[0.25em] text-blue-400 uppercase font-semibold">
              [ HELLO, I'M ]
            </span>
          </motion.div>

          {/* Huge Bebas Neue Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col font-hero-display leading-[0.88] select-none"
          >
            <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-white uppercase tracking-tight">
              FAIZ
            </span>
            <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-stroke-white uppercase tracking-tight my-0.5">
              SOFTWARE
            </span>
            <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-white uppercase tracking-tight">
              ENGINEER
            </span>
          </motion.div>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 max-w-xl text-xs sm:text-sm md:text-base text-zinc-400 font-light leading-relaxed"
          >
            Building high-performance digital architectures where precision meets cinematic experience. Specialized in scalable systems and interactive engineering.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => onNavigate('projects')}
              className="btn-magnetic px-7 py-3.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] flex items-center gap-2"
            >
              View Work
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleContactClick}
              className="btn-magnetic px-7 py-3.5 rounded-full bg-white/5 border border-white/20 text-white font-medium text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2"
            >
              Get in touch
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Social Links Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col gap-3 text-zinc-400 text-xs font-mono"
          >
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">FIND ME ON</span>
            <div className="flex items-center gap-3">
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
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-zinc-300 flex items-center justify-center hover:text-white hover:border-white/40 hover:bg-white/10 transition-all"
                    aria-label={social.name}
                  >
                    {renderIcon()}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Faiz Seamless Portrait Blend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center items-end min-h-[480px] lg:min-h-[600px]"
        >
          {/* Photo container with edge blending mask to prevent square crop lines */}
          <div
            className="relative w-full max-w-lg h-full flex justify-center items-end"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
            }}
          >
            <img
              src="/assets/faiz-hero.png"
              alt="Faiz — Software Engineer"
              className="w-full h-auto max-h-[620px] object-contain object-bottom filter contrast-[1.05] brightness-100 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Right Edge Vertical Status Pill */}
          <div className="hidden xl:flex absolute right-[-30px] top-1/2 transform -translate-y-1/2 flex-col items-center gap-3 py-6 px-2.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-zinc-400 tracking-widest uppercase backdrop-blur-md">
            <span className="text-zinc-600">•••</span>
            <span className="writing-vertical text-zinc-300">AVAILABLE FOR</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse my-1"></span>
            <span className="writing-vertical text-emerald-400">FREELANCE</span>
          </div>
        </motion.div>
      </div>

      {/* WebNex-Style Running Horizontal Marquee Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative z-20 mt-8 w-full overflow-hidden py-4 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl"
      >
        <div className="animate-marquee-left flex items-center gap-6">
          {/* Double loop array for seamless infinite marquee scrolling */}
          {[...statCardsConfig, ...statCardsConfig].map((stat, idx) => (
            <div
              key={idx}
              className="relative min-w-[240px] sm:min-w-[280px] p-6 rounded-2xl bg-[#0f1017]/90 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between overflow-hidden shrink-0 group cursor-pointer"
            >
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white group-hover:text-blue-400 transition-colors flex items-center">
                  <AnimatedCounter value={stat.num} />
                  <span className="text-blue-400 ml-1">{stat.suffix}</span>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-2 block">
                  {stat.label}
                </span>
              </div>

              {/* Bottom Gradient Accent Line matching WebNex reference */}
              <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${stat.accent} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PortfolioHero;
