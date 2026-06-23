import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Globe, Trash2, AlertTriangle } from 'lucide-react';
import { profileApi } from '../../../services/api';
import type { AdminSession } from '../../../types';

const SessionsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await profileApi.getSessions();
      return res.data.data.sessions as AdminSession[];
    }
  });

  const invalidateSessions = () => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    queryClient.invalidateQueries({ queryKey: ['sessions-count'] });
  };

  const terminateMutation = useMutation({
    mutationFn: (id: string) => profileApi.terminateSession(id),
    onSuccess: invalidateSessions
  });

  const terminateAllMutation = useMutation({
    mutationFn: () => profileApi.terminateAllSessions(password),
    onSuccess: () => {
      invalidateSessions();
      setShowConfirm(false);
      setPassword('');
    }
  });

  if (isLoading) return <div className="text-center text-gray-400 py-8">Loading sessions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Active Sessions <span className="text-sm text-gray-400 font-normal">({data?.length || 0})</span>
        </h3>
        {(data?.length || 0) > 1 && (
          <button onClick={() => setShowConfirm(true)} className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all text-sm">
            <Trash2 className="w-4 h-4" />
            <span>Terminate All</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {data?.map((session) => (
          <motion.div key={session._id} layout
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                {session.device?.toLowerCase().includes('mobile') || session.device?.toLowerCase().includes('phone') ? (
                  <Smartphone className="w-5 h-5 text-gray-400" />
                ) : (
                  <Monitor className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{session.device || 'Unknown Device'}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center space-x-1"><Globe className="w-3 h-3" /><span>{session.ip}</span></span>
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button onClick={() => terminateMutation.mutate(session._id)}
              className="p-2 hover:bg-red-600/20 rounded-lg text-gray-500 hover:text-red-400 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
        {(!data || data.length === 0) && (
          <p className="text-center text-gray-500 py-8">No active sessions</p>
        )}
      </div>

      {showConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Terminate All Sessions?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Enter your password to confirm. You will be logged out of all devices.</p>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white mb-4 focus:outline-none focus:border-purple-500" />
            <div className="flex space-x-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all text-sm">
                Cancel
              </button>
              <button onClick={() => terminateAllMutation.mutate()} disabled={!password || terminateAllMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-all disabled:opacity-50 text-sm">
                {terminateAllMutation.isPending ? 'Terminating...' : 'Terminate All'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SessionsList;
