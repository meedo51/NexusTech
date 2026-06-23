import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { profileApi } from '../../services/api';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }
    profileApi.verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.response?.data?.error || 'Verification failed or token expired');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700/50 text-center">
        {status === 'loading' && (
          <div className="py-8">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Verifying your email...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{message}</h2>
            <p className="text-gray-400 mb-6">Your email has been verified successfully.</p>
            <Link to="/admin/dashboard/profile"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm hover:shadow-lg transition-all">
              Back to Profile
            </Link>
          </div>
        )}
        {status === 'error' && (
          <div className="py-8">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link to="/admin/dashboard/profile"
              className="inline-block px-6 py-2.5 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 transition-all">
              Back to Profile
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
