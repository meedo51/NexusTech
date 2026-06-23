import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../hooks/useProfile';
import { User, Shield, Activity, Bell, LogOut, Settings, Smartphone, Camera, Trash2 } from 'lucide-react';
import { profileApi } from '../../../services/api';
import ProfileEditForm from './ProfileEditForm';
import TwoFactorSetup from './TwoFactorSetup';
import PasswordChangeModal from './PasswordChangeModal';
import EmailChangeModal from './EmailChangeModal';
import SessionsList from './SessionsList';
import ActivityLog from './ActivityLog';
import PreferencesPanel from './Preferences';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'sessions', label: 'Sessions', icon: LogOut },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'preferences', label: 'Preferences', icon: Settings },
];

const ProfileDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const { data: sessions } = useQuery({
    queryKey: ['sessions-count'],
    queryFn: async () => { const r = await profileApi.getSessions(); return r.data.data.sessions; },
    refetchInterval: 30000
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await profileApi.updateAvatar(file);
      await refreshUser();
    } catch { }
    setAvatarUploading(false);
  };

  const handleAvatarDelete = async () => {
    if (!confirm('Remove your avatar?')) return;
    try {
      await profileApi.deleteAvatar();
      await refreshUser();
    } catch { }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Profile
          </h1>
          <p className="text-gray-400 mt-1">Manage your account settings and security</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-full">
          <Shield className={`w-4 h-4 ${user?.twoFactorEnabled ? 'text-green-400' : 'text-yellow-400'}`} />
          <span className="text-sm text-gray-300">{user?.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: User, label: 'Role', value: user?.role || 'Admin', color: 'from-purple-500 to-purple-600' },
          { icon: Shield, label: 'Security', value: user?.twoFactorEnabled ? 'Secure' : 'Basic', color: user?.twoFactorEnabled ? 'from-green-500 to-green-600' : 'from-yellow-500 to-yellow-600' },
          { icon: Smartphone, label: 'Sessions', value: sessions?.length || 0, color: 'from-blue-500 to-blue-600' },
          { icon: Bell, label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A', color: 'from-pink-500 to-pink-600' },
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-800/30 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white mb-4 overflow-hidden">
                    {(user?.avatar || profile?.avatar) ? (
                      <img src={user?.avatar || profile?.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile?.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'A'}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button onClick={() => fileInputRef.current?.click()} disabled={avatarUploading}
                        className="p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-all">
                        <Camera className="w-4 h-4" />
                      </button>
                      {(user?.avatar || profile?.avatar) && (
                        <button onClick={handleAvatarDelete}
                          className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                <h3 className="text-xl font-bold text-white">{profile?.fullName || user?.username}</h3>
                <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                <span className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs">
                  {user?.role}
                </span>
              </div>
              <div className="mt-6 space-y-3">
                <button onClick={() => setShowEmailModal(true)} className="w-full px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg text-sm transition-all">
                  Change Email
                </button>
                <button onClick={() => setShowPasswordModal(true)} className="w-full px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg text-sm transition-all">
                  Change Password
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <ProfileEditForm profile={profile} onSubmit={updateProfile} loading={loading} />
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Password</h3>
                <p className="text-sm text-gray-400">Change your password regularly</p>
              </div>
              <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all text-sm">
                Change Password
              </button>
            </div>
          </div>
          <TwoFactorSetup />
        </div>
      )}

      {activeTab === 'sessions' && <SessionsList />}
      {activeTab === 'activity' && <ActivityLog />}
      {activeTab === 'preferences' && <PreferencesPanel />}

      {showPasswordModal && <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />}
      {showEmailModal && <EmailChangeModal onClose={() => setShowEmailModal(false)} />}
    </motion.div>
  );
};

export default ProfileDashboard;
