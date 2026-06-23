import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiHeart } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-8 px-4 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-primary opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-heading font-bold gradient-text mb-4">NEXUS</h3>
            <p className="text-nexus-muted text-sm leading-relaxed max-w-xs">
              Building digital realities through innovative technology and creative design.
              Every pixel tells a story.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {['Home', 'Apps', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm text-nexus-muted hover:text-white transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: <FiGithub size={18} />, href: 'https://github.com/nexustech' },
                { icon: <FiLinkedin size={18} />, href: 'https://linkedin.com/in/nexustech' },
                { icon: <FiTwitter size={18} />, href: 'https://twitter.com/nexustech' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-nexus-muted hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-nexus-muted">
            &copy; {currentYear} NexusTech. All rights reserved.
          </p>
          <p className="text-xs text-nexus-muted flex items-center gap-1">
            Crafted with <FiHeart className="text-magenta" /> by Ahmed Alsaleh
          </p>
        </div>
      </div>

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-nexus-accent rounded-full"
          style={{
            left: `${20 + i * 20}%`,
            bottom: '10%',
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}
    </footer>
  );
};

export default Footer;
