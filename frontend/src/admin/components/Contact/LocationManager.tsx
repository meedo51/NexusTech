import React from 'react';

interface Props {
  location: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const LocationManager: React.FC<Props> = ({ location, isEditing, onSave, isSaving }) => {
  const [form, setForm] = React.useState({ latitude: 0, longitude: 0, mapUrl: '', mapEmbedUrl: '' });

  React.useEffect(() => {
    if (location) setForm({
      latitude: location.latitude ?? 0,
      longitude: location.longitude ?? 0,
      mapUrl: location.mapUrl || '',
      mapEmbedUrl: location.mapEmbedUrl || ''
    });
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ location: form }); };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-white">Map Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Latitude</label>
          <input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Longitude</label>
          <input type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Map URL</label>
          <input type="url" value={form.mapUrl} onChange={e => setForm({ ...form, mapUrl: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Map Embed URL</label>
          <input type="url" value={form.mapEmbedUrl} onChange={e => setForm({ ...form, mapEmbedUrl: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>
      {form.mapEmbedUrl && (
        <div className="rounded-xl overflow-hidden h-48 bg-gray-700/30">
          <iframe src={form.mapEmbedUrl} className="w-full h-full" title="Map preview" style={{ border: 0 }} allowFullScreen loading="lazy" />
        </div>
      )}
      {isEditing && <div className="flex justify-end pt-2"><button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button></div>}
    </form>
  );
};

export default LocationManager;
