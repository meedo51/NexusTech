import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heroApi } from '../../services/api';
import { FiEdit2, FiPlus, FiX, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

const HeroManager: React.FC = () => {
  const [editing, setEditing] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: heroes, isLoading } = useQuery({
    queryKey: ['admin-hero'],
    queryFn: () => heroApi.getAll().then(r => r.data),
  });

  const saveHero = useMutation({
    mutationFn: (data: any) => data._id ? heroApi.update(data._id, data) : heroApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-hero'] }); setEditing(null); setIsCreating(false); },
  });

  const deleteHero = useMutation({
    mutationFn: (id: string) => heroApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-hero'] }),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-white">Hero Manager</h1>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-xl text-white font-medium"><FiPlus /> New Hero</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-nexus-accent border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {(heroes || []).map((hero: any) => (
            <div key={hero._id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold gradient-text">H</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium">{hero.title}</h3>
                  {hero.isActive && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1"><FiCheck size={10} /> Active</span>}
                </div>
                <p className="text-xs text-nexus-muted truncate">{hero.subtitle || hero.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(hero)} className="p-2 rounded-lg text-nexus-muted hover:text-white hover:bg-white/5 transition-all"><FiEdit2 size={16} /></button>
                <button onClick={() => { if (confirm('Delete this hero?')) deleteHero.mutate(hero._id); }} className="p-2 rounded-lg text-nexus-muted hover:text-red-400 hover:bg-red-500/10 transition-all"><FiX size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editing) && (
        <HeroFormModal initial={editing || {}} onClose={() => { setEditing(null); setIsCreating(false); }} onSave={(data) => saveHero.mutate(data)} />
      )}
    </motion.div>
  );
};

const HeroFormModal: React.FC<{ initial: any; onClose: () => void; onSave: (data: any) => void }> = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    subtitle: initial.subtitle || '',
    tagline: initial.tagline || '',
    ctaText: initial.ctaText || '',
    ctaLink: initial.ctaLink || '',
    isActive: initial.isActive ?? true,
    stats: initial.stats || [],
  });
  const [newStat, setNewStat] = useState({ label: '', value: '', icon: '' });

  const addStat = () => { if (newStat.label && newStat.value) { setForm({ ...form, stats: [...form.stats, { ...newStat }] }); setNewStat({ label: '', value: '', icon: '' }); } };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...form, _id: initial._id }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto glass-strong rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-white">{initial._id ? 'Edit Hero' : 'New Hero'}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"><FiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-nexus-muted mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" required /></div>
          <div><label className="block text-sm text-nexus-muted mb-1">Subtitle</label><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
          <div><label className="block text-sm text-nexus-muted mb-1">Tagline</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-nexus-muted mb-1">CTA Text</label><input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
            <div><label className="block text-sm text-nexus-muted mb-1">CTA Link</label><input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
          </div>
          <div><label className="block text-sm text-nexus-muted mb-1">Stats</label>
            {form.stats.map((s: any, i: number) => (<div key={i} className="flex items-center gap-2 mb-1"><span className="text-white text-sm">{s.label}: {s.value}</span><button type="button" onClick={() => setForm({ ...form, stats: form.stats.filter((_: any, j: number) => j !== i) })} className="text-nexus-muted hover:text-red-400">&times;</button></div>))}
            <div className="flex gap-2"><input value={newStat.label} onChange={(e) => setNewStat({ ...newStat, label: e.target.value })} className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm" placeholder="Label" /><input value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} className="w-20 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm" placeholder="Value" /><button type="button" onClick={addStat} className="px-3 py-1.5 bg-nexus-accent/20 text-nexus-accent rounded-lg text-sm">Add</button></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded bg-white/5 border-white/20 text-nexus-accent" /><span className="text-sm text-nexus-muted">Active</span></label>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-gradient-primary rounded-xl text-white font-medium">Save Hero</motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HeroManager;
