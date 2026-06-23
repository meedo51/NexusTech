import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Globe, Plus, Edit, Trash2, X, Save } from 'lucide-react';

const platformOptions = [
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'facebook', label: 'Facebook', icon: Globe },
  { value: 'instagram', label: 'Instagram', icon: Globe },
  { value: 'youtube', label: 'YouTube', icon: Globe },
  { value: 'discord', label: 'Discord', icon: Globe },
  { value: 'website', label: 'Website', icon: Globe },
];

interface Item { platform: string; url: string; username: string; isActive: boolean; displayOrder: number; }

interface Props {
  socialMedia: Item[];
  onAdd: (data: any) => Promise<void>;
  onUpdate: (platform: string, data: any) => Promise<void>;
  onDelete: (platform: string) => Promise<void>;
  onReorder: (order: string[]) => Promise<void>;
}

const SocialMediaManager: React.FC<Props> = ({ socialMedia, onAdd, onUpdate, onDelete, onReorder }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: '', url: '', username: '', isActive: true });

  const resetForm = () => setForm({ platform: '', url: '', username: '', isActive: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlatform) { await onUpdate(editingPlatform, form); } else { await onAdd(form); }
    setIsAdding(false); setEditingPlatform(null); resetForm();
  };

  const handleEdit = (item: Item) => {
    setForm({ platform: item.platform, url: item.url, username: item.username || '', isActive: item.isActive });
    setEditingPlatform(item.platform); setIsAdding(true);
  };

  const handleDelete = async (platform: string) => {
    if (window.confirm(`Delete ${platform}?`)) await onDelete(platform);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...socialMedia];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    onReorder(copy.map(i => i.platform));
  };

  const handleMoveDown = (index: number) => {
    if (index === socialMedia.length - 1) return;
    const copy = [...socialMedia];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    onReorder(copy.map(i => i.platform));
  };

  const PlatformIcon = (p: string) => {
    const found = platformOptions.find(o => o.value === p);
    return found ? <found.icon className="w-5 h-5" /> : <Globe className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Social Media Platforms</h3>
          <p className="text-sm text-gray-400">Manage your social media links</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setEditingPlatform(null); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:opacity-90">
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add Platform'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="overflow-hidden bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Platform</label>
                <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select platform</option>
                  {platformOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">URL</label>
                <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setIsAdding(false); setEditingPlatform(null); resetForm(); }}
                className="px-4 py-2.5 text-gray-300 hover:text-white">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90">
                <Save className="w-4 h-4 inline mr-1.5" />{editingPlatform ? 'Update' : 'Add'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {socialMedia.map((item, i) => (
          <motion.div key={item.platform} layout
            className={`flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-700/50 ${!item.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMoveUp(i)} className="text-gray-500 hover:text-white text-xs leading-none">&uarr;</button>
                <button onClick={() => handleMoveDown(i)} className="text-gray-500 hover:text-white text-xs leading-none">&darr;</button>
              </div>
              <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center text-gray-400">
                {PlatformIcon(item.platform)}
              </div>
              <div>
                <p className="text-white font-medium capitalize">{item.platform}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:underline truncate max-w-[200px] block">@{item.username}</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={item.isActive} onChange={() => onUpdate(item.platform, { ...item, isActive: !item.isActive })}
                  className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.platform)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
        {socialMedia.length === 0 && <p className="text-center text-gray-500 py-8">No social media platforms added yet.</p>}
      </div>
    </div>
  );
};

export default SocialMediaManager;
