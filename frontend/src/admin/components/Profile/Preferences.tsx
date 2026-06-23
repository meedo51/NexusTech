import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Bell, Globe, Save } from 'lucide-react';
import { profileApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
];

const PreferencesPanel: React.FC = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(user?.preferences?.theme || 'dark');
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);
  const [language, setLanguage] = useState(user?.preferences?.language || 'en');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await profileApi.updatePreferences({ theme, notifications, language });
      setMessage('Preferences saved');
    } catch {
      setMessage('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-6">Preferences</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white text-sm font-medium">Theme</p>
              <p className="text-xs text-gray-500">Choose dark or light mode</p>
            </div>
          </div>
          <div className="flex bg-gray-900 rounded-lg p-1">
            {(['dark', 'light'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-4 py-1.5 rounded-md text-sm transition-all ${theme === t ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white text-sm font-medium">Notifications</p>
              <p className="text-xs text-gray-500">Receive email notifications</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white text-sm font-medium">Language</p>
              <p className="text-xs text-gray-500">Interface language</p>
            </div>
          </div>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500">
            {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm">
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
        </button>
        {message && <p className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
      </div>
    </motion.div>
  );
};

export default PreferencesPanel;
