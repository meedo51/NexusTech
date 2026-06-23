import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiGithub, FiCheck, FiCalendar, FiTag } from 'react-icons/fi';
import { App } from '../../types';

interface AppModalProps {
  app: App | null;
  onClose: () => void;
}

const AppModal: React.FC<AppModalProps> = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-strong rounded-3xl p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-heading font-bold gradient-text">
                {app.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                {app.name}
              </h2>
              <p className="text-lg text-nexus-muted">
                {app.shortDescription}
              </p>
            </div>
          </div>

          <p className="text-white/80 mb-8 leading-relaxed">
            {app.description}
          </p>

          {app.features && app.features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-heading font-bold text-white mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {app.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary/20 flex items-center justify-center flex-shrink-0">
                      <FiCheck className="text-nexus-accent text-xs" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {app.stacks?.map((stack, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-medium"
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
          </div>

          <div className="flex flex-wrap gap-4">
            {app.demoUrl && (
              <a
                href={app.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity"
              >
                <FiExternalLink />
                Live Demo
              </a>
            )}
            {app.githubUrl && (
              <a
                href={app.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 glass rounded-full text-white font-medium hover:bg-white/10 transition-all"
              >
                <FiGithub />
                View Code
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppModal;
