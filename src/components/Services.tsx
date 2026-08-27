import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  features: string[];
  technologies: string[];
  suitableFor: string;
  gradient: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: 'web-development',
    number: '01',
    title: 'Web Development',
    shortDesc: 'High-performance, cinematic marketing websites and responsive web applications built with modern frontend frameworks.',
    features: ['Custom React architecture', 'Server side rendering & SEO', 'Micro-animations & dynamic visual design', 'Responsive grid systems'],
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    suitableFor: 'Startups, Corporate Enterprises, Creative Agencies',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'ecommerce',
    number: '02',
    title: 'E-Commerce Development',
    shortDesc: 'Custom online storefronts, fashion outlets, electronics hubs, multi-vendor marketplaces, and subscription platforms.',
    features: ['Seamless cart & checkout flow', 'Payment gateway integration (Stripe, Razorpay, PayPal)', 'Real-time inventory management', 'Customer accounts & admin dashboards'],
    technologies: ['React', 'Spring Boot REST', 'MongoDB', 'Stripe', 'GraphQL'],
    suitableFor: 'Fashion Brands, Retailers, Multi-Vendor Marketplaces',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    id: 'ai-solutions',
    number: '03',
    title: 'AI Solutions',
    shortDesc: 'Applied LLM agents, intelligent chatbot interfaces, cognitive search pipelines, and predictive workflow automation.',
    features: ['Custom RAG & vector databases', 'Always-on customer service assistants', 'Document intelligence & parsing', 'Automated content generation'],
    technologies: ['Python', 'LangChain', 'OpenAI API', 'Spring Boot', 'Vector Search'],
    suitableFor: 'SaaS Platforms, Support Desks, Enterprise Automation',
    gradient: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    id: 'mobile-apps',
    number: '04',
    title: 'Mobile App Development',
    shortDesc: 'Cross-platform native mobile applications providing intuitive, touch-first experiences for iOS and Android.',
    features: ['Biometric auth & offline storage', 'Real-time push notifications', 'Smooth 60fps gesture animations', 'App Store / Play Store deployment'],
    technologies: ['React Native', 'Flutter', 'TypeScript', 'REST APIs'],
    suitableFor: 'Consumer Apps, On-Demand Services, Mobile Retail',
    gradient: 'from-teal-500/20 to-emerald-500/20',
  },
  {
    id: 'ui-ux',
    number: '05',
    title: 'UI/UX Design',
    shortDesc: 'User-centered visual systems, wireframes, high-fidelity prototypes, and cohesive editorial design tokens.',
    features: ['User journey mapping', 'Design system token libraries', 'Interactive clickable prototypes', 'Accessibility (WCAG) compliance'],
    technologies: ['Figma', 'Storybook', 'Design Systems', 'CSS Modules'],
    suitableFor: 'Product Teams, Enterprise Portals, Digital Brands',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    id: 'branding',
    number: '06',
    title: 'Branding & Identity',
    shortDesc: 'Strategic positioning, logo architecture, typography guidelines, and complete visual language development.',
    features: ['Logo marks & wordmarks', 'Color palettes & typography rules', 'Brand guideline books', 'Social & marketing assets'],
    technologies: ['Adobe Illustrator', 'Figma', 'Editorial Design', 'Brand Architecture'],
    suitableFor: 'New Business Launches, Rebrands, Scale-ups',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    id: 'saas',
    number: '07',
    title: 'SaaS Development',
    shortDesc: 'Multi-tenant cloud applications with subscription billing, role-based user permissions, and analytics dashboards.',
    features: ['Subscription & billing tiers', 'Role-based access control (RBAC)', 'Multi-tenant database structures', 'User onboarding funnels'],
    technologies: ['Spring Boot', 'MongoDB', 'React', 'JWT Auth', 'Stripe Billing'],
    suitableFor: 'B2B Software Companies, Tech Founders, Enterprises',
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
  {
    id: 'automation',
    number: '08',
    title: 'Business Automation',
    shortDesc: 'End-to-end workflow automation connecting internal tools, CRM platforms, email notifications, and data pipelines.',
    features: ['Third-party API webhooks', 'Automated email notifications', 'Data scraping & synchronization', 'CRM & ERP integration'],
    technologies: ['Zapier', 'Make', 'Node.js', 'Spring Batch', 'REST Webhooks'],
    suitableFor: 'Operations Teams, E-Commerce Stores, Logistics',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'custom-software',
    number: '09',
    title: 'Custom Software',
    shortDesc: 'Bespoke software solutions tailored to solve unique domain engineering challenges and legacy systems refactoring.',
    features: ['Clean architecture & OOP design', 'High-throughput data processing', 'Legacy system modernization', 'Automated test coverage'],
    technologies: ['Java 21', 'Spring Boot 3', 'MongoDB', 'Docker', 'Kubernetes'],
    suitableFor: 'FinTech, Healthcare, Logistics, Large Enterprise',
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    id: 'api-backend',
    number: '10',
    title: 'API & Backend Development',
    shortDesc: 'Secure RESTful and GraphQL backend services designed for fault-tolerance, high concurrency, and low latency.',
    features: ['JWT & OAuth 2.0 authentication', 'Rate limiting & input sanitization', 'Database index optimization', 'Comprehensive OpenAPI docs'],
    technologies: ['Spring Security', 'MongoDB Indexing', 'Swagger', 'Postman'],
    suitableFor: 'Mobile Backends, Web Portals, Microservices',
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  {
    id: 'maintenance',
    number: '11',
    title: 'Website Maintenance',
    shortDesc: 'Proactive SLA maintenance, security updates, cloud server management, bug fixes, and continuous performance tuning.',
    features: ['24/7 Uptime monitoring', 'Security patch management', 'Regular database backups', 'Priority support response'],
    technologies: ['Spring Boot Actuator', 'AWS / Vercel', 'Docker', 'Git CI/CD'],
    suitableFor: 'Existing Web Applications, E-Commerce Stores',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'performance-seo',
    number: '12',
    title: 'Performance & SEO',
    shortDesc: 'Core Web Vitals optimization, semantic HTML auditing, search engine indexation, and technical site acceleration.',
    features: ['Sub-100ms LCP & CLS fixes', 'Structured JSON-LD schema data', 'Meta tag & Open Graph optimization', 'Image compression & lazy loading'],
    technologies: ['Google Lighthouse', 'Core Web Vitals', 'Schema.org', 'Next/Vite Optimization'],
    suitableFor: 'Content Sites, High-Traffic Retail, Lead Gen Portals',
    gradient: 'from-yellow-500/20 to-amber-500/20',
  },
];

const ServiceCard: React.FC<{ service: ServiceItem }> = ({ service }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 20, stiffness: 200 });
  const springY = useSpring(y, { damping: 20, stiffness: 200 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id={service.id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -8 }}
      className="relative flex flex-col justify-between p-8 rounded-3xl liquid-glass border border-foreground/10 group cursor-pointer transition-all duration-300 overflow-hidden min-h-[380px]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10`} />

      <div style={{ transform: 'translateZ(25px)' }} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono font-bold text-amber-400">
            {service.number}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-foreground/5 dark:bg-white/5 px-2.5 py-1 rounded-full border border-foreground/10">
            {service.suitableFor.split(',')[0]}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-foreground font-display group-hover:text-amber-400 transition-colors">
          {service.title}
        </h3>

        <p className="text-muted-foreground font-light text-sm leading-relaxed">
          {service.shortDesc}
        </p>

        {/* Feature Checkpoints */}
        <ul className="space-y-1.5 mt-2">
          {service.features.map((feat) => (
            <li key={feat} className="flex items-center gap-2 text-xs text-foreground/80 font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {feat}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ transform: 'translateZ(15px)' }} className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {service.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[9px] font-mono text-muted-foreground bg-foreground/5 dark:bg-white/5 px-2 py-0.5 rounded">
              {tech}
            </span>
          ))}
        </div>

        <button
          onClick={() => navigate('/contact')}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform"
        >
          Inquire
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
          transition={{ duration: 0.5 }}
          className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase"
        >
          OUR FULL CAPABILITIES
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl sm:text-5xl font-bold font-display mt-4 leading-tight text-foreground"
        >
          12 Specialized Engineering & AI Services
        </motion.h2>
        <p className="text-muted-foreground font-light text-base mt-4">
          From full-stack web platforms and bespoke e-commerce engines to cognitive AI workflows and cloud infrastructure.
        </p>
      </div>

      {/* Grid of 12 Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [perspective:1000px]">
        {servicesData.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </div>

      {/* Dedicated E-Commerce Capabilities Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-20 p-8 sm:p-12 rounded-3xl liquid-glass border border-amber-500/20 relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
              SPECIALIZED DEEP DIVE
            </span>
            <h3 className="text-3xl font-bold font-display text-foreground mt-2">
              E-Commerce Engineering Capabilities
            </h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed mt-3">
              We design and construct high-converting e-commerce environments engineered for speed, high transaction volumes, and customer retention.
            </p>

            <div className="mt-6 space-y-2">
              <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">Stores We Build:</span>
              <div className="flex flex-wrap gap-2">
                {['Fashion Stores', 'Electronics Hubs', 'Furniture Retail', 'Beauty Outlets', 'Multi-Vendor Marketplaces', 'Subscription Stores'].map((store) => (
                  <span key={store} className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    {store}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:max-w-md">
            {[
              { label: 'Product Catalog', icon: '📦' },
              { label: 'Cart & Smooth Checkout', icon: '🛒' },
              { label: 'Payment Gateways', icon: '💳' },
              { label: 'Order & Inventory', icon: '📊' },
              { label: 'Customer Accounts', icon: '👤' },
              { label: 'Coupons & Promos', icon: '🎟️' },
              { label: 'Analytics Dashboard', icon: '📈' },
              { label: 'SEO & Security', icon: '🔒' },
            ].map((item) => (
              <div key={item.label} className="p-3.5 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
