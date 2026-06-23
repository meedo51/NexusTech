import React from 'react';

interface Props {
  address: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const AddressEditor: React.FC<Props> = ({ address, isEditing, onSave, isSaving }) => {
  const [form, setForm] = React.useState({ street: '', city: '', state: '', zipCode: '', country: 'USA' });
  React.useEffect(() => {
    if (address) setForm({ street: address.street || '', city: address.city || '', state: address.state || '', zipCode: address.zipCode || '', country: address.country || 'USA' });
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ address: form }); };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-white">Address Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Street</label>
          <input type="text" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">City</label>
          <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">State</label>
          <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">ZIP Code</label>
          <input type="text" value={form.zipCode} onChange={e => setForm({ ...form, zipCode: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Country</label>
          <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>
      {isEditing && <div className="flex justify-end pt-2"><button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button></div>}
    </form>
  );
};

export default AddressEditor;
