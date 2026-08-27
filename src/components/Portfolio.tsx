import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRightIcon } from './Icons';

export interface Project {
  id: string;
  title: string;
  category: 'Web' | 'E-Commerce' | 'AI' | 'SaaS' | 'UI/UX' | 'Branding';
  technologies: string[];
  year: string;
  shortDesc: string;
  fullDesc: string;
  challenge: string;
  solution: string;
  result: string;
  image: string;
  url?: string;
}

export const portfolioProjects: Project[] = [
  {
    id: 'nova-os',
    title: 'Nova OS',
    category: 'AI',
    technologies: ['React', 'Spring Boot', 'Python', 'OpenAI', 'MongoDB'],
    year: '2026',
    shortDesc: 'An intelligent workspace operating system built on agentic models.',
    fullDesc: 'Nova OS connects enterprise workflows to an autonomous multi-agent backend, parsing documents, scheduling tasks, and generating real-time operational insights.',
    challenge: 'Enterprise teams were spending 40% of their day manually parsing incoming unstructured emails and client PDFs.',
    solution: 'Engineered a vector-indexed AI assistant pipeline integrated directly with Spring Boot REST microservices and a React dashboard.',
    result: 'Reduced manual administrative overhead by 75% across beta deployment teams.',
    image: '/assets/portfolio-1.png',
    url: 'https://primenova.studio',
  },
  {
    id: 'aether-branding',
    title: 'Aether Brand System',
    category: 'Branding',
    technologies: ['Figma', 'Illustrator', 'Design System', 'Typography'],
    year: '2025',
    shortDesc: 'Cinematic brand language and design system for a green-energy innovator.',
    fullDesc: 'Crafted a dark luxury visual identity, custom logo marks, typography scales, and a comprehensive editorial design system for a clean-tech unicorn.',
    challenge: 'Aether needed to pivot from a traditional utility look to a high-tech luxury brand.',
    solution: 'Designed a modular brand system with dark gradients, emerald accents, and an interactive web style guide.',
    result: 'Increased investor brand perception score by 90% during Series B fundraising.',
    image: '/assets/portfolio-2.png',
  },
  {
    id: 'cognitive-web',
    title: 'Cognitive Web Portal',
    category: 'Web',
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    year: '2026',
    shortDesc: 'A semantic search engine and analytics dashboard powered by custom LLMs.',
    fullDesc: 'A ultra-fast marketing and analytics portal providing real-time data visualization, user session tracking, and sub-100ms page transitions.',
    challenge: 'High bounce rates caused by slow legacy WordPress architecture.',
    solution: 'Rebuilt from the ground up using React + Vite SPA, optimized Core Web Vitals, and smooth Framer Motion micro-interactions.',
    result: 'Achieved 99/100 Lighthouse performance score and doubled conversion rates.',
    image: '/assets/portfolio-3.png',
  },
  {
    id: 'synthetix-store',
    title: 'Synthetix Storefront',
    category: 'E-Commerce',
    technologies: ['React', 'Spring Boot', 'Stripe', 'MongoDB'],
    year: '2025',
    shortDesc: 'High-converting custom e-commerce store with real-time inventory and checkout.',
    fullDesc: 'A modern fashion and apparel storefront featuring instant product filter search, customer accounts, promo engines, and secure payment processing.',
    challenge: 'Existing shop suffered from abandoned cart rates due to complex 4-step checkout flow.',
    solution: 'Implemented a 1-step slide-out cart with instant Stripe Checkout integration and automated transactional emails.',
    result: 'Cart completion rate increased by 38% within 30 days of launch.',
    image: '/assets/portfolio-4.png',
  },
  {
    id: 'nexus-saas',
    title: 'Nexus Workflow SaaS',
    category: 'SaaS',
    technologies: ['React', 'Spring Boot', 'JWT Auth', 'MongoDB'],
    year: '2026',
    shortDesc: 'Multi-tenant project management platform for engineering teams.',
    fullDesc: 'Full-stack SaaS application with subscription tiers, team member management, role-based security, and real-time audit logging.',
    challenge: 'Managing user access controls and subscription tiers across multiple company organizations.',
    solution: 'Designed Spring Security JWT authentication with ROLE_ADMIN and organization scoping at the MongoDB repository level.',
    result: 'Successfully onboarded 50+ business organizations seamlessly.',
    image: '/assets/portfolio-1.png',
  },
  {
    id: 'lumina-ui',
    title: 'Lumina Design System',
    category: 'UI/UX',
    technologies: ['Figma', 'Storybook', 'Tailwind Tokens', 'WCAG AA'],
    year: '2025',
    shortDesc: 'Editorial UI design kit and accessible component architecture.',
    fullDesc: 'A universal design system containing 80+ reusable UI components, accessible color contrast tokens, and interactive micro-animations.',
    challenge: 'Design inconsistency across 4 separate product teams causing duplicate code.',
    solution: 'Created a unified Figma component library paired with a Storybook React repository.',
    result: 'Accelerated team feature delivery cycles by 3x.',
    image: '/assets/portfolio-2.png',
  },
];

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Web', 'E-Commerce', 'AI', 'SaaS', 'UI/UX', 'Branding'];

  const filteredProjects = selectedCategory === 'All'
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            FEATURED WORKS & CASE STUDIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display mt-4 leading-tight text-foreground">
            Making the inevitable tangible.
          </h2>
        </div>
        <p className="text-muted-foreground font-light max-w-md text-sm sm:text-base leading-relaxed">
          Explore our portfolio of high-performance web platforms, e-commerce storefronts, AI systems, and brand architectures.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.1, duration: 0.7 }}
            onClick={() => setSelectedProject(project)}
            className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden liquid-glass border border-foreground/10 group cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-[0.35] group-hover:scale-105 group-hover:filter-none group-hover:brightness-[0.6] transition-all duration-700"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 pointer-events-none" />

            {/* Year Tag */}
            <div className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-amber-400">
              {project.year}
            </div>

            {/* Card Content */}
            <div className="absolute inset-x-8 bottom-8 flex items-end justify-between z-20 pointer-events-none">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-amber-400">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white font-display group-hover:translate-x-1 transition-transform">
                  {project.title}
                </h3>
                <p className="text-xs font-light text-neutral-300 max-w-sm line-clamp-2">
                  {project.shortDesc}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-[9px] font-mono text-white/70 bg-white/10 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all group-hover:bg-amber-400 group-hover:text-black group-hover:scale-110">
                <ArrowUpRightIcon className="w-5 h-5 transition-transform group-hover:rotate-45" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Study Modal Popup */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 sm:p-10 liquid-glass border border-amber-500/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {selectedProject.category} • {selectedProject.year}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
                {selectedProject.title}
              </h2>

              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                {selectedProject.fullDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">01 / CHALLENGE</span>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{selectedProject.challenge}</p>
                </div>

                <div className="p-4 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">02 / SOLUTION</span>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{selectedProject.solution}</p>
                </div>

                <div className="p-4 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">03 / RESULT</span>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{selectedProject.result}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block mb-2">Technologies Used:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((t) => (
                    <span key={t} className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                <span className="text-xs text-muted-foreground font-mono">Case Study Document • PrimeNova Studio</span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2.5 rounded-full bg-amber-400 text-black font-semibold text-xs hover:opacity-90"
                >
                  Close Showcase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
