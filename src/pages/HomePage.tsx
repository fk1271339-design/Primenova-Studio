import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import WhyPrimeNova from '../components/WhyPrimeNova';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <Hero />

      {/* Why PrimeNova Advantage */}
      <WhyPrimeNova />

      {/* Capabilities / Services */}
      <Services />

      {/* Featured Portfolio Works */}
      <Portfolio />

      {/* Pricing Options */}
      <Pricing />

      {/* Contact Section */}
      <Contact />

      {/* Final Cinematic Call to Action Banner */}
      <section className="w-full max-w-6xl py-20 px-4 md:px-8 my-12 text-center">
        <div className="p-12 sm:p-16 rounded-3xl liquid-glass border border-amber-500/20 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
            START YOUR PROJECT TODAY
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-foreground max-w-2xl leading-tight">
            Have an idea? <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
              Let's build it.
            </span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mt-4 font-light leading-relaxed">
            From initial strategy to scalable engineering and applied AI integration, we deliver systems that create momentum.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 text-black font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
            >
              Get In Touch With Us
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 rounded-full bg-foreground/5 dark:bg-white/5 border border-foreground/10 text-foreground font-semibold text-sm hover:bg-foreground/10 transition-all"
            >
              View Pricing Models
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
