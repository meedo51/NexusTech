import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Check } from 'lucide-react';
import { useProfile } from '../../../hooks/useProfile';

interface Props {
  onClose: () => void;
}

const EmailChangeModal: React.FC<Props> = ({ onClose }) => {
  const { changeEmail } = useProfile();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await changeEmail({ newEmail, password });
      setSuccess(true);
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Failed to change email');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Change Email</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required
                    placeholder="new@example.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Enter current password"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
              </div>
              {message && <p className="text-sm text-red-400">{message}</p>}
              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
                <Mail className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Change Email'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Email Updated</h4>
              <p className="text-sm text-gray-400">Your email has been changed to <strong className="text-white">{newEmail}</strong>.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all text-sm">
                Done
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailChangeModal;
