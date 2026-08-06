import React from 'react';
import { motion } from 'framer-motion';

interface LetterRevealProps {
  text: string;
  className?: string;
}

const LetterReveal: React.FC<LetterRevealProps> = ({ text, className = '' }) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const wordVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.h1
      className={`flex flex-wrap justify-center gap-x-[0.25em] ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          className="inline-block whitespace-nowrap"
          variants={wordVariants}
        >
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block origin-bottom"
              variants={letterVariants}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default LetterReveal;
