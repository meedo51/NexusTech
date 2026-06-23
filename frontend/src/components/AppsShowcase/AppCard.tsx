import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiStar } from 'react-icons/fi';
import { App } from '../../types';

interface AppCardProps {
  app: App;
  onSelect: (app: App) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(app)}
        className="group relative glass rounded-2xl p-6 cursor-pointer card-hover transition-transform duration-200 ease-out"
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary/20 flex items-center justify-center">
              <span className="text-xl font-heading font-bold gradient-text">
                {app.name.charAt(0)}
              </span>
            </div>
            {app.featured && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gold/10 rounded-full">
                <FiStar className="text-gold text-xs" />
                <span className="text-gold text-xs font-medium">Featured</span>
              </div>
            )}
          </div>

          <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">
            {app.name}
          </h3>

          <p className="text-sm text-nexus-muted mb-4 line-clamp-2">
            {app.shortDescription || app.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {app.stacks?.slice(0, 4).map((stack, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor: `${stack.color || '#667eea'}20`,
                  color: stack.color || '#667eea',
                  border: `1px solid ${stack.color || '#667eea'}40`,
                }}
              >
                {stack.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            {app.demoUrl && (
              <a
                href={app.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-sm text-nexus-accent hover:text-white transition-colors"
              >
                <FiExternalLink className="text-xs" />
                Demo
              </a>
            )}
            {app.githubUrl && (
              <a
                href={app.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-sm text-nexus-muted hover:text-white transition-colors"
              >
                <FiGithub className="text-xs" />
                Code
              </a>
            )}
            <span className="ml-auto text-xs text-nexus-muted">
              {app.views} views
            </span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

export default AppCard;
