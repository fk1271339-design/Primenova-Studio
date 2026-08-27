import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon } from './Icons';

export interface PricingPlan {
  name: string;
  category: 'Website' | 'E-Commerce' | 'AI Solutions' | 'SaaS & Custom' | 'Branding & UX' | 'Maintenance';
  priceLabel: string;
  priceAmount: string;
  period: string;
  idealFor: string;
  timeline: string;
  desc: string;
  features: string[];
  recommended?: boolean;
  cta: string;
}

export const pricingPlansData: PricingPlan[] = [
  {
    name: 'Starter Website',
    category: 'Website',
    priceLabel: 'Starting from',
    priceAmount: '₹14,999',
    period: 'one-time',
    idealFor: 'Small businesses & startups needing a fast, modern web presence.',
    timeline: '1 – 2 Weeks',
    desc: 'High-impact 5-page responsive website with modern typography, contact integration, and SEO.',
    features: [
      'Responsive React frontend',
      'Modern dark luxury UI design',
      'Contact form with email alerts',
      'Basic SEO setup & meta tags',
      'Production deployment included',
    ],
    cta: 'Select Starter Plan',
  },
  {
    name: 'Business Website',
    category: 'Website',
    priceLabel: 'Starting from',
    priceAmount: '₹24,999',
    period: 'one-time',
    idealFor: 'Growing companies requiring dynamic animations and CMS/Blog setup.',
    timeline: '2 – 4 Weeks',
    desc: 'Up to 12 custom pages with micro-animations, lead capture funnels, and performance tuning.',
    features: [
      'Everything in Starter Website',
      'Up to 12 custom page layouts',
      'Framer Motion smooth animations',
      'Blog / Insights publishing module',
      'Full OpenAPI / REST integration',
      'Google Analytics & Search Console',
    ],
    recommended: true,
    cta: 'Select Business Plan',
  },
  {
    name: 'E-Commerce Storefront',
    category: 'E-Commerce',
    priceLabel: 'Starting from',
    priceAmount: '₹39,999',
    period: 'one-time',
    idealFor: 'Retailers, fashion brands, and multi-product online stores.',
    timeline: '3 – 5 Weeks',
    desc: 'Full-featured online store with product catalog, cart, checkout, and inventory management.',
    features: [
      'Product catalog & category filters',
      'Secure Stripe / Razorpay checkout',
      'Customer accounts & order history',
      'Coupon codes & discount engine',
      'Inventory tracking & admin panel',
      'Mobile touch-optimized UX',
    ],
    cta: 'Build E-Commerce Store',
  },
  {
    name: 'AI Agent & LLM Solution',
    category: 'AI Solutions',
    priceLabel: 'Starting from',
    priceAmount: '₹69000',
    period: 'indicative pricing',
    idealFor: 'Enterprises & SaaS platforms integrating cognitive AI assistants.',
    timeline: '3 – 6 Weeks',
    desc: 'Custom trained AI chatbot or agentic pipeline connected to your business knowledge base.',
    features: [
      'Always-on AI chatbot interface',
      'Vector DB search on company docs',
      'Automated customer inquiry handling',
      'Prompt engineering & fine-tuning',
      'Spring Boot backend integration',
      'Usage analytics & token monitoring',
    ],
    recommended: true,
    cta: 'Integrate AI Engine',
  },
  {
    name: 'SaaS & Custom Software',
    category: 'SaaS & Custom',
    priceLabel: 'Custom quote',
    priceAmount: '₹100000+',
    period: 'tailored scale',
    idealFor: 'Founders building multi-tenant SaaS products or complex software.',
    timeline: '4 – 8 Weeks MVP',
    desc: 'End-to-end full-stack digital product engineering with scalable Spring Boot & MongoDB.',
    features: [
      'Multi-tenant database schema',
      'Subscription billing & tier management',
      'JWT & OAuth 2.0 security model',
      'Role-based permissions (User/Admin)',
      'Dedicated staging & CI/CD pipeline',
      'Full intellectual property handoff',
    ],
    cta: 'Request Custom Quote',
  },
  {
    name: 'Branding & UI/UX Bundle',
    category: 'Branding & UX',
    priceLabel: 'Starting from',
    priceAmount: '₹5999',
    period: 'flat rate',
    idealFor: 'New ventures needing identity systems, logos, and UI guidelines.',
    timeline: '2 – 3 Weeks',
    desc: 'Complete visual identity system including logo design, color palette, and Figma design tokens.',
    features: [
      'Primary & secondary logo marks',
      'Typography & color system rules',
      'Figma component design kit',
      'Brand guideline documentation',
      'Social media asset templates',
    ],
    cta: 'Order Branding Package',
  },
  {
    name: 'Maintenance & SLA Plan',
    category: 'Maintenance',
    priceLabel: 'Starting from',
    priceAmount: '₹1000',
    period: 'per month',
    idealFor: 'Businesses wanting guaranteed uptime, regular updates, and priority support.',
    timeline: 'Ongoing SLA',
    desc: 'Dedicated technical maintenance, security patches, performance audits, and bug fixes.',
    features: [
      '24/7 Server uptime monitoring',
      'Spring Boot & React dependency updates',
      'Monthly MongoDB backups',
      'Priority 4-hour support response',
      'Continuous Core Web Vitals optimization',
    ],
    cta: 'Subscribe to Maintenance',
  },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Website', 'E-Commerce', 'AI Solutions', 'SaaS & Custom', 'Branding & UX', 'Maintenance'];

  const filteredPlans = selectedCategory === 'All'
    ? pricingPlansData
    : pricingPlansData.filter((p) => p.category === selectedCategory);

  return (
    <section id="pricing" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
          TRANSPARENT INVESTMENT
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display mt-4 leading-tight text-foreground">
          Clear Pricing Models. Cinematic Execution.
        </h2>
        <p className="text-muted-foreground font-light mt-4 text-base">
          All pricing options are clearly labeled as starting indicative quotes with zero surprise retainers.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat
              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
              : 'bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-muted-foreground hover:text-foreground'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredPlans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.08, duration: 0.6 }}
            className={`relative rounded-3xl p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 ${plan.recommended
              ? 'bg-foreground/5 dark:bg-white/5 border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.15)] scale-[1.02]'
              : 'liquid-glass border border-foreground/10'
              }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-orange-500 text-black text-[10px] font-bold font-mono uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md">
                Recommended
              </div>
            )}

            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                {plan.idealFor}
              </div>

              <h3 className="text-2xl font-bold text-foreground font-display mb-3">
                {plan.name}
              </h3>

              <div className="flex flex-col mb-6">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                  {plan.priceLabel}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-foreground font-display tracking-tight">
                    {plan.priceAmount}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    / {plan.period}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono mt-1">
                  Estimated Timeline: <strong className="text-foreground">{plan.timeline}</strong>
                </span>
              </div>

              <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6">
                {plan.desc}
              </p>

              <div className="w-full h-px bg-foreground/10 mb-6" />

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex gap-2.5 items-start text-xs text-foreground/90 font-light">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/contact')}
              className={`w-full py-3.5 text-center rounded-2xl font-semibold text-xs transition-all cursor-pointer ${plan.recommended
                ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-black hover:opacity-90 shadow-lg shadow-amber-500/20'
                : 'bg-foreground text-background dark:bg-white dark:text-black hover:opacity-90'
                }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
