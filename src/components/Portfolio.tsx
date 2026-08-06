import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon } from './Icons';

const projects = [
  {
    title: 'Nova OS',
    category: 'Applied AI / UI Design',
    desc: 'An intelligent workspace operating system built on agentic models.',
    image: '/assets/portfolio-1.png',
  },
  {
    title: 'Aether Branding',
    category: 'Creative Direction',
    desc: 'Cinematic brand language and design system for a green-energy innovator.',
    image: '/assets/portfolio-2.png',
  },
  {
    title: 'Cognitive Web',
    category: 'Development / AI Systems',
    desc: 'A semantic search engine and analytics dashboard powered by custom LLMs.',
    image: '/assets/portfolio-3.png',
  },
  {
    title: 'Synthetix Platform',
    category: 'Interactive / 3D',
    desc: 'Interactive visual playground for real-time generative assets.',
    image: '/assets/portfolio-4.png',
  },
];

const PortfolioCard: React.FC<{ project: typeof projects[0] }> = ({ project }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsTapped(false);
      }}
      onClick={() => {
        if (isTouchDevice) {
          setIsTapped(!isTapped);
        }
      }}
      className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden liquid-glass border border-foreground/10 group cursor-pointer"
    >
      {/* Base Layer: Dark Grayscale / Muted Version of Image */}
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-[0.25] transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Spotlight Layer: Full Color Image (Visible only under cursor spotlight) */}
      <div
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundImage: `url(${project.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isHovered || isTapped ? 1 : 0,
          maskImage: isTouchDevice && isTapped 
            ? 'none' 
            : `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 100%, transparent 100%)`,
          WebkitMaskImage: isTouchDevice && isTapped 
            ? 'none' 
            : `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black 100%, transparent 100%)`,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        }}
      />

      {/* Glass Overlay Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Content Details */}
      <div className="absolute inset-x-8 bottom-8 flex items-end justify-between z-20 pointer-events-none">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {project.category}
          </span>
          <h3 className="text-2xl font-bold text-white font-display">
            {project.title}
          </h3>
          <p className="text-sm font-light text-neutral-300 max-w-sm line-clamp-2">
            {project.desc}
          </p>
        </div>

        {/* Animated Arrow Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 dark:bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
          <ArrowUpRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
        </div>
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <div className="text-sm font-semibold tracking-widest text-primary uppercase">
            Selected Works
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display mt-4 leading-tight text-foreground">
            Making the inevitable tangible.
          </h2>
        </div>
        <p className="text-muted-foreground font-light max-w-md text-base leading-relaxed">
          Explore a curated selection of branding architectures, high-performance platforms, and interface products created at the edge of design and intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.15, duration: 0.8 }}
          >
            <PortfolioCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
