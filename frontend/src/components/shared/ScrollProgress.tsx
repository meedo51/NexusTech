import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9998] origin-left bg-gradient-primary"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
