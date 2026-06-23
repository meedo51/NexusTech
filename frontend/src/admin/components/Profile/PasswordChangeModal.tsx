import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check, AlertTriangle } from 'lucide-react';
import { useProfile } from '../../../hooks/useProfile';

interface Props {
  onClose: () => void;
}

const requirements = [
  { label: 'At least 12 characters', test: (p: string) => p.length >= 12 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const checkStrength = (pw: string) => {
  const failed = requirements.filter(r => !r.test(pw));
  return { isValid: failed.length === 0, requirements: failed.map(r => r.label) };
};

const PasswordChangeModal: React.FC<Props> = ({ onClose }) => {
  const { changePassword } = useProfile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState<{ isValid: boolean; requirements: string[] }>({ isValid: false, requirements: [] });

  const handleNewPasswordChange = (pw: string) => {
    setNewPassword(pw);
    setStrength(checkStrength(pw));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccess(true);
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const strengthPercent = requirements.filter(r => r.test(newPassword)).length / requirements.length;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Change Password</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Password Changed</h4>
              <p className="text-sm text-gray-400 mb-6">Your password has been updated successfully.</p>
              <button onClick={onClose} className="px-6 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all text-sm">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="password" value={newPassword} onChange={e => handleNewPasswordChange(e.target.value)} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                </div>
                {newPassword.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 rounded-full ${
                        strengthPercent === 1 ? 'bg-green-500' : strengthPercent >= 0.8 ? 'bg-yellow-500' : strengthPercent >= 0.6 ? 'bg-orange-500' : 'bg-red-500'
                      }`} style={{ width: `${strengthPercent * 100}%` }} />
                    </div>
                    <div className="mt-2 space-y-1">
                      {requirements.map((r, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs">
                          {r.test(newPassword) ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-gray-500" />
                          )}
                          <span className={r.test(newPassword) ? 'text-green-400' : 'text-gray-500'}>{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                </div>
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>
              {message && <p className="text-sm text-red-400">{message}</p>}
              <button type="submit" disabled={saving || !strength.isValid || newPassword !== confirmPassword}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordChangeModal;
