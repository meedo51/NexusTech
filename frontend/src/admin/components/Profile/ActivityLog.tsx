import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, Shield, Key, Smartphone, Settings, User, LogIn, AlertTriangle } from 'lucide-react';
import { profileApi } from '../../../services/api';
import type { ActivityEntry } from '../../../types';

const actionIcons: Record<string, any> = {
  LOGIN: LogIn,
  PROFILE_UPDATED: User,
  PASSWORD_CHANGED: Key,
  TWO_FACTOR_ENABLED: Shield,
  TWO_FACTOR_DISABLED: Shield,
  SESSION_TERMINATED: Smartphone,
  ALL_SESSIONS_TERMINATED: Smartphone,
  AVATAR_UPDATED: User,
};

const actionColors: Record<string, string> = {
  LOGIN: 'text-blue-400 bg-blue-500/20',
  PROFILE_UPDATED: 'text-purple-400 bg-purple-500/20',
  PASSWORD_CHANGED: 'text-yellow-400 bg-yellow-500/20',
  TWO_FACTOR_ENABLED: 'text-green-400 bg-green-500/20',
  TWO_FACTOR_DISABLED: 'text-red-400 bg-red-500/20',
  SESSION_TERMINATED: 'text-orange-400 bg-orange-500/20',
  ALL_SESSIONS_TERMINATED: 'text-red-400 bg-red-500/20',
};

const ActivityLog: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['activities', page],
    queryFn: async () => {
      const res = await profileApi.getActivities({ limit: 20, page });
      return res.data.data;
    }
  });

  if (isLoading) return <div className="text-center text-gray-400 py-8">Loading activity log...</div>;

  const activities: ActivityEntry[] = data?.activities || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Activity Log <span className="text-sm text-gray-400 font-normal">({total} entries)</span>
        </h3>
      </div>

      <div className="space-y-2">
        {activities.map((entry, i) => {
          const Icon = actionIcons[entry.action] || Activity;
          const colorClass = actionColors[entry.action] || 'text-gray-400 bg-gray-500/20';
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-gray-800/30 rounded-lg px-4 py-3 border border-gray-700/30 flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{entry.action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  <span>{entry.ip}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {activities.length === 0 && (
          <p className="text-center text-gray-500 py-8">No activity recorded yet</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-gray-700 transition-all">
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-gray-700 transition-all">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
