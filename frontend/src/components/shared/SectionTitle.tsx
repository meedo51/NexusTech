import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  gradient?: 'primary' | 'secondary' | 'accent';
}

const gradientClasses = {
  primary: 'gradient-text',
  secondary: 'gradient-text-secondary',
  accent: 'gradient-text-accent',
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, gradient = 'primary' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center mb-16"
    >
      <h2 className={`text-4xl md:text-6xl font-heading font-bold ${gradientClasses[gradient]} mb-4`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-nexus-muted max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
