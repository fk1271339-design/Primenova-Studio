import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './Icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-foreground/10 bg-black/40 backdrop-blur-md pt-16 pb-12 px-4 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
        {/* Col 1: Brand & Tagline */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5 text-foreground font-bold tracking-[0.18em] font-display text-lg">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            PRIMENOVA STUDIO
          </Link>
          <p className="text-sm text-muted-foreground font-light max-w-sm leading-relaxed">
            Premium digital engineering, bespoke e-commerce platforms, and applied AI systems for visionary companies.
          </p>
          <div className="mt-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Direct Contact:</span>
            <a href="mailto:hello@primenova.studio" className="text-sm font-bold text-amber-400 hover:underline">
              hello@primenova.studio
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">NAVIGATION</span>
          <Link to="/" className="text-xs text-muted-foreground hover:text-white transition-colors">Home</Link>
          <Link to="/services" className="text-xs text-muted-foreground hover:text-white transition-colors">Services & Solutions</Link>
          <Link to="/portfolio" className="text-xs text-muted-foreground hover:text-white transition-colors">Portfolio & Works</Link>
          <Link to="/about" className="text-xs text-muted-foreground hover:text-white transition-colors">About PrimeNova</Link>
          <Link to="/pricing" className="text-xs text-muted-foreground hover:text-white transition-colors">Pricing & SLA</Link>
        </div>

        {/* Col 3: Capabilities */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">SOLUTIONS</span>
          <Link to="/services#web-development" className="text-xs text-muted-foreground hover:text-white transition-colors">Web Development</Link>
          <Link to="/services#ecommerce" className="text-xs text-muted-foreground hover:text-white transition-colors">E-Commerce Stores</Link>
          <Link to="/services#ai-solutions" className="text-xs text-muted-foreground hover:text-white transition-colors">AI & LLM Integration</Link>
          <Link to="/services#saas" className="text-xs text-muted-foreground hover:text-white transition-colors">SaaS Platforms</Link>
          <Link to="/ai-assistant" className="text-xs text-muted-foreground hover:text-white transition-colors">AI Consultant Tool</Link>
        </div>

        {/* Col 4: Resources & Social */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">RESOURCES & SOCIAL</span>
          <Link to="/about#process" className="text-xs text-muted-foreground hover:text-white transition-colors">Engineering Process</Link>
          <Link to="/about#tech-stack" className="text-xs text-muted-foreground hover:text-white transition-colors">Technology Stack</Link>
          <Link to="/contact" className="text-xs text-muted-foreground hover:text-white transition-colors">Project Guide & Inquiry</Link>
          
          <div className="flex items-center gap-3 mt-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-amber-400 transition-colors" aria-label="GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-amber-400 transition-colors" aria-label="LinkedIn">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-amber-400 transition-colors" aria-label="Twitter">
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/primenova.studio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-amber-400 transition-colors" aria-label="Instagram">
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <span className="text-[11px] text-muted-foreground font-mono">
          &copy; {currentYear} PrimeNova Studio. All rights reserved. Registered Digital Engineering Agency.
        </span>
        <span className="text-[11px] font-mono text-amber-400 font-semibold">
          Digital experiences built for what’s next.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
