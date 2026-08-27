import React, { useEffect } from 'react';
import FaizPortfolio from '../components/portfolio/FaizPortfolio';

const PortfolioPage: React.FC = () => {
  useEffect(() => {
    document.title = 'FAIZ // Software Engineer Portfolio';
  }, []);

  return (
    <div className="w-full pt-20">
      <FaizPortfolio />
    </div>
  );
};

export default PortfolioPage;
