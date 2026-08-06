import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon } from './Icons';

const plans = [
  {
    name: 'Sprint Launch',
    price: '$8k',
    period: 'flat rate',
    desc: 'Perfect for startups and product launches needing quick, premium execution.',
    features: [
      'Visual identity & brand system',
      'High-fidelity product design mockups',
      'Production-ready marketing site (4 weeks)',
      '1 major iteration cycle',
      'Shared Slack communication channel',
    ],
    highlight: false,
    cta: 'Book a Sprint',
  },
  {
    name: 'Scale & AI Pipeline',
    price: '$15k',
    period: 'per month',
    desc: 'Deep integration of brand, digital engineering, and custom applied AI engines.',
    features: [
      'Everything in Sprint Launch',
      'Full-stack digital app/product build',
      'Custom applied AI agents & workflows',
      'Ongoing speed & conversion optimization',
      'Priority delivery (4-6 weeks MVP)',
      'Dedicated weekly syncs & support',
    ],
    highlight: true,
    cta: 'Start Scaling',
  },
  {
    name: 'Enterprise Dedicated',
    price: 'Custom',
    period: 'tailored scale',
    desc: 'For large enterprises requiring full custom platform engineering and dedicated staff.',
    features: [
      'Dedicated designers & AI engineers',
      'Complex enterprise database setups',
      'Custom LLM training and fine-tuning',
      'Advanced security & compliance audits',
      'SLA guarantees & 24/7 priority support',
      'Comprehensive codebase handoffs',
    ],
    highlight: false,
    cta: 'Contact Enterprise',
  },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="text-sm font-semibold tracking-widest text-primary uppercase">
          Flexible Pricing
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display mt-4 leading-tight text-foreground">
          Clear models. Full momentum.
        </h2>
        <p className="text-muted-foreground font-light mt-4 text-sm sm:text-base">
          No hidden retainers. We align on scope and deliver with cinematic focus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * 0.15, duration: 0.7 }}
            className={`relative rounded-3xl p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
              plan.highlight
                ? 'bg-foreground/5 dark:bg-white/5 border-2 border-primary shadow-[0_0_30px_rgba(251,191,36,0.15)] z-10 scale-100 lg:scale-[1.03]'
                : 'liquid-glass border border-foreground/10'
            }`}
          >
            {/* Spotlight highlight accent background for middle card */}
            {plan.highlight && (
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none -z-10" />
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground font-display">
                  {plan.name}
                </h3>
                {plan.highlight && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary text-primary-foreground">
                    Recommended
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-foreground font-display tracking-tight">
                  {plan.price}
                </span>
                <span className="text-xs text-muted-foreground font-light font-mono uppercase">
                  / {plan.period}
                </span>
              </div>

              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
                {plan.desc}
              </p>

              <div className="w-full h-px bg-foreground/10 mb-8" />

              <ul className="flex flex-col gap-4 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex gap-3 items-start text-sm text-foreground/80 font-light">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0 mt-0.5">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/contact')}
              className={`w-full py-4 text-center rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                plan.highlight
                  ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-black hover:opacity-95 shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:scale-[1.02]'
                  : 'bg-foreground text-background dark:bg-white dark:text-black hover:opacity-90 hover:scale-[1.02]'
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
