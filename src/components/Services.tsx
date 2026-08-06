import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LayoutIcon, BrainCircuitIcon, BoxesIcon, RocketIcon } from './Icons';

const services = [
  {
    title: 'Brand Strategy & Identity',
    description: 'We carve distinctive positioning, verbal identity, and editorial design systems that move audiences and build lasting emotional equity.',
    icon: <LayoutIcon className="w-8 h-8 text-amber-400" />,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    title: 'Applied AI Systems',
    description: 'We integrate intelligent agents, LLM solutions, and automated workflows that supercharge operational efficiency and unlock new business capabilities.',
    icon: <BrainCircuitIcon className="w-8 h-8 text-rose-400" />,
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    title: 'Digital Engineering',
    description: 'We engineer blazingly fast full-stack platforms, mobile experiences, and scalable web apps using high-fidelity modern codebases.',
    icon: <BoxesIcon className="w-8 h-8 text-indigo-400" />,
    gradient: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    title: 'Experiential Growth',
    description: 'We design cinematic marketing sites, high-converting product funnels, and optimized growth loops to propel your brand into inevitability.',
    icon: <RocketIcon className="w-8 h-8 text-teal-400" />,
    gradient: 'from-teal-500/20 to-emerald-500/20',
  },
];

const TiltCard: React.FC<{ service: typeof services[0] }> = ({ service }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 20, stiffness: 200 });
  const springY = useSpring(y, { damping: 20, stiffness: 200 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -8 }}
      className="relative flex flex-col justify-between p-8 rounded-3xl liquid-glass border border-foreground/10 group cursor-pointer transition-all duration-300 select-none overflow-hidden h-[360px]"
    >
      {/* Background glow overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10`} />

      <div style={{ transform: 'translateZ(30px)' }} className="flex flex-col gap-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 shadow-sm transition-transform duration-300 group-hover:scale-105">
          {service.icon}
        </div>

        <h3 className="text-2xl font-semibold text-foreground font-display leading-snug">
          {service.title}
        </h3>

        <p className="text-muted-foreground font-light text-sm sm:text-base leading-relaxed">
          {service.description}
        </p>
      </div>

      <div style={{ transform: 'translateZ(20px)' }} className="flex items-center gap-2 text-sm font-semibold text-primary mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Discover more
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold tracking-widest text-primary uppercase"
        >
          Capabilities
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-3xl sm:text-5xl font-bold font-display mt-4 leading-tight text-foreground"
        >
          Forging brands, building systems, executing momentum.
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 [perspective:1000px]">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.15, duration: 0.7 }}
          >
            <TiltCard service={service} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
