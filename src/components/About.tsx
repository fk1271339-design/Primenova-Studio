import React from 'react';
import { motion } from 'framer-motion';

const values = [
  {
    num: '01',
    title: 'Human Craft & Detail',
    desc: 'Technology is only as good as the intention behind it. We focus heavily on grid precision, typography, and premium user experience.',
  },
  {
    num: '02',
    title: 'Applied Intelligence',
    desc: 'We do not chase trends. We integrate AI models directly into production loops, adding cognitive power where it matters most.',
  },
  {
    num: '03',
    title: 'Momentum Over Perfection',
    desc: 'Shipping fast is a feature. We design and build concurrently to put real experiences in front of users with speed and precision.',
  },
];

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column - Editorial Statement */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="text-sm font-semibold tracking-widest text-primary uppercase">
            Who We Are
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display leading-tight text-foreground">
            A creative-tech collective forging what comes next.
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed mt-4">
            Primenova Studio was founded on a simple truth: the future belongs to those who blend human-level aesthetics with machine-level intelligence.
          </p>
          <p className="text-base text-muted-foreground/80 font-light leading-relaxed">
            We operate at the convergence of brand identity and cognitive engineering. We do not just build layouts or configure LLMs — we design seamless systems that feel natural, elegant, and inevitably fast.
          </p>
        </div>

        {/* Right Column - Pillars Grid */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 border-b border-foreground/10 pb-3">
            Our Pillars
          </div>

          <div className="flex flex-col gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="flex gap-6 group"
              >
                <div className="text-xl font-bold font-mono text-primary group-hover:scale-110 transition-transform duration-300">
                  {val.num}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-foreground font-display">
                    {val.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
