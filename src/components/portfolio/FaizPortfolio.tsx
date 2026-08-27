import React from 'react';
import PortfolioHero from './PortfolioHero';
import PortfolioAbout from './PortfolioAbout';
import PortfolioSkills from './PortfolioSkills';
import PortfolioProjects from './PortfolioProjects';
import PortfolioExperience from './PortfolioExperience';
import PortfolioContact from './PortfolioContact';
import PortfolioFooter from './PortfolioFooter';
import '../../styles/portfolio.css';

const FaizPortfolio: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#07080c] text-white selection:bg-blue-500 selection:text-white font-sans">
      {/* 01 — HERO */}
      <PortfolioHero onNavigate={scrollToSection} />

      {/* 02 — ABOUT */}
      <PortfolioAbout />

      {/* 03 — SKILLS */}
      <PortfolioSkills />

      {/* 04 — PROJECTS */}
      <PortfolioProjects />

      {/* 05 — EXPERIENCE */}
      <PortfolioExperience />

      {/* 06 — CONTACT */}
      <PortfolioContact />

      {/* 07 — FOOTER */}
      <PortfolioFooter />
    </div>
  );
};

export default FaizPortfolio;
