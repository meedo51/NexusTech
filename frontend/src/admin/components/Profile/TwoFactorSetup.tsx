import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Check, X, RefreshCw, Lock, Key } from 'lucide-react';
import { useProfile } from '../../../hooks/useProfile';
import { useAuth } from '../../../contexts/AuthContext';

const TwoFactorSetup: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { enableTwoFactor, verifyTwoFactor, disableTwoFactor, getBackupCodes } = useProfile();
  const [step, setStep] = useState<'idle' | 'setup' | 'complete'>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');

  const handleEnable = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await enableTwoFactor();
      setSecret(data.secret);
      setQrCode(data.qrCode);
      setStep('setup');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      await verifyTwoFactor(verificationCode);
      const codes = await getBackupCodes();
      setBackupCodes(codes);
      setStep('complete');
      setShowBackupCodes(true);
      await refreshUser();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    setError('');
    try {
      await disableTwoFactor({ password: disablePassword, code: disableCode });
      setShowDisableModal(false);
      setDisablePassword('');
      setDisableCode('');
      await refreshUser();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your account</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${
          user?.twoFactorEnabled ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
        }`}>
          {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {!user?.twoFactorEnabled && step === 'idle' && (
        <div className="mt-6">
          <button onClick={handleEnable} disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm">
            <Smartphone className="w-4 h-4" />
            <span>{loading ? 'Setting up...' : 'Enable 2FA'}</span>
          </button>
        </div>
      )}

      {step === 'setup' && qrCode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Step 1: Scan QR Code</h4>
            <p className="text-sm text-gray-400 mb-4">Scan with Google Authenticator, Authy, or similar</p>
            <div className="flex justify-center">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 rounded-lg border border-gray-700" />
            </div>
            {secret && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Or enter this key manually:</p>
                <code className="block mt-2 bg-gray-900 p-2 rounded text-sm text-green-400 font-mono break-all">{secret}</code>
              </div>
            )}
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Step 2: Verify Code</h4>
            <p className="text-sm text-gray-400 mb-4">Enter the 6-digit code from your authenticator app</p>
            <div className="flex space-x-4">
              <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000" maxLength={6}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-center text-xl tracking-widest font-mono focus:outline-none focus:border-purple-500" />
              <button onClick={handleVerify} disabled={loading || verificationCode.length !== 6}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                <Check className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {step === 'complete' && showBackupCodes && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h4 className="text-yellow-400 font-medium mb-2">Save Your Backup Codes</h4>
          <p className="text-sm text-gray-400 mb-4">Store these securely — they can recover your account if you lose access to 2FA.</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {backupCodes.map((code, i) => (
              <code key={i} className="bg-gray-900 p-2 rounded text-sm text-green-400 font-mono text-center">{code}</code>
            ))}
          </div>
          <button onClick={() => setShowBackupCodes(false)} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm">
            I've Saved My Codes
          </button>
        </motion.div>
      )}

      {user?.twoFactorEnabled && (
        <div className="mt-6">
          <button onClick={() => setShowDisableModal(true)} disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-all disabled:opacity-50 text-sm">
            <X className="w-4 h-4" />
            <span>Disable 2FA</span>
          </button>
        </div>
      )}

      {showDisableModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDisableModal(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Disable Two-Factor Authentication</h3>
            <p className="text-sm text-gray-400 mb-6">Enter your password and current 2FA code to disable.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="password" value={disablePassword} onChange={e => setDisablePassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">2FA Code</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" value={disableCode} onChange={e => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" maxLength={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-center tracking-widest font-mono focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setShowDisableModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all text-sm">
                  Cancel
                </button>
                <button onClick={handleDisable} disabled={loading || !disablePassword || disableCode.length !== 6}
                  className="flex-1 px-4 py-2.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-all disabled:opacity-50 text-sm">
                  {loading ? 'Disabling...' : 'Disable'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TwoFactorSetup;
