import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/Hero/HeroSection';
import AppsShowcase from '../components/AppsShowcase/AppsShowcase';
import ContactSection from '../components/Contact/ContactSection';

const HomePage: React.FC = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <AppsShowcase />
      <ContactSection />
    </motion.main>
  );
};

export default HomePage;
