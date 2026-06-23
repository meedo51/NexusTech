import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appsApi } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiStar } from 'react-icons/fi';

const AppsManager: React.FC = () => {
  const [search, setSearch] = useState('');
  const [editingApp, setEditingApp] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-apps', search],
    queryFn: () => appsApi.getAll({ search, limit: 100 }).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => appsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-apps'] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => appsApi.update(id, { featured: !featured } as any),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-apps'] }),
  });

  const saveApp = useMutation({
    mutationFn: (data: any) => data._id ? appsApi.update(data._id, data) : appsApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-apps'] }); setEditingApp(null); setIsCreating(false); },
  });

  const apps = data?.apps || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-white">Apps Manager</h1>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-xl text-white font-medium hover:opacity-90 transition-all">
          <FiPlus /> New App
        </button>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-nexus-muted/50 focus:outline-none focus:border-nexus-accent/50 transition-all" placeholder="Search apps..." />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-nexus-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app: any) => (
            <div key={app._id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold gradient-text">{app.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium truncate">{app.name}</h3>
                  {app.featured && <FiStar className="text-gold flex-shrink-0" />}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.status === 'active' ? 'bg-green-500/20 text-green-400' : app.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-nexus-muted truncate">{app.shortDescription || app.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleFeatured.mutate({ id: app._id, featured: app.featured })} className={`p-2 rounded-lg transition-all ${app.featured ? 'text-gold bg-gold/10' : 'text-nexus-muted hover:text-white hover:bg-white/5'}`}>
                  <FiStar size={16} />
                </button>
                <button onClick={() => setEditingApp(app)} className="p-2 rounded-lg text-nexus-muted hover:text-white hover:bg-white/5 transition-all">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => { if (confirm('Delete this app?')) deleteMutation.mutate(app._id); }} className="p-2 rounded-lg text-nexus-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editingApp) && (
        <AppFormModal
          initial={editingApp || {}}
          onClose={() => { setEditingApp(null); setIsCreating(false); }}
          onSave={(data) => saveApp.mutate(data)}
        />
      )}
    </motion.div>
  );
};

const AppFormModal: React.FC<{ initial: any; onClose: () => void; onSave: (data: any) => void }> = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: initial.name || '',
    slug: initial.slug || '',
    description: initial.description || '',
    shortDescription: initial.shortDescription || '',
    demoUrl: initial.demoUrl || '',
    githubUrl: initial.githubUrl || '',
    category: initial.category || '',
    status: initial.status || 'draft',
    featured: initial.featured || false,
    stacks: initial.stacks || [],
    features: initial.features || [],
    tags: initial.tags || [],
  });
  const [newStack, setNewStack] = useState({ name: '', color: '#667eea' });
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');

  const addStack = () => { if (newStack.name) { setForm({ ...form, stacks: [...form.stacks, { ...newStack }] }); setNewStack({ name: '', color: '#667eea' }); } };
  const addFeature = () => { if (newFeature) { setForm({ ...form, features: [...form.features, newFeature] }); setNewFeature(''); } };
  const addTag = () => { if (newTag) { setForm({ ...form, tags: [...form.tags, newTag] }); setNewTag(''); } };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...form, _id: initial._id }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-strong rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-white">{initial._id ? 'Edit App' : 'New App'}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"><FiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-nexus-muted mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" required /></div>
            <div><label className="block text-sm text-nexus-muted mb-1">Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" required /></div>
          </div>
          <div><label className="block text-sm text-nexus-muted mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" required /></div>
          <div><label className="block text-sm text-nexus-muted mb-1">Short Description</label><input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-nexus-muted mb-1">Demo URL</label><input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
            <div><label className="block text-sm text-nexus-muted mb-1">GitHub URL</label><input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-nexus-muted mb-1">Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50" /></div>
            <div><label className="block text-sm text-nexus-muted mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-nexus-accent/50"><option value="draft">Draft</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="archived">Archived</option></select></div>
          </div>

          <div><label className="block text-sm text-nexus-muted mb-1">Stacks</label>
            <div className="flex gap-2 mb-2">{form.stacks.map((s: any, i: number) => (<span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}>{s.name}<button type="button" onClick={() => setForm({ ...form, stacks: form.stacks.filter((_: any, j: number) => j !== i) })} className="ml-1 hover:opacity-70">&times;</button></span>))}</div>
            <div className="flex gap-2"><input value={newStack.name} onChange={(e) => setNewStack({ ...newStack, name: e.target.value })} className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" placeholder="Stack name" /><input value={newStack.color} onChange={(e) => setNewStack({ ...newStack, color: e.target.value })} type="color" className="w-8 h-8 rounded cursor-pointer" /><button type="button" onClick={addStack} className="px-3 py-1.5 bg-nexus-accent/20 text-nexus-accent rounded-lg text-sm">Add</button></div>
          </div>

          <div><label className="block text-sm text-nexus-muted mb-1">Features</label>
            <div className="flex flex-wrap gap-2 mb-2">{form.features.map((f: string, i: number) => (<span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white text-xs">{f}<button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_: string, j: number) => j !== i) })} className="hover:opacity-70">&times;</button></span>))}</div>
            <div className="flex gap-2"><input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" placeholder="Feature" /><button type="button" onClick={addFeature} className="px-3 py-1.5 bg-nexus-accent/20 text-nexus-accent rounded-lg text-sm">Add</button></div>
          </div>

          <div><label className="block text-sm text-nexus-muted mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">{form.tags.map((t: string, i: number) => (<span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white text-xs">{t}<button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter((_: string, j: number) => j !== i) })} className="hover:opacity-70">&times;</button></span>))}</div>
            <div className="flex gap-2"><input value={newTag} onChange={(e) => setNewTag(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" placeholder="Tag" /><button type="button" onClick={addTag} className="px-3 py-1.5 bg-nexus-accent/20 text-nexus-accent rounded-lg text-sm">Add</button></div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded bg-white/5 border-white/20 text-nexus-accent focus:ring-nexus-accent" /><span className="text-sm text-nexus-muted">Featured</span></label>

          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-gradient-primary rounded-xl text-white font-medium">Save App</motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AppsManager;
