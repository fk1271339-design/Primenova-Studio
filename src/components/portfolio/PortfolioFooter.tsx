import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, MailIcon } from '../Icons';

const PortfolioFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#050608] border-t border-white/10 py-10 px-6 md:px-12 lg:px-16 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tracking-[0.2em] font-bold text-white uppercase">
            {portfolioData.brand}
          </span>
          <span className="text-xs text-zinc-500 font-mono">|</span>
          <span className="text-xs font-mono text-zinc-400">SOFTWARE ENGINEER</span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-zinc-400">
          {portfolioData.contact.socials.map((s) => {
            const getIcon = () => {
              switch (s.icon) {
                case 'github':
                  return <GithubIcon className="w-4 h-4" />;
                case 'linkedin':
                  return <LinkedinIcon className="w-4 h-4" />;
                case 'twitter':
                  return <TwitterIcon className="w-4 h-4" />;
                case 'instagram':
                  return <InstagramIcon className="w-4 h-4" />;
                default:
                  return <MailIcon className="w-4 h-4" />;
              }
            };
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label={s.name}
              >
                {getIcon()}
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="text-xs font-mono text-zinc-500 text-center md:text-right">
          © {new Date().getFullYear()} FAIZ. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
