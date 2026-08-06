import React, { useEffect, useRef, useState } from 'react';
import { useInView, type UseInViewOptions } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const IN_VIEW_OPTIONS: UseInViewOptions = { once: true, margin: '-50px' };

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, suffix = '', duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, IN_VIEW_OPTIONS);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= totalMiliseconds) {
        setCount(end);
      } else {
        const progress = elapsedTime / totalMiliseconds;
        // Ease out quadratic
        const easeOut = progress * (2 - progress);
        setCount(Math.floor(easeOut * end));
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="tabular-nums font-semibold">
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
