import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { appsApi } from '../../services/api';
import AppCard from './AppCard';
import AppModal from './AppModal';
import SectionTitle from '../shared/SectionTitle';
import ErrorBoundary from '../shared/ErrorBoundary';
import { App } from '../../types';

const AppsShowcase: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['apps', filter],
    queryFn: () => appsApi.getAll({ status: 'active', ...(filter !== 'all' ? { category: filter } : {}) }).then(r => r.data),
  });

  const categories = ['all', 'Productivity', 'Communication', 'Finance', 'Design', 'Analytics'];
  const apps = data?.apps || [];

  return (
    <ErrorBoundary>
      <section id="apps" className="relative py-24 md:py-32 px-4">
        <SectionTitle
          title="Digital Creations"
          subtitle="Each project is a piece of art, crafted with passion and precision"
          gradient="primary"
        />

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-primary text-white shadow-lg shadow-purple-500/25'
                  : 'glass text-nexus-muted hover:text-white hover:border-white/30'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-nexus-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            layout
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {apps.map((app: App) => (
                <AppCard key={app._id} app={app} onSelect={setSelectedApp} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {apps.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-nexus-muted text-lg">No projects found in this category</p>
          </div>
        )}

        <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      </section>
    </ErrorBoundary>
  );
};

export default AppsShowcase;
