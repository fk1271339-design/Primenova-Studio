import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-foreground/5 py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Brand Details */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2 text-foreground font-semibold tracking-wider font-display text-lg">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500" />
            PRIMENOVA STUDIO
          </Link>
          <p className="text-xs text-muted-foreground font-light text-center md:text-left mt-1">
            Design. Intelligence. Momentum.
          </p>
        </div>

        {/* Quick links & copyrights */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
            <Link to="/services" className="hover:text-foreground transition-colors duration-300">Services</Link>
            <Link to="/portfolio" className="hover:text-foreground transition-colors duration-300">Portfolio</Link>
            <Link to="/about" className="hover:text-foreground transition-colors duration-300">About</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors duration-300">Pricing</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors duration-300">Contact</Link>
          </div>
          <span className="text-[10px] text-muted-foreground/60 font-light mt-1 font-mono">
            &copy; {currentYear} Primenova Studio. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
