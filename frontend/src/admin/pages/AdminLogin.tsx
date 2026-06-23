import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiShield, FiEye, FiEyeOff, FiSmartphone } from 'react-icons/fi';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const { login, verifyTwoFactorLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result: any = await login(email, password);
      if (result?.requiresTwoFactor && result.tempToken) {
        setTempToken(result.tempToken);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyTwoFactorLogin(tempToken!, twoFactorCode);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid 2FA code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mx-auto mb-4"
          >
            {tempToken ? <FiSmartphone className="text-3xl text-nexus-accent" /> : <FiShield className="text-3xl text-nexus-accent" />}
          </motion.div>
          <h1 className="text-3xl font-heading font-bold gradient-text">Admin Access</h1>
          <p className="text-nexus-muted mt-2">{tempToken ? 'Enter your 2FA code' : 'Enter your credentials to continue'}</p>
        </div>

        {!tempToken ? (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-medium text-nexus-muted mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-nexus-muted/50 focus:outline-none focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/20 transition-all"
                placeholder="admin@nexustech.dev" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-nexus-muted mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-nexus-muted/50 focus:outline-none focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/20 transition-all"
                  placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-muted hover:text-white transition-colors">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-primary rounded-xl text-white font-medium disabled:opacity-50 transition-all">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactor} className="glass rounded-2xl p-8 space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-medium text-nexus-muted mb-2">Authentication Code</label>
              <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6} placeholder="000000"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] font-mono placeholder:text-nexus-muted/50 focus:outline-none focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/20 transition-all"
                required />
            </div>
            <motion.button type="submit" disabled={isLoading || twoFactorCode.length !== 6} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-primary rounded-xl text-white font-medium disabled:opacity-50 transition-all">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : 'Verify Code'}
            </motion.button>
            <button type="button" onClick={() => { setTempToken(null); setTwoFactorCode(''); setError(''); }}
              className="w-full text-sm text-nexus-muted hover:text-white transition-colors">
              Back to login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
