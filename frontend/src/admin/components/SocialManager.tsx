import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { SiGithub, SiLinkedin, SiTwitter, SiDribbble, SiYoutube } from 'react-icons/si';

const iconOptions = [
  { value: 'github', label: 'GitHub', icon: <SiGithub /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <SiLinkedin /> },
  { value: 'twitter', label: 'Twitter', icon: <SiTwitter /> },
  { value: 'dribbble', label: 'Dribbble', icon: <SiDribbble /> },
  { value: 'youtube', label: 'YouTube', icon: <SiYoutube /> },
];

const SocialManager: React.FC = () => {
  const [editing, setEditing] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: socials, isLoading } = useQuery({
    queryKey: ['admin-socials'],
    queryFn: () => socialApi.getAll().then(r => r.data),
  });

  const saveSocial = useMutation({
    mutationFn: (data: any) => data._id ? socialApi.update(data._id, data) : socialApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-socials'] }); setEditing(null); setIsCreating(false); },
  });

  const deleteSocial = useMutation({
    mutationFn: (id: string) => socialApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-socials'] }),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-white">Social Links</h1>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-xl text-white font-medium"><FiPlus /> New Link</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-nexus-accent border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {(socials || []).map((social: any) => (
            <div key={social._id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0" style={{ color: social.color || '#ffffff' }}>
                {iconOptions.find(o => o.value === social.icon)?.icon || <FiPlus />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium">{social.platform}</h3>
                  {social.isActive === false && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">Inactive</span>}
                </div>
                <p className="text-xs text-nexus-muted truncate">{social.url}</p>
              </div>
              <div className="text-xs text-nexus-muted">Order: {social.order}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(social)} className="p-2 rounded-lg text-nexus-muted hover:text-white hover:bg-white/5 transition-all"><FiEdit2 size={16} /></button>
                <button onClick={() => { if (confirm('Delete this link?')) deleteSocial.mutate(social._id); }} className="p-2 rounded-lg text-nexus-muted hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editing) && (
        <SocialFormModal initial={editing || {}} onClose={() => { setEditing(null); setIsCreating(false); }} onSave={(data) => saveSocial.mutate(data)} />
      )}
    </motion.div>
  );
};

const SocialFormModal: React.FC<{ initial: any; onClose: () => void; onSave: (data: any) => void }> = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState({
    platform: initial.platform || '',
    url: initial.url || '',
    icon: initial.icon || 'github',
    color: initial.color || '#ffffff',
    order: initial.order ?? 0,
    isActive: initial.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...form, _id: initial._id }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg glass-strong rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-white">{initial._id ? 'Edit Social Link' : 'New Social Link'}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"><FiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-nexus-muted mb-1">Platform</label><input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" required /></div>
          <div><label className="block text-sm text-nexus-muted mb-1">URL</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" required placeholder="https://" /></div>
          <div><label className="block text-sm text-nexus-muted mb-1">Icon</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50">
              {iconOptions.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-nexus-muted mb-1">Color</label><input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} type="color" className="w-full h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer" /></div>
            <div><label className="block text-sm text-nexus-muted mb-1">Order</label><input value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} type="number" className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded bg-white/5 border-white/20 text-nexus-accent" /><span className="text-sm text-nexus-muted">Active</span></label>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-gradient-primary rounded-xl text-white font-medium">Save</motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SocialManager;
