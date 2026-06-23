import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiChevronDown, FiExternalLink } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { heroApi } from '../../services/api';
import AnimatedCounter from '../shared/AnimatedCounter';

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Building Digital Realities';
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const { data: hero } = useQuery({
    queryKey: ['hero'],
    queryFn: () => heroApi.getActive().then(r => r.data),
  });

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { delay: i * 0.03, type: 'spring', stiffness: 100 },
    }),
  };

  const title = hero?.title || 'Ahmed Alsaleh';
  const subtitle = hero?.subtitle || '';

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div style={{ opacity, scale, y }} className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-primary animate-pulse-slow opacity-50" />
            <div className="absolute inset-2 rounded-full bg-gradient-secondary animate-spin-slow opacity-30" />
            <div className="absolute inset-4 rounded-full bg-[#0a0a0f] flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-heading font-bold gradient-text">A</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-bold text-white mb-4 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {title.split('').map((char: string, i: number) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block hover:gradient-text transition-all duration-300 cursor-default"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="text-xl md:text-3xl lg:text-4xl font-heading font-light mb-8 h-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <span className="gradient-text-accent">{displayText}</span>
          <span className="animate-pulse text-nexus-accent">|</span>
        </motion.p>

        {hero?.tagline && (
          <motion.p
            className="text-base md:text-lg text-nexus-muted mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {hero.tagline}
          </motion.p>
        )}

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <motion.a
            href={hero?.ctaLink || '#apps'}
            className="group relative px-8 py-4 bg-gradient-primary rounded-full text-white font-medium text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {hero?.ctaText || 'Explore My Work'}
              <FiExternalLink className="group-hover:rotate-45 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.a>
        </motion.div>

        {hero?.stats && (
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            {hero.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold gradient-text">
                  <AnimatedCounter end={parseInt(stat.value) || 0} suffix={isNaN(parseInt(stat.value)) ? '' : '+'} />
                </div>
                <div className="text-sm text-nexus-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiChevronDown className="text-nexus-muted text-2xl" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
